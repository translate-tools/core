import { FakeTranslator } from './FakeTranslator';
import { createFallbackTranslator } from './FallbackTranslator';

test('First translator must be used when possible', async () => {
	const FallbackTranslator = createFallbackTranslator([
		{
			languages: new Set(['en', 'de']),
			languageDetection: false,
			translator: new FakeTranslator({ prefix: '*1' }),
		},
		{
			languages: new Set(['en', 'de']),
			languageDetection: false,
			translator: new FakeTranslator({ prefix: '*2' }),
		},
	]);

	await expect(new FallbackTranslator().translate('foo', 'en', 'de')).resolves.toMatch(
		/^\*1/,
	);
});

test('Fallback translator must be used when preferred translator does not work', async () => {
	const translator1 = new FakeTranslator({ prefix: '*1' });
	vi.spyOn(translator1, 'translate').mockImplementation(async () => {
		throw new Error('Fake error');
	});
	const FallbackTranslator = createFallbackTranslator([
		{
			languages: new Set(['en', 'de']),
			languageDetection: false,
			translator: translator1,
		},
		{
			languages: new Set(['en', 'de']),
			languageDetection: false,
			translator: new FakeTranslator({ prefix: '*2' }),
		},
	]);

	const onTranslatorError = vi.fn();
	await expect(
		new FallbackTranslator({ onTranslatorError }).translate('foo', 'en', 'de'),
	).resolves.toMatch(/^\*2/);

	expect(onTranslatorError).toBeCalledTimes(1);
	expect(onTranslatorError).toBeCalledWith(
		expect.objectContaining({ message: 'Fake error' }),
		translator1,
	);
});

test('Error must be thrown when no one translator does not work', async () => {
	const translator1 = new FakeTranslator({ prefix: '*1' });
	vi.spyOn(translator1, 'translate').mockImplementation(async () => {
		throw new Error('Fake error');
	});

	const translator2 = new FakeTranslator({ prefix: '*2' });
	vi.spyOn(translator2, 'translate').mockImplementation(async () => {
		throw new Error('Fake error');
	});

	const FallbackTranslator = createFallbackTranslator([
		{
			languages: new Set(['en', 'de']),
			languageDetection: false,
			translator: translator1,
		},
		{
			languages: new Set(['en', 'de']),
			languageDetection: false,
			translator: translator2,
		},
	]);

	await expect(new FallbackTranslator().translate('foo', 'en', 'de')).rejects.toThrow();
});

test('The translator that does work most recently must be remembered', async () => {
	const translator1 = new FakeTranslator({ prefix: '*1' });
	vi.spyOn(translator1, 'translate').mockImplementation(async () => {
		throw new Error('Fake error');
	});
	const translator2 = new FakeTranslator({ prefix: '*2' });
	vi.spyOn(translator2, 'translate');

	const translator3 = new FakeTranslator({ prefix: '*3' });
	vi.spyOn(translator3, 'translate');
	const FallbackTranslator = createFallbackTranslator([
		{
			languages: new Set(['en', 'de']),
			languageDetection: false,
			translator: translator1,
		},
		{
			languages: new Set(['en', 'de']),
			languageDetection: false,
			translator: translator2,
		},
		{
			languages: new Set(['en', 'de']),
			languageDetection: false,
			translator: translator3,
		},
	]);

	const translator = new FallbackTranslator();

	// Text must be translated
	await expect(translator.translate('foo', 'en', 'de')).resolves.toMatch(/^\*2/);

	// First translator have been called once to detect failure
	expect(translator1.translate).toBeCalledTimes(1);
	expect(translator2.translate).toBeCalledTimes(1);
	expect(translator3.translate).toBeCalledTimes(0);

	// Text must be translated
	await expect(translator.translate('bar', 'en', 'de')).resolves.toMatch(/^\*2/);

	// Must be used only translator that has ben used most recently
	expect(translator1.translate).toBeCalledTimes(1);
	expect(translator2.translate).toBeCalledTimes(2);
	expect(translator3.translate).toBeCalledTimes(0);
});

describe('Flaky translators', () => {
	const translator1 = new FakeTranslator({ prefix: '*1' });
	vi.spyOn(translator1, 'translate');

	const translator2 = new FakeTranslator({ prefix: '*2' });
	vi.spyOn(translator2, 'translate');

	const translator3 = new FakeTranslator({ prefix: '*3' });
	vi.spyOn(translator3, 'translate');

	const FallbackTranslator = createFallbackTranslator([
		{
			languages: new Set(['en', 'de']),
			languageDetection: false,
			translator: translator1,
		},
		{
			languages: new Set(['en', 'de']),
			languageDetection: false,
			translator: translator2,
		},
		{
			languages: new Set(['en', 'de']),
			languageDetection: false,
			translator: translator3,
		},
	]);

	const translator = new FallbackTranslator();

	test('Next fallback translator must be used in loop when available', async () => {
		vi.spyOn(translator1, 'translate').mockImplementationOnce(async () => {
			throw new Error('Fake error');
		});
		await expect(translator.translate('text 1', 'en', 'de')).resolves.toMatch(/^\*2/);

		// Translator fails, so next translator must be used
		vi.spyOn(translator2, 'translate').mockImplementationOnce(async () => {
			throw new Error('Fake error');
		});
		await expect(translator.translate('text 2', 'en', 'de')).resolves.toMatch(/^\*3/);

		// Translator fails, so next translator must be used
		vi.spyOn(translator3, 'translate').mockImplementationOnce(async () => {
			throw new Error('Fake error');
		});
		await expect(translator.translate('text 3', 'en', 'de')).resolves.toMatch(/^\*1/);
	});
});

describe('Mixed features', () => {
	const translator1 = new FakeTranslator({ prefix: '*ru' });
	vi.spyOn(translator1, 'translate');

	const translator2 = new FakeTranslator({ prefix: '*de' });
	vi.spyOn(translator2, 'translate');

	const translator3 = new FakeTranslator({ prefix: '*ja' });
	vi.spyOn(translator3, 'translate');

	const FallbackTranslator = createFallbackTranslator([
		{
			languages: new Set(['en', 'ru']),
			languageDetection: false,
			translator: translator1,
		},
		{
			languages: new Set(['en', 'de']),
			languageDetection: false,
			translator: translator2,
		},
		{
			languages: new Set(['en', 'ja']),
			languageDetection: false,
			translator: translator3,
		},
	]);

	const translator = new FallbackTranslator();

	test('All features must be merged', () => {
		expect(FallbackTranslator.getSupportedLanguages()).toEqual([
			'en',
			'ru',
			'de',
			'ja',
		]);
		expect(FallbackTranslator.isSupportedAutoFrom()).toBe(false);
	});

	test('Must be used nearest translator that support languages direction', async () => {
		await expect(translator.translate('text 1', 'en', 'de')).resolves.toMatch(
			/^\*de/,
		);
		await expect(translator.translate('text 1', 'en', 'ru')).resolves.toMatch(
			/^\*ru/,
		);
		await expect(translator.translate('text 1', 'en', 'ja')).resolves.toMatch(
			/^\*ja/,
		);
	});

	test('Throws in case language direction is unsupported', async () => {
		await expect(translator.translate('text 1', 'en', 'es')).rejects.toThrow(
			'All translators does not work',
		);
		await expect(translator.translate('text 1', 'auto', 'es')).rejects.toThrow(
			'All translators does not work',
		);
	});
});
