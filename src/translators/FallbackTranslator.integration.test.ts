import { createFallbackTranslator } from './FallbackTranslator';
import { GoogleTranslator, GoogleTranslatorTokenFree } from './GoogleTranslator';
import { TartuNLPTranslator } from './TartuNLPTranslator';
import { YandexTranslator } from './unstable/YandexTranslator';

const FallbackTranslator = createFallbackTranslator([
	{
		translator: new TartuNLPTranslator(),
		languages: new Set(TartuNLPTranslator.getSupportedLanguages()),
		languageDetection: TartuNLPTranslator.isSupportedAutoFrom(),
	},
	{
		translator: new YandexTranslator(),
		languages: new Set(YandexTranslator.getSupportedLanguages()),
		languageDetection: YandexTranslator.isSupportedAutoFrom(),
	},
	{
		translator: new GoogleTranslator(),
		languages: new Set(GoogleTranslator.getSupportedLanguages()),
		languageDetection: GoogleTranslator.isSupportedAutoFrom(),
	},
	{
		translator: new GoogleTranslatorTokenFree(),
		languages: new Set(GoogleTranslatorTokenFree.getSupportedLanguages()),
		languageDetection: GoogleTranslatorTokenFree.isSupportedAutoFrom(),
	},
]);

test('Most popular translators', async () => {
	const translator = new FallbackTranslator({
		onTranslatorError(error, translator) {
			console.warn('Expected error in translator', error, translator);
		},
	});
	await expect(translator.translate('Hello world', 'en', 'ru')).resolves.toContain(
		'мир',
	);
	await expect(
		translator.translate('Universe is a deep space', 'en', 'ru'),
	).resolves.toMatch(/вселенная/i);
}, 30_000);
