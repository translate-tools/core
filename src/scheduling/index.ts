export { Scheduler } from './Scheduler';
export { SchedulerWithCache } from './SchedulerWithCache';

import { langCodeWithAuto, langCode } from '../translators/Translator';

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
	translate(
		text: string,
		from: langCodeWithAuto,
		to: langCode,
		options?: ISchedulerTranslateOptions,
	): Promise<string>;
}
