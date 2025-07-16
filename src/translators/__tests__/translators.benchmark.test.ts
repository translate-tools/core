import { getTranslatorsScore } from './benchmark';
import { TranslatorConstructor } from '../Translator';

import { GoogleTranslator, GoogleTranslatorTokenFree } from '../GoogleTranslator';
import { YandexTranslator } from '../YandexTranslator';
import { TartuNLPTranslator } from '../TartuNLPTranslator';
import { MicrosoftTranslator } from '../MicrosoftTranslator';

const referenceText = `
Linguist is a powerful browser extension that is ready to replace your favorite translation service.

Translate web pages, highlighted text, Netflix subtitles, private messages, speak the translated text, and save important translations to your personal dictionary to learn new words in 130 languages.

Why Linguist?

Unlike other browser extensions, Linguist is not just a wrapper over the Google Translator Widget; it's a full-featured and independent translation system. This is why with Linguist you can be private and translate texts offline on your device and use any translation service, even your own like ChatGPT. See a custom translators list to find bindings for the most popular translation services.

Linguist is a free, open-source project, respects your privacy, and does not collect your personal data.
`.trim();

const referenceTranslation = `
Linguist - это мощное расширение для браузера, готовое заменить ваш любимый сервис перевода.

Переводите веб-страницы, выделенный текст, субтитры Netflix, приватные сообщения, озвучивайте переведённый текст и сохраняйте важные переводы в словарь, чтобы изучать новые слова на 130 языках.

Почему Linguist?

В отличие от других расширений, Linguist не просто обёртка над Google Translator Widget; это полнофункциональная и независимая система перевода. Поэтому с Linguist вы можете сохранять конфиденциальность, переводя тексты офлайн прямо на своём устройстве и использовать любой сервис перевода, даже собственный, как например ChatGPT. Ознакомьтесь со списком пользовательских переводчиков, чтобы найти адаптеры к самым популярным сервисам.

Linguist бесплатный проект с открытым исходным кодом, уважает вашу конфиденциальность и не собирает личные данные.
`.trim();

const translators: TranslatorConstructor[] = [
	GoogleTranslator,
	GoogleTranslatorTokenFree,
	YandexTranslator,
	TartuNLPTranslator,
	MicrosoftTranslator,
];

test(
	'Top translators list with score',
	async () => {
		await expect(
			getTranslatorsScore(translators, {
				text: referenceText,
				translation: referenceTranslation,
			}).then((results) => {
				results.forEach((result) => {
					result.score = parseFloat(result.score.toFixed(2));
				});

				return results;
			}),
		).resolves.matchSnapshot();
	},
	{ timeout: translators.length * 10_000 },
);
