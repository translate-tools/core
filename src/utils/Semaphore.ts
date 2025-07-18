interface Options {
	timeout?: number;
	hijackPrevention?: boolean;
}

export interface ISemaphore {
	take(): Promise<() => void>;
}

/**
 * Semaphore for the flow control in queues
 *
 * @example
 * const semafor = QueueSemafor({ timeout: 100 });
 * items.map(async item=> {
 * 	const free = await semafor.take();
 * 	// do something with item...
 * 	free();
 * })
 */
export class Semaphore implements ISemaphore {
	private readonly timeout: number = 0;
	private readonly hijackPrevention: boolean = true;

	constructor(options?: Options) {
		const { timeout, hijackPrevention } = options || {};

		if (timeout !== undefined) {
			if (timeout < 0) {
				throw new Error('Negative number');
			}

			this.timeout = timeout;
		}

		if (hijackPrevention !== undefined) {
			this.hijackPrevention = hijackPrevention;
		}
	}

	private wait = (time: number) => new Promise((res) => setTimeout(res, time));

	private lastAccess = 0;
	private semafor: Promise<void> | null = null;
	async take() {
		// Await loop
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		while (true) {
			// Wait timeout
			if (this.timeout > 0) {
				const idle = new Date().getTime() - this.lastAccess;
				if (idle < this.timeout) {
					await this.wait(this.timeout - idle);
				}
			}

			if (this.semafor === null) {
				break;
			}

			await this.semafor;

			// Wait random time until 30ms to prevent flow hijacking
			if (this.hijackPrevention) {
				await this.wait(Math.floor(Math.random() * 30));
			}
		}

		let semaforResolver: () => void;
		this.semafor = new Promise((resolve) => {
			semaforResolver = resolve;
		});

		return () => {
			this.lastAccess = new Date().getTime();
			this.semafor = null;
			semaforResolver();
		};
	}
}
