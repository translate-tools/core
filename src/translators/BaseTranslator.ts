import { Fetcher, FetcherOptions, FetcherRequestType } from '../utils/Fetcher';
import { basicFetcher } from '../utils/Fetcher/basicFetcher';
import { TranslatorInstanceMembers, langCode, langCodeWithAuto } from './Translator';

export type TranslatorOptions<O extends Record<any, any> = {}> = O & {
	/**
	 * API endpoint URL
	 */
	apiHost?: string;

	/**
	 * Access key for requests to translator API
	 */
	apiKey?: string;

	/**
	 * Union text array to 1 request (or more, but less than usualy anyway).
	 *
	 * Option for reduce the number of requests, but it can make artefacts in translated text.
	 *
	 * Some modules may not support this feature.
	 */
	useMultiplexing?: boolean;

	/**
	 * Additional headers for requests
	 */
	headers?: Record<string, string>;

	/**
	 * Custom fetcher
	 */
	fetcher?: Fetcher;
};

// TODO: remove it and provide utils to implement translators
/**
 * Basic abstract class for translator
 */

export abstract class BaseTranslator<C extends Record<any, any> = {}>
implements TranslatorInstanceMembers
{
	public static readonly translatorName: string = 'UnknownTranslator';

	public static isRequiredKey = () => false;

	public static isSupportedAutoFrom = () => false;

	public static getSupportedLanguages = (): langCode[] => [];

	public abstract getLengthLimit(): number;

	public abstract getRequestsTimeout(): number;

	protected readonly options = {} as TranslatorOptions<C>;
	constructor(options?: TranslatorOptions<C>) {
		if (options !== undefined) {
			this.options = options;
		}
	}

	abstract translate(
		text: string,
		langFrom: langCodeWithAuto,
		langTo: langCode,
	): Promise<string>;

	abstract translateBatch(
		text: string[],
		langFrom: langCodeWithAuto,
		langTo: langCode,
	): Promise<Array<string | null>>;

	public checkLimitExceeding(text: string | string[]) {
		const plainText = Array.isArray(text) ? text.join('') : text;
		const extra = plainText.length - this.getLengthLimit();
		return extra > 0 ? extra : 0;
	}

	/**
	 * Util to wrap url to CORS proxy
	 */
	protected wrapUrlToCorsProxy = (url: string) => {
		// Use as prefix
		if (typeof this.options.corsProxy === 'string') {
			return this.options.corsProxy + url;
		}

		// Run user defined transformation
		if (typeof this.options.corsProxy === 'function') {
			return this.options.corsProxy(url);
		}

		return url;
	};

	protected fetch: Fetcher = async <T extends FetcherRequestType>(
		url: string,
		options: FetcherOptions<T>,
	) => {
		const fetcher = this.options.fetcher ?? basicFetcher;
		return fetcher(url, options);
	};
}
