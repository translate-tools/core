import { readFileSync } from 'fs';
import path from 'path';

import { DuckDuckGoLLMTranslator } from '.';

const LONG_TEXT_TRANSLATION_TIMEOUT = 80000;

const isStringStartFromLetter = (text: string) => Boolean(text.match(/^\p{Letter}/u));

const currentDir = path.dirname(__filename);
const midTextForTest = readFileSync(
	path.resolve(currentDir, '../../__tests__/resources/text-middle.txt'),
).toString('utf8');
const textOffensive = readFileSync(
	path.resolve(currentDir, '../../__tests__/resources/text-offensive.txt'),
).toString('utf8');

// DuckDuckGoLLMTranslator handles only short and middle texts and a limited number of requests

describe('DuckDuckGoLLMTranslator', () => {
	vi.setConfig({ testTimeout: 60_000 });

	test('Method "getSupportedLanguages" returns a minimum of two language codes', () => {
		expect(
			DuckDuckGoLLMTranslator.getSupportedLanguages().length,
		).toBeGreaterThanOrEqual(2);
	});

	test(`Method "translate" supports chinese language`, async () => {
		// Method "getSupportedLanguages" supports chinese language
		expect(DuckDuckGoLLMTranslator.getSupportedLanguages()).toContain('zh');

		// translate
		const translator = new DuckDuckGoLLMTranslator();
		await translator.translate('Hello world', 'en', 'zh').then((translation) => {
			expect(typeof translation).toBe('string');
			expect(translation).toContain('世界');
			expect(isStringStartFromLetter(translation)).toBeTruthy();
		});
	});

	test(`Translate small text with method "translate"`, async () => {
		const translator = new DuckDuckGoLLMTranslator();
		await translator.translate('Hello world', 'en', 'ru').then((translation) => {
			expect(typeof translation).toBe('string');
			expect(translation).toContain('мир');
			expect(isStringStartFromLetter(translation)).toBeTruthy();
		});
	});

	test(
		'Translate middle string with "translateBatch" method',
		async () => {
			const translator = new DuckDuckGoLLMTranslator();

			await translator
				.translateBatch([midTextForTest], 'en', 'ru')
				.then(([translation]) => {
					expect(typeof translation).toBe('string');

					const expectedMinimalLength = midTextForTest.length * 0.7;
					expect((translation as string).length).toBeGreaterThanOrEqual(
						expectedMinimalLength,
					);
				});
		},
		LONG_TEXT_TRANSLATION_TIMEOUT,
	);

	test(
		`Translate many texts with "translateBatch" method`,
		async () => {
			const textsToTranslate = [
				'View source',
				'View history',
				'that',
				'athletics',
				'The',
				'province contracted to',
			];

			const translator = new DuckDuckGoLLMTranslator();
			const translation = await translator.translateBatch(
				textsToTranslate,
				'en',
				'ru',
			);
			expect(typeof translation).toBe('object');
			expect(translation.length).toBe(textsToTranslate.length);
			expect(typeof translation[4]).toBe('string');
			expect(typeof translation[2]).toBe('string');
		},
		LONG_TEXT_TRANSLATION_TIMEOUT,
	);

	test(`Translate text using the "translateBatch" method with the "auto" direction`, async () => {
		const translator = new DuckDuckGoLLMTranslator();
		translator.translateBatch(['Hello world'], 'auto', 'ru').then((translation) => {
			expect(Array.isArray(translation)).toBe(true);
			expect(translation.length).toBe(1);

			expect(typeof translation[0]).toBe('string');

			expect(translation[0]).toContain('мир');

			expect(isStringStartFromLetter(translation[0] as string)).toBeTruthy();
		});
	});

	test('Translate offensive text', async () => {
		const translator = new DuckDuckGoLLMTranslator();

		await translator.translate(textOffensive, 'en', 'ru').then((translation) => {
			expect(typeof translation).toBe('string');

			const expectedMinimalLength = textOffensive.length * 0.7;
			expect(translation.length).toBeGreaterThanOrEqual(expectedMinimalLength);

			// The translation needs to contain one of the word forms
			expect(translation).toMatch(/ниг\W+?|нег\W+?/);
		});
	});
});
