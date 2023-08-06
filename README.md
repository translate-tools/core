The translate tools core is a kit of translation primitives.

The package contains translators, scheduler for translation tasks, tex-to-speech (TTS), some utils and standardized types for a build a large systems.

Use this package if you need default implementations of translation primitives. Use a types of this package, to implement your own entities and to make it compatible with a numerous utils implemented by other people.

Feel free to [open a new issue](https://github.com/translate-tools/core/issues) and request a primitives that needs in your project and will useful for other people.

# Usage

Install package `npm install @translate-tools/core`

This package provides CJS and ESM modules both. This docs contains CJS examples, that can be used for both NodeJS and Browser, but if you need to use ESM modules (to make tree-shaking are effective for example), you can add `/esm` prefix for any paths, after package name:

```js
// Example with import a CommonJS module
import { GoogleTranslator } from '@translate-tools/core/translators/GoogleTranslator';
```

```js
// Example with import a ECMAScript module
import { GoogleTranslator } from '@translate-tools/core/esm/translators/GoogleTranslator';
```

# Translators

Directory `translators` contains a translators interfaces and default implementations.

## Translator usage

Example with google translator

```ts
import { GoogleTranslator } from '@translate-tools/core/translators/GoogleTranslator';

const translator = new GoogleTranslator();

// Translate single string
translator
	.translate('Hello world', 'en', 'de')
	.then((translate) => console.log('Translate result', translate));

// Translate multiple strings
translator
	.translateBatch(
		['Hello world', 'Some another text to translate', 'Yet another text'],
		'en',
		'de',
	)
	.then((translatedTexts) => console.log('Translate result', translatedTexts));
```

**For use with nodejs** you have to **specify user agent**. In most cases for nodejs, translator will work incorrectly with not set `User-Agent` header.

```ts
import { GoogleTranslator } from '@translate-tools/core/translators/GoogleTranslator';

const translator = new GoogleTranslator({
	headers: {
		'User-Agent':
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36',
	},
});
```

Some translators API is **not available in browser, due to CSP policy**, for this cases you can set [CORS proxy](https://rapidapi.com/guides/cors-proxy-apis) to fix the problem. With this option, translator will use proxy to send requests, keep in mind that those who own the proxy server you use, can see your requests content.

```ts
import { GoogleTranslator } from '@translate-tools/core/translators/GoogleTranslator';

// Use some CORS proxy service as prefix
const translator = new GoogleTranslator({
	corsProxy: 'https://corsproxy.io/',
});

// Or use your own transform function
const translator = new GoogleTranslator({
	corsProxy(url) {
		return `https://my-cors-proxy/${url}/my-postfix`;
	},
});
```

## Translators list

Package includes translators implementations for most popular services.

### GoogleTranslator

Uses a free API version of service translate.google.com

Exports 2 implementations `GoogleTranslator` and `GoogleTranslatorTokenFree`, that have the same features, but uses different API endpoints, so you can choose what implementation better for you.

```ts
import {
	GoogleTranslator,
	GoogleTranslatorTokenFree,
} from '@translate-tools/core/translators/GoogleTranslator';

const translator = new GoogleTranslator({
	headers: {
		'User-Agent':
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36',
	},
});

translator
	.translate('Hello world', 'en', 'de')
	.then((translate) => console.log('Translate result', translate));

const translator2 = new GoogleTranslatorTokenFree({
	headers: {
		'User-Agent':
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36',
	},
});

translator2
	.translate('Hello world', 'en', 'de')
	.then((translate) => console.log('Translate result', translate));
```

### YandexTranslator

Uses a free API of service translate.yandex.ru

### TartuNLPTranslator

Uses a free API https://github.com/TartuNLP/translation-api built with TartuNLP's public NMT engines
API docs: https://api.tartunlp.ai/translation/docs
Demo: https://translate.ut.ee/

### ReversoTranslator

Uses a free API of service https://www.reverso.net/text-translation

**Unstable**: this translator are not stable and placed in `unstable` subdirectory. Keep in mind the not stable translators may be removed any time.

### DeepLTranslator

Uses API of https://www.deepl.com/translator

This translator requires to provide API key

```ts
import { DeepLTranslator } from '@translate-tools/core/translators/DeepLTranslator';

const translator = new DeepLTranslator({
	apiKey: '820c5d18-365b-289c-e63b6fc7e1cb:fx',
});

translator
	.translate('Hello world', 'en', 'de')
	.then((translate) => console.log('Translate result', translate));
```

### LibreTranslateTranslator

Uses API of https://github.com/LibreTranslate/LibreTranslate

This translator requires to provide API endpoint and API key for some not free API instances.
See an [instances list](https://github.com/LibreTranslate/LibreTranslate#mirrors) to find a public instances.

**Unstable**: this translator are not stable and placed in `unstable` subdirectory. Keep in mind the not stable translators may be removed any time.

**Options**

- `apiEndpoint` optional - url to API endpoint. Default: `https://translate.terraprint.co/translate`
- `apiKey` optional - API key

```ts
import { LibreTranslateTranslator } from '@translate-tools/core/translators/unstable/LibreTranslateTranslator';

const freeTranslator = new LibreTranslateTranslator({
	apiEndpoint: 'https://translate.argosopentech.com/translate',
});

const localDeployedTranslator = new LibreTranslateTranslator({
	apiEndpoint: 'http://localhost:9077/translate',
});

const paidTranslator = new LibreTranslateTranslator({
	apiEndpoint: 'https://libretranslate.com/translate',
	apiKey: '76c1d41c-0a9a-5667-e9d169746e1e',
});
```

### FakeTranslator

Fake translator for tests, that returns original string with added prefix.

## Translator API

Module `translators/Translator` contains translator interfaces.

### TranslatorInstanceMembers

Interface describes instance members for a translator

```ts
interface TranslatorInstanceMembers {
	/**
	 * Translate text
	 * @returns Translated string
	 */
	translate(text: string, langFrom: langCodeWithAuto, langTo: langCode): Promise<string>;

	/**
	 * Translate texts array
	 * @returns Array with translated strings and same length as input array
	 * @returns Texts that did not translated will replaced to `null`
	 */
	translateBatch(
		text: string[],
		langFrom: langCodeWithAuto,
		langTo: langCode,
	): Promise<Array<string | null>>;

	/**
	 * Check string or array of stings to exceeding a limit
	 *
	 * It need for modules with complexity logic of encoding a strings.
	 * For example, when in `translateBatch` text merge to string
	 * and split to chunks by tokens with ID: `<id1>Text 1</id1><id2>Text 2</id2>`
	 *
	 * Here checked result of encoding a input data
	 * @returns number of extra chars
	 */
	checkLimitExceeding(text: string | string[]): number;

	/**
	 * Check supporting of translate direction
	 */
	checkDirection?: (langFrom: langCodeWithAuto, langTo: langCode) => boolean;

	/**
	 * Max length of string for `translate` or total length of strings from array for `translateBatch`
	 */
	getLengthLimit(): number;

	/**
	 * Delay between requests that required by translator to a correct work
	 */
	getRequestsTimeout: () => number;
}
```

### TranslatorStaticMembers

Interface describes static members, useful to choose most suitable translator in a list by features

```ts
interface TranslatorStaticMembers {
	/**
	 * Public translator name to displaying
	 */
	readonly translatorName: string;

	/**
	 * Is required API key for this module
	 */
	isRequiredKey(): boolean;

	/**
	 * Is it supported value `auto` in `langFrom` argument of `translate` and `translateBatch` methods
	 */
	isSupportedAutoFrom(): boolean;

	/**
	 * Array of supported languages as ISO 639-1 codes
	 */
	getSupportedLanguages(): langCode[];
}
```

### TranslatorConstructor

Interface describes translator constructor, that have members of `TranslatorStaticMembers` and construct an object with type `TranslatorInstanceMembers`

### TranslatorOptions

Interface describes default options for any translator constructor.

Some translators may ignore some options.

```ts
type TranslatorOptions<O extends Record<any, any> = {}> = O & {
	/**
	 * Access key for requests to translator API
	 */
	apiKey?: string;

	/**
	 * Union text array to 1 request (or more, but less than usualy anyway).
	 *
	 * Option for reduce the number of requests, but it can make artefacts in translated text.
	 *
	 * Some modules may not support this feature.
	 */
	useMultiplexing?: boolean;

	/**
	 * Additional headers for requests
	 */
	headers?: Record<string, string>;

	/**
	 * Proxy prefix or transform function which return url with CORS proxy
	 *
	 * CORS proxy useful to avoid CORS error in browser or to mask server requests as browser requests.
	 *
	 * All requests will send through this proxy server and this server will modify headers
	 */
	corsProxy?: CorsProxy;
};
```

# Text to speech (TTS)

Directory `tts` contains text to speech modules, to make audio from a text.

TTS modules returns buffer with audio.

## TTS usage

<!-- TODO: add example with convert buffer to audio -->

```ts
import { GoogleTTS } from '@translate-tools/core/tts/GoogleTTS';

const tts = new GoogleTTS();
tts.getAudioBuffer('Some demo text to speak', 'en').then((ttsResult) => {
	console.log('Audio buffer', ttsResult.buffer);
});
```

## TTS list

### GoogleTTS

Uses a free API version of service translate.google.com

### LingvaTTS

Uses API of https://github.com/thedaviddelta/lingva-translate

This module supports option to provide API endpoint, see an [instances list](https://github.com/thedaviddelta/lingva-translate#instances) to find a public instances.

<!-- TODO: implement option `apiEndpoint` -->

## TTS API

```ts
/**
 * Object with audio data
 */
export type TTSAudioBuffer = {
	/**
	 * Audio mimetype
	 */
	type: string;
	/**
	 * Buffer contains audio bytes
	 */
	buffer: ArrayBuffer;
};

/**
 * TTS instance members
 */
export interface TTSProviderProps {
	/**
	 * Get blob with audio
	 * @param text text to speak
	 * @param language text language
	 * @param options optional map with preferences to generate audio
	 */
	getAudioBuffer(
		text: string,
		language: string,
		options?: Record<string, string>,
	): Promise<TTSAudioBuffer>;
}

/**
 * TTS constructor members
 */
export interface TTSProviderStaticProps {
	getSupportedLanguages(): string[];
}

/**
 * Text to speech module
 */
export type TTSProvider = TTSProviderStaticProps & {
	new (...args: any[]): TTSProviderProps;
};
```
