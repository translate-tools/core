import { langCodeWithAuto, langCode } from '../../types/Translator';

export interface ITranslateOptions {
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
		options?: ITranslateOptions,
	): Promise<string>;
}
