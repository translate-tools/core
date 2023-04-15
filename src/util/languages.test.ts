import { isLanguageCodeISO639v2, langCodes } from './languages';

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
