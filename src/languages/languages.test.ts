import {
	getLanguageCodesISO639,
	isLanguageCodeISO639v1,
	isLanguageCodeISO639v2,
} from '.';

describe('isLanguageCodeISO639v2', () => {
	test('v1 langCodes are valid', () => {
		getLanguageCodesISO639('v1').every((lang) => {
			const result = isLanguageCodeISO639v1(lang);
			expect(result).toBe(true);
		});
	});

	test('v2 langCodes are valid', () => {
		getLanguageCodesISO639('v2').every((lang) => {
			const result = isLanguageCodeISO639v2(lang);
			expect(result).toBe(true);
		});
	});

	test('lang codes are case sensitive', () => {
		getLanguageCodesISO639('v1').every((lang) => {
			const upperCaseLang = lang.toUpperCase();
			const result = isLanguageCodeISO639v1(upperCaseLang);
			expect(result).toBe(false);
		});
	});

	test('random values are not valid langs', () => {
		['00', 'unknown', 'en-JA'].every((lang) => {
			const resultV1 = isLanguageCodeISO639v1(lang);
			expect(resultV1).toBe(false);

			const resultV2 = isLanguageCodeISO639v2(lang);
			expect(resultV2).toBe(false);
		});
	});
});
