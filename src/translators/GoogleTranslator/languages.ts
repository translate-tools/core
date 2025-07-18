import { LanguageAliases } from '../../languages/LanguageAliases';

/**
 * Raw languages array
 */
// prettier-ignore
export const supportedLanguages = [
	'af', 'ak', 'am', 'ar', 'as', 'ay', 'az', 'be', 'bg', 'bho',
	'bm', 'bn', 'bs', 'ca', 'ceb', 'ckb', 'co', 'cs', 'cy', 'da',
	'de', 'doi', 'dv', 'ee', 'el', 'en', 'eo', 'es', 'et', 'eu',
	'fa', 'fi', 'fr', 'fy', 'ga', 'gd', 'gl', 'gn', 'gom', 'gu',
	'ha', 'haw', 'hi', 'hmn', 'hr', 'ht', 'hu', 'hy', 'id', 'ig',
	'ilo', 'is', 'it', 'iw', 'ja', 'jw', 'ka', 'kk', 'km', 'kn',
	'ko', 'kri', 'ku', 'ky', 'la', 'lb', 'lg', 'ln', 'lo', 'lt',
	'lus', 'lv', 'mai', 'mg', 'mi', 'mk', 'ml', 'mn', 'mni-Mtei', 'mr',
	'ms', 'mt', 'my', 'ne', 'nl', 'no', 'nso', 'ny', 'om', 'or',
	'pa', 'pl', 'ps', 'pt', 'qu', 'ro', 'ru', 'rw', 'sa', 'sd',
	'si', 'sk', 'sl', 'sm', 'sn', 'so', 'sq', 'sr', 'st', 'su',
	'sv', 'sw', 'ta', 'te', 'tg', 'th', 'ti', 'tk', 'tl', 'tr',
	'ts', 'tt', 'ug', 'uk', 'ur', 'uz', 'vi', 'xh', 'yi', 'yo',
	'zh', 'zh-CN', 'zh-TW', 'zu'
];

/**
 * Map with languages aliases.
 *
 * Google translator use legacy codes for some languages,
 * this map useful to use actual language codes by aliases
 *
 * @link https://xml.coverpages.org/iso639a.html
 */
export const fixedLanguagesMap: Record<string, string> = {
	he: 'iw',
	jv: 'jw',
};

/**
 * Map ISO lang codes to google translator lang codes
 */
export const languageAliases = new LanguageAliases(supportedLanguages, {
	map: fixedLanguagesMap,
});

/**
 * @param language language code or `auto`
 * @returns mapped language
 */
export const getFixedLanguage = (language: string) =>
	languageAliases.get(language) ?? language;
