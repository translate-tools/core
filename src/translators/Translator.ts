/**
 * @deprecated this type too strict, use `string` instead
 */
export type langCode = string;

/**
 * @deprecated this type too strict, use `string` instead
 */
export type langCodeWithAuto = string;

export interface TranslatorInstanceMembers {
	/**
	 * Translate text
	 * @returns Translated string
	 */
	translate(
		text: string,
		langFrom: langCodeWithAuto,
		langTo: langCode,
	): Promise<string>;

	/**
	 * Translate texts array
	 * @returns Array with translated strings and same length as input array
	 * @returns Texts that did not translated will replaced to `null`
	 */
	translateBatch(
		text: string[],
		langFrom: langCodeWithAuto,
		langTo: langCode,
	): Promise<Array<string | null>>;

	/**
	 * Check string or array of stings to exceeding a limit
	 *
	 * It need for modules with complexity logic of encoding a strings.
	 * For example, when in `translateBatch` text merge to string
	 * and split to chunks by tokens with ID: `<id1>Text 1</id1><id2>Text 2</id2>`
	 *
	 * Here checked result of encoding a input data
	 * @returns number of extra chars
	 */
	checkLimitExceeding(text: string | string[]): number;

	/**
	 * Check supporting of translate direction
	 */
	checkDirection?: (langFrom: langCodeWithAuto, langTo: langCode) => boolean;

	/**
	 * Max length of string for `translate` or total length of strings from array for `translateBatch`
	 */
	getLengthLimit(): number;

	/**
	 * Delay between requests that required by translator to a correct work
	 */
	getRequestsTimeout: () => number;
}

/**
 * Static members useful to choose most suitable translator in list by features
 */
export interface TranslatorStaticMembers {
	/**
	 * Public translator name to displaying
	 */
	readonly translatorName: string;

	/**
	 * Is required API key for this module
	 */
	isRequiredKey(): boolean;

	/**
	 * Is it supported value `auto` in `langFrom` argument of `translate` and `translateBatch` methods
	 */
	isSupportedAutoFrom(): boolean;

	/**
	 * Array of supported languages as ISO 639-1 codes
	 */
	getSupportedLanguages(): langCode[];
}

/**
 * Translator class contract
 *
 * This type describe static members and members for instance both
 */
export interface TranslatorClass<
	InstanceProps extends TranslatorInstanceMembers = TranslatorInstanceMembers,
> extends TranslatorStaticMembers {
	new (...args: any[]): InstanceProps;
}
