export { Scheduler } from './Scheduler';
export { SchedulerWithCache } from './SchedulerWithCache';

import { langCode, langCodeWithAuto } from '../translators/Translator';

export interface ISchedulerTranslateOptions {
	/**
	 * Identifier to grouping requests
	 */
	context?: string;

	/**
	 * Priority index for translate queue
	 */
	priority?: number;

	/**
	 * Use direct translate for this request if it possible
	 */
	directTranslate?: boolean;
}

export interface IScheduler {
	/**
	 * Translate text
	 *
	 * @param text text for translation
	 * @param from text language code
	 * @param to target language code for translation
	 * @param options {ISchedulerTranslateOptions}
	 */
	translate(
		text: string,
		from: langCodeWithAuto,
		to: langCode,
		options?: ISchedulerTranslateOptions,
	): Promise<string>;

	/**
	 * Abort translation for all requests with provided context
	 * - All delayed requests will be immediately rejected
	 * - If exception thrown for in-flight requests, they will be rejected immediately with no retries
	 *
	 * @param context unique name for group of requests that must be aborted
	 */
	abort(context: string): Promise<void>;
}
