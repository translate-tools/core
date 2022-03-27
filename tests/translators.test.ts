import { TranslatorClass } from '../src/types/Translator';

import {
	GoogleTranslator,
	GoogleTranslatorTokenFree,
} from '../src/translators/GoogleTranslator';
import { YandexTranslator } from '../src/translators/YandexTranslator';
import { BingTranslatorPublic } from '../src/translators/unstable/BingTranslatorPublic';
import { ReversoTranslator } from '../src/translators/unstable/ReversoTranslator';

const commonTranslatorOptions = {
	headers: {
		// This is required for most translate services API
		'User-Agent':
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36',
	},
};

// Verify types
const translators: TranslatorClass[] = [
	GoogleTranslator,
	GoogleTranslatorTokenFree,

	// TODO: make it work in node and test it all
	YandexTranslator,
	BingTranslatorPublic,
	ReversoTranslator,
].slice(0, 2);

// TODO: use `こんにちは` > `hello`
describe('Test translators', () => {
	translators.forEach((translatorClass) => {
		const translatorName = translatorClass.translatorName;

		test(`${translatorName}: test "translate" method`, (done) => {
			const translator = new translatorClass(commonTranslatorOptions);
			translator
				.translate('Hello world', 'en', 'ru')
				.then((translation) => {
					expect(typeof translation).toBe('string');
					expect(translation).toContain('мир');

					done();
				})
				.catch(done);
		});

		test(`${translatorName}: test "translateBatch" method with 1 text`, (done) => {
			const translator = new translatorClass(commonTranslatorOptions);
			translator
				.translateBatch(['Hello world'], 'en', 'ru')
				.then((translation) => {
					expect(Array.isArray(translation)).toBe(true);
					expect(translation.length).toBe(1);

					expect(translation[0]).toContain('мир');

					done();
				})
				.catch(done);
		});

		test(`${translatorName}: test "translateBatch" method with 2 texts`, (done) => {
			const translator = new translatorClass(commonTranslatorOptions);
			translator
				.translateBatch(['Hello world', 'my name is Jeff'], 'en', 'ru')
				.then((translation) => {
					expect(Array.isArray(translation)).toBe(true);
					expect(translation.length).toBe(2);

					expect(translation[0]).toContain('мир');
					expect(translation[1]).toContain('Джефф');

					done();
				})
				.catch(done);
		});

		// Test direction auto
		if (translatorClass.isSupportedAutoFrom()) {
			test(`${translatorName}: test "translate" method and language auto detection`, (done) => {
				const translator = new translatorClass(commonTranslatorOptions);
				translator
					.translate('Hello world', 'auto', 'ru')
					.then((translation) => {
						expect(typeof translation).toBe('string');
						expect(translation).toContain('мир');

						done();
					})
					.catch(done);
			});

			test(`${translatorName}: test "translateBatch" method with 1 text and language auto detection`, (done) => {
				const translator = new translatorClass(commonTranslatorOptions);
				translator
					.translateBatch(['Hello world'], 'auto', 'ru')
					.then((translation) => {
						expect(Array.isArray(translation)).toBe(true);
						expect(translation.length).toBe(1);

						expect(translation[0]).toContain('мир');

						done();
					})
					.catch(done);
			});

			test(`${translatorName}: test "translateBatch" method with 2 texts and language auto detection`, (done) => {
				const translator = new translatorClass(commonTranslatorOptions);
				translator
					.translateBatch(['Hello world', 'my name is Jeff'], 'auto', 'ru')
					.then((translation) => {
						expect(Array.isArray(translation)).toBe(true);
						expect(translation.length).toBe(2);

						expect(translation[0]).toContain('мир');
						expect(translation[1]).toContain('Джефф');

						done();
					})
					.catch(done);
			});
		}
	});
});
