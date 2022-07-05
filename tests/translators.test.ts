import { readFileSync } from 'fs';
import path from 'path';

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

const isStringStartFromLetter = (text: string) => Boolean(text.match(/^\p{Letter}/u));

const currentDir = path.dirname(__filename);
const longTextForTest = readFileSync(
	path.resolve(currentDir, 'resources/text-long.txt'),
).toString('utf8');

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
					expect(isStringStartFromLetter(translation)).toBeTruthy();

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
					expect(
						isStringStartFromLetter(translation[0] as string),
					).toBeTruthy();

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

					translation.every((translation) => {
						expect(typeof translation).toBe('string');
						expect(
							isStringStartFromLetter(translation as string),
						).toBeTruthy();
					});

					done();
				})
				.catch(done);
		});

		// Test long text
		test(`${translatorName}: test long text for "translate" method`, (done) => {
			const translator = new translatorClass(commonTranslatorOptions);
			translator
				.translate(longTextForTest, 'en', 'ru')
				.then((translation) => {
					expect(typeof translation).toBe('string');

					const expectedMinimalLength = longTextForTest.length * 0.7;
					expect(translation.length >= expectedMinimalLength).toBeTruthy();

					expect(isStringStartFromLetter(translation)).toBeTruthy();

					done();
				})
				.catch(done);
		});

		test(`${translatorName}: test long text for "translateBatch" method`, (done) => {
			const translator = new translatorClass(commonTranslatorOptions);
			translator
				.translateBatch([longTextForTest], 'en', 'ru')
				.then(([translation]) => {
					expect(typeof translation).toBe('string');

					const expectedMinimalLength = longTextForTest.length * 0.7;
					expect(
						(translation as string).length >= expectedMinimalLength,
					).toBeTruthy();

					expect(isStringStartFromLetter(translation as string)).toBeTruthy();

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

						expect(isStringStartFromLetter(translation)).toBeTruthy();

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

						expect(typeof translation[0]).toBe('string');

						expect(translation[0]).toContain('мир');

						expect(
							isStringStartFromLetter(translation[0] as string),
						).toBeTruthy();

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

						expect(typeof translation[0]).toBe('string');
						expect(typeof translation[1]).toBe('string');

						expect(translation[0]).toContain('мир');
						expect(translation[1]).toContain('Джефф');

						expect(
							isStringStartFromLetter(translation[0] as string),
						).toBeTruthy();
						expect(
							isStringStartFromLetter(translation[1] as string),
						).toBeTruthy();

						done();
					})
					.catch(done);
			});
		}
	});
});
