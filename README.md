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

Translator purpose is translate text from one language to another.

Translators in this package uses 2-letter [ISO 639-1 language codes](https://en.wikipedia.org/wiki/ISO_639-1), but in your translator implementation you can use [ISO 639-2 language codes](https://en.wikipedia.org/wiki/ISO_639-2) too.

Translators have 2 public methods, `translate` for translate single text and `translateBatch` for translate a multiple texts per one request. Method `translateBatch` may have better translation quality for some use cases, because some translator implementations may not just translate every single string independently, but see a context of all strings.

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

- `apiHost` optional - url to API endpoint. Default: `https://translate.terraprint.co/translate`
- `apiKey` optional - API key

```ts
import { LibreTranslateTranslator } from '@translate-tools/core/translators/unstable/LibreTranslateTranslator';

const freeTranslator = new LibreTranslateTranslator({
	apiHost: 'https://translate.argosopentech.com/translate',
});

const localDeployedTranslator = new LibreTranslateTranslator({
	apiHost: 'http://localhost:9077/translate',
});

const paidTranslator = new LibreTranslateTranslator({
	apiHost: 'https://libretranslate.com/translate',
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

# Scheduling

Directory `scheduling` contains primitives to schedule translation, that allow to batch few translation requests to one API request.

Scheduler are extremely useful for cases when your code intensive calls translation methods, to avoid API rate limit errors and to collect few requests for short time to one request.

## Scheduler API

Scheduler have standard interface, to allow you implement your own scheduler for you use case

```ts
export interface ISchedulerTranslateOptions {
	/**
	 * Identifier to grouping requests
	 */
	context?: string;

	/**
	 * Priority index for translate queue
	 */
	priority?: number;

	/**
	 * Use direct translate for this request if it possible
	 */
	directTranslate?: boolean;
}

export interface IScheduler {
	translate(
		text: string,
		from: langCodeWithAuto,
		to: langCode,
		options?: ISchedulerTranslateOptions,
	): Promise<string>;
}
```

Scheduler API looks like translator with one public method `translate`. User calls this method any times with any frequency, and scheduler executes requests by its own plan.

## Basic scheduler

Basic scheduler placed at `scheduling/Scheduler`;

### Usage

```ts
import { GoogleTranslator } from '@translate-tools/core/translators/GoogleTranslator';
import { Scheduler } from '@translate-tools/core/scheduling/Scheduler';

// We use google translator API for translate requests
const translator = new GoogleTranslator();
const scheduler = new Scheduler(translator, { translatePoolDelay: 100 });

// This text will not translated immediately, instead it will be added to suit batch in queue,
// and will translated after 100ms after last update this batch
scheduler.translate('Some text for translate', 'en', 'de', { priority: 1 });

// The same with this request, but this text will translated first, because have most high priority
scheduler.translate('Text that must be translated ASAP', 'en', 'de', { priority: 10 });

// Texts with same priority will be batched
scheduler.translate('Some text for translate', 'en', 'de', { priority: 1 });
```

### API

```ts
interface Scheduler {
	new (translator: TranslatorInstanceMembers, config?: SchedulerConfig): IScheduler;
}

interface SchedulerConfig {
	/**
	 * Number of attempts for retry request
	 */
	translateRetryAttemptLimit?: number;

	/**
	 * If true - rejected requests will use direct translate
	 */
	isAllowDirectTranslateBadChunks?: boolean;

	/**
	 * Length of string for direct translate.
	 *
	 * null for disable the condition
	 */
	directTranslateLength?: number | null;

	/**
	 * Delay for translate a chunk. The bigger the more requests will collect
	 */
	translatePoolDelay?: number;

	/**
	 * When chunk collect this size, it's will be instant add to a translate queue
	 *
	 * null for disable the condition
	 */
	chunkSizeForInstantTranslate?: number | null;

	/**
	 * Pause between handle task batches
	 *
	 * It may be useful to await accumulating a task batches in queue to consider priority better and don't translate first task batch immediately
	 *
	 * WARNING: this option must be used only for consider priority better! Set small value always (10-50ms)
	 *
	 * When this option is disabled (by default) and you call translate method for texts with priority 1 and then immediately for text with priority 2, first request will have less delay for translate and will translate first, even with lower priority, because worker will translate first task immediately after delay defined by option `translatePoolDelay`
	 */
	taskBatchHandleDelay?: null | number;
}
```

## Scheduler with cache

Scheduler with cache placed at `scheduling/SchedulerWithCache` and useful for cases when you needs to cache your translations.

This class is just a decorator over `Scheduler` that allow you to use standard object `ICache` with scheduler.

### Usage

```ts
import { GoogleTranslator } from '@translate-tools/core/translators/GoogleTranslator';
import { Scheduler } from '@translate-tools/core/scheduling/Scheduler';
import { SchedulerWithCache } from '@translate-tools/core/scheduling/SchedulerWithCache';
import { ICache } from '@translate-tools/core/utils/Cache';

// Dummy implementation of cache
class CacheInRam implements ICache {
	private cache: Record<string, string> = {};
	private buildKey(text: string, from: string, to: string) {
		return [text, from, to].join('-');
	}

	async get(text: string, from: string, to: string) {
		const cacheKey = this.buildKey(text, from, to);
		return this.cache[cacheKey] ?? null;
	}

	async set(text: string, translate: string, from: string, to: string) {
		const cacheKey = this.buildKey(text, from, to);
		this.cache[cacheKey] = translate;
	}

	async clear() {
		this.cache = {};
	}
}

// We use google translator API for translate requests
const translator = new GoogleTranslator();
const scheduler = new Scheduler(translator, { translatePoolDelay: 100 });

const cache = new CacheInRam();
const schedulerWithCache = new SchedulerWithCache(scheduler, cache);

schedulerWithCache.translate('Some text for translate', 'en', 'de');
schedulerWithCache.translate('Some another text', 'en', 'de');
```

### API

```ts
interface SchedulerWithCache {
	new (scheduler: Scheduler, cache: ICache): IScheduler;
}

/**
 * Interface of cache
 */
export interface ICache {
	/**
	 * Get translation
	 */
	get: (text: string, from: string, to: string) => Promise<string | null>;

	/**
	 * Set translation
	 */
	set: (text: string, translate: string, from: string, to: string) => Promise<void>;

	/**
	 * Clear cache
	 */
	clear: () => Promise<void>;
}
```

# Text to speech (TTS)

Directory `tts` contains text to speech modules, to make audio from a text.

TTS modules returns buffer with audio.

## TTS usage

```ts
import { GoogleTTS } from '@translate-tools/core/tts/GoogleTTS';

const tts = new GoogleTTS();
tts.getAudioBuffer('Some demo text to speak', 'en').then(({ buffer, type }) => {
	// Play audio from fetched `ArrayBuffer`
	const audio = new Audio();
	audio.src = URL.createObjectURL(new Blob([buffer], { type }));
	audio.play();
});
```

## TTS list

### GoogleTTS

Uses a free API version of service translate.google.com

### LingvaTTS

Uses API of https://github.com/thedaviddelta/lingva-translate

This module supports option `apiHost` to provide API endpoint, see an [instances list](https://github.com/thedaviddelta/lingva-translate#instances) to find a public instances. Default API host: `https://translate.plausibility.cloud`.

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

# Languages

Module `languages` contains utils to work with language codes.

## isLanguageCodeISO639v1(code: `string`): `boolean`

Predicate to check is language code are valid [ISO-639v1 code](https://en.wikipedia.org/wiki/ISO_639-1) or not

## isLanguageCodeISO639v2(code: `string`): `boolean`

Predicate to check is language code are valid [ISO-639v2 code](https://en.wikipedia.org/wiki/ISO_639-2) or not

## getLanguageCodesISO639(set: `'v1' | 'v2'`): `string[]`

Returns language codes for selected version of ISO-639
