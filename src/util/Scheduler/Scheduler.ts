import { ITranslateOptions, IScheduler } from './IScheduler';
import {
	langCode,
	langCodeWithAuto,
	TranslatorInstanceMembers,
} from '../../types/Translator';
import { QueueSemafor } from '../../lib/QueueSemafor';

interface Config {
	/**
	 * Number of attempts for retry request
	 */
	translateRetryAttemptLimit?: number;

	/**
	 * If true - rejected requests will use direct translate
	 */
	isAllowDirectTranslateBadChunks?: boolean;

	/**
	 * Length of string for direct translate.
	 *
	 * null for disable the condition
	 */
	directTranslateLength?: number | null;

	/**
	 * Delay for translate a chunk. The bigger the more requests will collect
	 */
	translatePoolDelay?: number;

	/**
	 * When chunk collect this size, it's will be instant add to a translate queue
	 *
	 * null for disable the condition
	 */
	chunkSizeForInstantTranslate?: number | null;

	/**
	 * Pause between handle task batches
	 *
	 * It may be useful to await accumulating a task batches in queue to consider priority better and don't translate first task batch immediately
	 *
	 * WARNING: this option must be used only for consider priority better! Set small value always (10-50ms)
	 *
	 * When this option is disabled (by default) and you call translate method for texts with priority 1 and then immediately for text with priority 2, first request will have less delay for translate and will translate first, even with lower priority, because worker will translate first task immediately after delay defined by option `translatePoolDelay`
	 */
	taskBatchHandleDelay?: null | number;
}

interface TaskConstructor {
	text: string;
	from: langCodeWithAuto;
	to: langCode;

	/**
	 * To combine tasks by unique key
	 */
	context?: string;

	/**
	 * To combine and sort tasks by priority
	 */
	priority: number;
}

interface TaskConstructorInternal extends TaskConstructor {
	/**
	 * Current retry attempt
	 */
	attempt?: number;

	resolve: (value: string | PromiseLike<string>) => void;
	reject: (reason?: any) => void;
}

interface Task {
	text: string;
	from: langCodeWithAuto;
	to: langCode;

	/**
	 * Current retry attempt
	 */
	attempt: number;

	resolve: (value: string | PromiseLike<string>) => void;
	reject: (reason?: any) => void;
}

interface TaskContainer {
	/**
	 * For combine tasks by unique key
	 */
	context: string;

	priority: number;

	from: langCodeWithAuto;
	to: langCode;
	tasks: Task[];

	/**
	 * Total length of text from all tasks
	 */
	length: number;
}

type IteratorStep<T> = {
	done: boolean;
	value: T | null;
};

/**
 * Module for scheduling and optimization of translate a text streams
 *
 * - It can union many translate requests to one
 * - You can group any requests by context
 * - It's configurable. You can set retry limit and edge for direct translate
 */
export class Scheduler implements IScheduler {
	private readonly semafor;
	private readonly translator;
	private readonly config: Required<Config> = {
		translateRetryAttemptLimit: 2,
		isAllowDirectTranslateBadChunks: true,
		directTranslateLength: null,
		translatePoolDelay: 300,
		chunkSizeForInstantTranslate: null,
		taskBatchHandleDelay: null,
	};

	constructor(translator: TranslatorInstanceMembers, config?: Config) {
		this.translator = translator;

		if (config !== undefined) {
			for (const key in config) {
				(this.config as any)[key] = (config as any)[key];
			}
		}

		this.semafor = new QueueSemafor({ timeout: translator.getRequestsTimeout() });
	}

	private contextCounter = 0;
	public async translate(
		text: string,
		from: langCodeWithAuto,
		to: langCode,
		options?: ITranslateOptions,
	) {
		const {
			context = '',
			priority = 0,
			directTranslate: directTranslateForThisRequest = false,
		} = options !== undefined ? options : {};

		if (this.translator.checkLimitExceeding(text) <= 0) {
			// Direct translate
			if (
				directTranslateForThisRequest ||
				(this.config.directTranslateLength !== null &&
					text.length >= this.config.directTranslateLength)
			) {
				return this.directTranslate(text, from, to);
			} else {
				return this.makeTask({ text: text, from, to, context, priority });
			}
		} else {
			// Split text by words and translate
			return this.splitAndTranslate(text, from, to, context, priority);
		}
	}

	private async directTranslate(text: string, from: langCodeWithAuto, to: langCode) {
		const free = await this.semafor.take();
		return this.translator.translate(text, from, to).finally(free);
	}

	private splitAndTranslate(
		text: string,
		from: langCodeWithAuto,
		to: langCode,
		context: string,
		priority: number,
	) {
		const splittedText: string[] = [];
		const charsetIndexes: number[] = [];

		let wordsBuffer = '';
		for (const textMatch of text.matchAll(/([^\s]+)(\s*)/g)) {
			const newPart = textMatch[0];
			const newBuffer = wordsBuffer + newPart;

			// Add word to buffer if can
			if (this.translator.checkLimitExceeding(newBuffer) <= 0) {
				wordsBuffer = newBuffer;
				continue;
			}

			// Write and clear buffer if not empthy
			if (wordsBuffer.length > 0) {
				splittedText.push(wordsBuffer);
				wordsBuffer = '';
			}

			// Handle new part
			if (this.translator.checkLimitExceeding(newPart) <= 0) {
				// Add to buffer
				wordsBuffer += newPart;
				continue;
			} else {
				// Slice by chars
				let charsBuffer = newPart;
				while (charsBuffer.length > 0) {
					const extraChars = this.translator.checkLimitExceeding(charsBuffer);
					if (extraChars > 0) {
						const offset = charsBuffer.length - extraChars;

						// Write slice and remainder
						splittedText.push(charsBuffer.slice(0, offset));
						charsBuffer = charsBuffer.slice(offset);

						charsetIndexes.push(splittedText.length - 1);
					}
				}
			}
		}

		const ctxPrefix = context.length > 0 ? context + ';' : '';
		return Promise.all(
			splittedText.map((text, index) =>
				charsetIndexes.indexOf(index) !== -1
					? text
					: this.makeTask({
						text,
						from,
						to,
						context: ctxPrefix + `text#${this.contextCounter++}`,
						priority,
					  }),
			),
		).then((translatedParts) => translatedParts.join(''));
	}

	private makeTask({ text, from, to, priority, context = '' }: TaskConstructor) {
		return new Promise<string>((resolve, reject) => {
			this.addToTaskContainer({
				text,
				from,
				to,
				context,
				priority,
				resolve,
				reject,
			});
		});
	}

	private readonly taskContainersStorage = new Set<TaskContainer>();
	private addToTaskContainer(params: TaskConstructorInternal) {
		const {
			text,
			from,
			to,
			attempt = 0,
			context = '',
			priority,
			resolve,
			reject,
		} = params;

		// create task
		const task: Task = {
			text,
			from,
			to,
			attempt,
			resolve,
			reject,
		};

		let container: TaskContainer | null = null;

		// try add to exists container
		for (const taskContainer of this.taskContainersStorage) {
			// Skip containers with not equal parameters
			if (
				['from', 'to', 'context', 'priority'].some(
					(key) => (params as any)[key] !== (taskContainer as any)[key],
				)
			)
				continue;

			// Lightweight check to overflow
			// NOTE: Do strict check here if you need comply a limit contract
			if (
				this.translator.getLengthLimit() >=
				taskContainer.length + task.text.length
			) {
				taskContainer.tasks.push(task);
				taskContainer.length += task.text.length;
				container = taskContainer;
			}
		}

		// make container
		if (container === null) {
			const newTaskContainer: TaskContainer = {
				context,
				priority,
				from,
				to,
				tasks: [task],
				length: task.text.length,
			};
			this.taskContainersStorage.add(newTaskContainer);
			container = newTaskContainer;
		}

		if (
			this.config.chunkSizeForInstantTranslate !== null &&
			container.length >= this.config.chunkSizeForInstantTranslate
		) {
			this.addToTranslateQueue(container);
		} else {
			this.updateDelayForAddToTranslateQueue(container);
		}
	}

	private readonly timersMap = new Map<TaskContainer, number | NodeJS.Timeout>();
	private updateDelayForAddToTranslateQueue(taskContainer: TaskContainer) {
		// Flush timer
		if (this.timersMap.has(taskContainer)) {
			// Due to expectation run on one platform, timer objects will same always
			globalThis.clearTimeout(this.timersMap.get(taskContainer) as any);
		}

		this.timersMap.set(
			taskContainer,
			globalThis.setTimeout(() => {
				this.addToTranslateQueue(taskContainer);
			}, this.config.translatePoolDelay),
		);
	}

	/**
	 * Tasks queue with items sorted by priority
	 * It must be handled from end to start
	 */
	private translateQueue: TaskContainer[] = [];
	private addToTranslateQueue(taskContainer: TaskContainer) {
		// Flush timer
		if (this.timersMap.has(taskContainer)) {
			// Due to expectation run on one platform, timer objects will same always
			globalThis.clearTimeout(this.timersMap.get(taskContainer) as any);
			this.timersMap.delete(taskContainer);
		}

		this.taskContainersStorage.delete(taskContainer);

		// Resort queue by priority each time to keep consistency
		this.translateQueue = this.translateQueue
			.concat(taskContainer)
			.sort((a, b) => a.priority - b.priority);

		if (!this.workerState) {
			this.runWorker();
		}
	}

	/**
	 * Return first item from queue and delete it from queue
	 * Items is sorted by priority
	 */
	private getItemFromTranslateQueue = (): IteratorStep<TaskContainer> => {
		return {
			done: this.translateQueue.length === 0,
			value: this.translateQueue.pop() ?? null,
		};
	};

	private workerState = false;
	private async runWorker() {
		this.workerState = true;

		let firstIteration = true;
		while (true) {
			// Delay first iteration to await fill the queue, to consider priority better
			const workerHandleDelay = this.config.taskBatchHandleDelay;
			if (workerHandleDelay && firstIteration) {
				await new Promise((res) => setTimeout(res, workerHandleDelay));
			}

			firstIteration = false;

			const iterate = this.getItemFromTranslateQueue();

			// Skip when queue empty
			if (iterate.done || iterate.value === null) break;

			const taskContainer = iterate.value;

			const free = await this.semafor.take();

			const textArray = taskContainer.tasks.map((i) => i.text);
			await this.translator
				.translateBatch(textArray, taskContainer.from, taskContainer.to)
				.then((result) => {
					for (const index in taskContainer.tasks) {
						const task = taskContainer.tasks[index];

						const translatedText = result[index];
						if (translatedText !== null) {
							task.resolve(translatedText);
						} else {
							this.taskErrorHandler(
								task,
								new Error("Translator module can't translate this"),
								taskContainer.context,
								taskContainer.priority,
							);
						}
					}
				})
				.catch((reason) => {
					console.error(reason);

					for (const task of taskContainer.tasks) {
						this.taskErrorHandler(
							task,
							reason,
							taskContainer.context,
							taskContainer.priority,
						);
					}
				})
				.finally(free);
		}

		this.workerState = false;
	}

	private taskErrorHandler(task: Task, error: any, context: string, priority: number) {
		if (task.attempt >= this.config.translateRetryAttemptLimit) {
			if (this.config.isAllowDirectTranslateBadChunks) {
				const { text, from, to, resolve, reject } = task;
				this.directTranslate(text, from, to).then(resolve, reject);
			} else {
				task.reject(error);
			}
		} else {
			this.addToTaskContainer({
				...task,
				attempt: task.attempt + 1,
				context,
				priority,
			});
		}
	}
}
