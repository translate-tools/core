import { getLanguageCodesISO639v2, isLanguageCodeISO639v2, langCodes } from './languages';

describe('isLanguageCodeISO639v2', () => {
	test('langCodes are valid langs', () => {
		langCodes.every((lang) => {
			const resutl = isLanguageCodeISO639v2(lang);
			expect(resutl).toBe(true);
		});
	});

	test('lang codes are case sensitive', () => {
		langCodes.every((lang) => {
			const upperCaseLang = lang.toUpperCase();
			const resutl = isLanguageCodeISO639v2(upperCaseLang);
			expect(resutl).toBe(false);
		});
	});

	test('random values are not valid langs', () => {
		['00', 'unknown', 'en-JA'].every((lang) => {
			const resutl = isLanguageCodeISO639v2(lang);
			expect(resutl).toBe(false);
		});
	});
});

describe('getLanguageCodesISO639v2', () => {
	test('invalid values are not picked', () => {
		const result = getLanguageCodesISO639v2(['00', 'unknown', 'qq-JA']);
		expect(result).toEqual([]);
	});

	test('no duplicates', () => {
		const result = getLanguageCodesISO639v2([
			'00',
			'unknown',
			'qq-JA',
			'en-GB',
			'en-US',
			'en_US',
			'zh_CN',
			'zh_TW',
			'ja',
		]);
		expect(result).toEqual(['en', 'zh', 'ja']);
	});
});
