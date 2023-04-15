// TODO: Add language codes with long format `lang-sublang`
// Unsupported: ["bn-BD","bs-Latn","yue","otq","zh-Hant","zh-Hans","tlh","sr-Cyrl","sr-Latn","fil","mww","yua","mhr","pap","ceb","mrj","udm"]

// Valid ISO 639-2 codes
// eslint-disable
// prettier-ignore
export const langCodes = [
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
] as const;
// eslint-enable

let langCodesMap: Record<string, unknown> | null = null;

/**
 * Check is string are 639-2 lang code
 *
 * Values are case sensitive, if you need, you have to convert strings to lower case to check
 *
 * This function are creates object `Record<string, unknown>` with hundreds entries in RAM,
 * while first call to improve search performance. Keep in mind that this RAM never free.
 */
export const isLanguageCodeISO639v2 = (language: string) => {
	// Create map to optimize search
	if (langCodesMap === null) {
		langCodesMap = {};
		for (const lang of langCodes) {
			langCodesMap[lang] = true;
		}
	}

	return language in langCodesMap;
};

/**
 * Receive languages array and return extracted 639-2 lang codes
 */
export const getLanguageCodesISO639v2 = (languages: string[]) => {
	return languages
		.map((lang) => {
			// Remove suffix
			return lang.split(/[_-]/)[0];
		})
		.filter((language, index, languages) => {
			// Remove non standard codes
			if (!isLanguageCodeISO639v2(language)) return false;

			// Remove duplicates
			return languages.indexOf(language) === index;
		});
};
