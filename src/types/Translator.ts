// TODO: Add language codes with long format `lang-sublang`
// Unsupported: ["bn-BD","bs-Latn","yue","otq","zh-Hant","zh-Hans","tlh","sr-Cyrl","sr-Latn","fil","mww","yua","mhr","pap","ceb","mrj","udm"]

// Valid ISO 639-2 codes
// eslint-disable
// prettier-ignore
export const langCodes = <const>[
	"aa", "ab", "af", "ak", "sq", "am", "ar", "an", "hy", "as",
	"av", "ae", "ay", "az", "ba", "bm", "eu", "be", "bn", "bh",
	"bi", "bo", "bs", "br", "bg", "my", "ca", "cs", "ch", "ce",
	"zh", "cu", "cv", "kw", "co", "cr", "cy", "da", "de", "dv",
	"nl", "dz", "el", "en", "eo", "et", "ee", "fo", "fa", "fj",
	"fi", "fr", "fy", "ff", "ka", "gd", "ga", "gl", "gv", "gn",
	"gu", "ht", "ha", "he", "hz", "hi", "ho", "hr", "hu", "ig",
	"is", "io", "ii", "iu", "ie", "ia", "id", "ik", "it", "jv",
	"ja", "kl", "kn", "ks", "kr", "kk", "km", "ki", "rw", "ky",
	"kv", "kg", "ko", "kj", "ku", "lo", "la", "lv", "li", "ln",
	"lt", "lb", "lu", "lg", "mk", "mh", "ml", "mi", "mr", "ms",
	"mg", "mt", "mn", "na", "nv", "nr", "nd", "ng", "ne", "nn",
	"nb", "no", "ny", "oc", "oj", "or", "om", "os", "pa", "pi",
	"pl", "pt", "ps", "qu", "rm", "ro", "rn", "ru", "sg", "sa",
	"si", "sk", "sl", "se", "sm", "sn", "sd", "so", "st", "es",
	"sc", "sr", "ss", "su", "sw", "sv", "ty", "ta", "tt", "te",
	"tg", "tl", "th", "ti", "to", "tn", "ts", "tk", "tr", "tw",
	"ug", "uk", "ur", "uz", "ve", "vi", "vo", "wa", "wo", "xh",
	"yi", "yo", "za", "zu"
];

// eslint-enable

export type langCode = typeof langCodes[number];
export type langCodeWithAuto = 'auto' | langCode;

export interface TranslatorInstanceMembers {
	/**
	 * Translate text from string
	 * @returns Translated string
	 */
	translate(
		text: string,
		langFrom: langCodeWithAuto,
		langTo: langCode,
	): Promise<string>;

	/**
	 * Translate text from array of string
	 * @returns Array with translated strings and same length as input array
	 * @returns Text which did not translated will replaced to `null`
	 */
	translateBatch(
		text: string[],
		langFrom: langCodeWithAuto,
		langTo: langCode,
	): Promise<Array<string | null>>;

	/**
	 * Check string or array of stings to exceeding of a limit
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
	 * Recommended delay between requests
	 */
	getRequestsTimeout: () => number;
}

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
 * Base translator object contract
 */
export interface TranslatorClass<
	InstanceProps extends TranslatorInstanceMembers = TranslatorInstanceMembers,
> extends TranslatorStaticMembers {
	new (...args: any[]): InstanceProps;
}
