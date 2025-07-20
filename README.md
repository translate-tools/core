[![](https://img.shields.io/npm/v/anylang.svg)](https://www.npmjs.com/package/anylang) ![](https://img.shields.io/npm/l/anylang) [![](https://img.shields.io/github/contributors/translate-tools/core)](https://github.com/translate-tools/core/graphs/contributors) [![CodeQL](https://github.com/translate-tools/core/actions/workflows/codeql.yml/badge.svg?branch=master&event=push)](https://github.com/translate-tools/core/actions/workflows/codeql.yml?branch=master&event=push)

The **AnyLang** kit is purposed to build your own translation system.

This package provides next translation primitives:
- **Translators**. Bindings to a popular translation APIs, LLMs, and free translation services like Google Translate, Bing, Yandex, etc.
- **Translation schedulers**, to batch many calls to translator into single request.
- **Text-to-speech modules**, to make audio of text.
- **Language utils**, to manage language codes, and aliases between different ISO standards and formats
- **Processing utils** like text multiplexing tools, cache management, etc.
- **Consistent interfaces**. You may use presets, like `ChatGPTLLMTranslator` or you may compose configuration yourself, from your own implementation of LLM fetcher and LLM translator, and use it natively with other primitives.

This package is a part of [TranslateTools project](https://github.com/translate-tools).

[![](https://primebits.org/badges/built-by.svg)](https://primebits.org)

# Usage

Star the project repo, help us to make it popular [![](https://img.shields.io/github/stars/translate-tools/core)](https://github.com/translate-tools/core)

Install this package via `npm install anylang`

Translate text with one of translators

```ts
import { MicrosoftTranslator } from 'anylang/translators';

const translator = new MicrosoftTranslator();

// You can translate single text
translator.translate('Hello world', 'en', 'de').then(console.log);

// will print string: "Hallo Welt"

// and you can translate array of texts
translator
  .translateBatch(['I am Anthony', 'How are you?'], 'en', 'de')
  .then(console.log);

// will print array of translated strings: ["Ich bin Anthony", "Wie sind Sie?"]
```

See a [Live Demo at StackBlitz](https://stackblitz.com/edit/stackblitz-starters-2kwuu5kt?file=index.js)

## ESM modules

This package provides both CJS and ESM modules.

In this docs all examples uses CJS modules, if you need to use ESM modules, just add `/esm` prefix for any paths, after a package name like that:

```js
// Example with import a CommonJS module
import { GoogleTranslator } from 'anylang/translators';

// Example with import an ECMAScript module
import { GoogleTranslator } from 'anylang/esm/translators';
```

## Migrations

If you update package to a new major version, check [migration guides](https://github.com/translate-tools/core/tree/master/docs/migrations) to do it smooth.

# Translators list

Directory `translators` contains a set of translators and its types and interfaces.

Translator purpose is translate text from one language to another.

Translators in this package uses 2-letter [ISO 639-1 language codes](https://en.wikipedia.org/wiki/ISO_639-1) like `en`, `es`, `ru`, `ja`, etc.

If you want to use another format for language codes, for example [ISO 639-2 language codes](https://en.wikipedia.org/wiki/ISO_639-2), you may implement your own adapter for `Translator` that map languages.

Translators have 2 public methods:
- `translate` for translate single text
- `translateBatch` for translate a multiple texts per one request

Method `translateBatch` may have better translation quality for some use cases, because some translator implementations may see a context of all strings.

Package includes translators implementations for most popular services.

## Free translators list

- `GoogleTranslator` and `GoogleTranslatorTokenFree` - both uses a free google translation API. The difference in details of implementation, so you may use any
- `MicrosoftTranslator` - uses a free Microsoft's translation service that is used in Microsoft Edge browser
- `YandexTranslator` - uses a free API of service https://translate.yandex.ru. This service have aggressive bots protection, so it sometimes show page with captcha challenge and blocks API requests until you go to page and will pass challenge or change your IP
- `TartuNLPTranslator` - Uses a free API https://github.com/TartuNLP/translation-api built with TartuNLP's public NMT engines. Translator have good quality, but strict rate limits. See API docs: https://api.tartunlp.ai/translation/docs and Demo: https://translate.ut.ee/

Example of use

```ts
import { YandexTranslator } from 'anylang/translators';

const translator = new YandexTranslator();

// You can translate single text
translator
  .translate('Hello world', 'en', 'de')
  .then(console.log);

// will print "Hallo Welt" in console
```

## Unstable translators

**Unstable** translators is placed in `unstable` subdirectory, because it is not purposed for high intensive use because of strict rate limits or other problems.

Unstable translators **may be removed at any time**.

- `DuckDuckGoLLMTranslator` - uses [Duck.ai](https://duck.ai) API that is a public proxy of OpenAI LLM service. Have strict rate limits
- `LingvaTranslate` - uses public instances of [LingvaTranslate](https://github.com/thedaviddelta/lingva-translate) that is a Google Translate proxy
- `ReversoTranslator` - uses a free API of service https://www.reverso.net/text-translation

Example of use

```ts
import { DuckDuckGoLLMTranslator } from 'anylang/translators/unstable';

const translator = new DuckDuckGoLLMTranslator();

// You can translate single text
translator
  .translate('Hello world', 'en', 'de')
  .then(console.log);

// will print "Hallo Welt" in console
```

## Translators that require API keys

### LLM translators

There are few LLM translators configuration is provided
- `ChatGPTLLMTranslator`
- `GeminiLLMTranslator`

Example of use is

```ts
import { ChatGPTLLMTranslator } from 'anylang/translators';

const translator = new ChatGPTLLMTranslator({
	apiKey: 'YOUR_SECRET_TOKEN_HERE',
	// Optional config
	apiOrigin: 'https://api.openai.com',
	model: 'gpt-4o-mini',
});

// You can translate single text
translator
  .translate('Hello world', 'en', 'de')
  .then(console.log);

// will print "Hallo Welt" in console
```

If you want, you may build your own LLM translator from primitives in subdirectory `LLMTranslators`.

### DeepLTranslator

Uses API of https://www.deepl.com/translator

This translator requires to provide API key

```ts
import { DeepLTranslator } from 'anylang/translators';

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
import { LibreTranslateTranslator } from 'anylang/translators/unstable';

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

## Special translators

You may use `FakeTranslator` for test purposes. This translator is just returns original strings with added prefix


# Advanced use of translators

## Use in NodeJS

**For use with nodejs** you have to **specify user agent**. In most cases for nodejs, translator will work incorrectly with not set `User-Agent` header.

```ts
import { GoogleTranslator } from 'anylang/translators';

const translator = new GoogleTranslator({
	headers: {
		'User-Agent':
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36',
	},
});
```

## Custom fetcher

Sometimes you may want to use custom fetcher, to send requests through proxy server, implement retries or cache, etc.

For example, some translators API is **not available in browser, due to CSP policy**, for this cases you may use some [CORS proxy](https://rapidapi.com/guides/cors-proxy-apis) to fix the problem. With this option, translator will use proxy to send requests, keep in mind that those who own the proxy server you use, can see your requests content.

You may pass your implementation of `Fetcher` function to option `fetcher`.

```ts
import { GoogleTranslator } from 'anylang/translators';

import { Fetcher, basicFetcher } from 'anylang/utils';

// Extend `basicFetcher` with use CORS proxy for all requests
const fetcher: Fetcher = async (url, options) => {
	// Use some CORS proxy service as prefix
	return basicFetcher('https://corsproxy.io/?' + url, options);
};

const translator = new GoogleTranslator({ fetcher });
```

You may use any fetcher under the hood, like Axios, Got, or even [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage).


# Scheduling

Directory `scheduling` contains primitives to schedule translation, that allows to batch few translation requests to a single API request.

Scheduler are extremely useful for cases when your code intensive calls translation methods, to avoid API rate limit errors and to collect few requests for short time to one request.

## Usage

```ts
import { GoogleTranslator } from 'anylang/translators';
import { Scheduler } from 'anylang/scheduling/Scheduler';

// We use google translator API for translate requests
const translator = new GoogleTranslator();
const scheduler = new Scheduler(translator, { translatePoolDelay: 100 });

// This text will not be translated immediately,
// instead it will be added to a batch in queue,
// and will be translated after 100ms from last update on this batch
scheduler.translate('Some text for translate', 'en', 'de', { priority: 1 });

// The same with this request, but this text will be translated first, since it have most greater priority (the greater the more important)
scheduler.translate('Text that must be translated ASAP', 'en', 'de', { priority: 10 });

// Texts with same priority will be batched
scheduler.translate('Some text for translate', 'en', 'de', { priority: 1 });
```

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
	/**
	 * Translate text
	 *
	 * @param text text for translation
	 * @param from text language code
	 * @param to target language code for translation
	 * @param options {ISchedulerTranslateOptions}
	 */
	translate(
		text: string,
		from: langCodeWithAuto,
		to: langCode,
		options?: ISchedulerTranslateOptions,
	): Promise<string>;

	/**
	 * Abort translation for all requests with provided context
	 * - All delayed requests will be immediately rejected
	 * - If exception thrown for in-flight requests, they will be rejected immediately with no retries
	 *
	 * @param context unique name for group of requests that must be aborted
	 */
	abort(context: string): Promise<void>;
}
```

Scheduler API looks like translator with one public method `translate`. User calls this method any times with any frequency, and scheduler executes requests by its own plan.

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

```ts
import { GoogleTranslator } from 'anylang/translators';
import { Scheduler } from 'anylang/scheduling/Scheduler';
import { SchedulerWithCache } from 'anylang/scheduling/SchedulerWithCache';
import { ICache } from 'anylang/utils';

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
import { GoogleTTS } from 'anylang/tts/GoogleTTS';

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


# API

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


## TranslatorStaticMembers

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
	 * Custom fetcher
	 */
	fetcher?: Fetcher;
};
```

# Help to us

Star the project repo, help us to make it popular [![](https://img.shields.io/github/stars/translate-tools/core)](https://github.com/translate-tools/core)

The most valuable thing you can do to support the project if you like it, is to **spread the word about this package**. Tell about `anylang` to your team and start use it.

The more users project have, the better its quality, since we can find edge cases faster and improve code design.

You also could [suggest in issues](https://github.com/translate-tools/core/issues/new) a new ideas, features and elegant ways to make package better.

AnyLang is an open source project, so we are opened for your pull requests.