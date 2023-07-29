import languages from './ISO639LangCodesList';

/**
 * Check is string are 639-1 lang code
 *
 * Values are case sensitive, if you need, you have to convert strings to lower case to check
 */
export const isLanguageCodeISO639v1 = (code: string) => {
	return Boolean(code && languages.some((lang) => code === lang.v1));
};

/**
 * Check is string are 639-2 lang code
 *
 * Values are case sensitive, if you need, you have to convert strings to lower case to check
 */
export const isLanguageCodeISO639v2 = (code: string) => {
	return Boolean(
		code &&
			languages.some(
				(lang) => code === lang.v2 || code === lang.v2B || code === lang.v2T,
			),
	);
};

/**
 * Return subset of ISO-639 lang codes
 */
export const getLanguageCodesISO639 = (set: 'v1' | 'v2') => {
	const pickedLanguages: string[] = [];
	for (const lang of languages) {
		switch (set) {
		case 'v1':
			if (lang.v1) {
				pickedLanguages.push(lang.v1);
			}
			break;
		case 'v2':
			pickedLanguages.push(lang.v2);
			break;
		}
	}

	return pickedLanguages;
};
