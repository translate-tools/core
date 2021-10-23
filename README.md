The translate tools core kit contains a interfaces and default implementations of basic translation entities.

This package is part of [translate tools project](https://github.com/translate-tools).

Main purpose of core package it's standardization a translator entities.

# Translators info

This package contains few translators and its have different status and support different platforms.

| Translator name      | Platforms       | API key      | Status                                                             |
| -------------------- | --------------- | ------------ | ------------------------------------------------------------------ |
| GoogleTranslator     | browser, nodejs | not required | ready to use                                                       |
| YandexTranslator     | browser         | not required | ready to use                                                       |
| BingTranslatorPublic | browser         | not required | unstable, ready to use for translate short text with low frequency |
| ReversoTranslator    | browser         | not required | unstable                                                           |

# Usage

Install package `npm install @translate-tools/core`

Code example

```ts
import { GoogleTranslator } from '@translate-tools/core/translators/GoogleTranslator';

const translator = new GoogleTranslator();

// Translate single string
translator
	.translate('Hello world', 'en', 'de')
	.then((translate) => console.log('Translate result', translate));
```

For use with nodejs you should specify user agent in most cases

```ts
import { GoogleTranslator } from '@translate-tools/core/translators/GoogleTranslator';

const translator = new GoogleTranslator({
	headers: {
		'User-Agent':
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36',
	},
});

translator
	.translate('Hello world', 'en', 'de')
	.then((translate) => console.log('Translate result', translate));
```

For use with browser you should specify CORS proxy in most cases when translator is not work

```ts
import { GoogleTranslator } from '@translate-tools/core/translators/GoogleTranslator';

// Use some CORS proxy service address as prefix
const translator = new GoogleTranslator({
	corsProxy: 'https://crossorigin.me/',
});

translator
	.translate('Hello world', 'en', 'de')
	.then((translate) => console.log('Translate result', translate));

// Or use your own transform function
const translator = new GoogleTranslator({
	corsProxy(url) {
		return `https://my-cors-proxy/${url}/some-postfix`;
	},
});

translator
	.translate('Hello world', 'en', 'de')
	.then((translate) => console.log('Translate result', translate));
```

# Package contents

## Translator

Translator it's basic entity for translate text.

### Abstraction

Namespace `types/Translator`

- Interface `ITranslator` with basic structure of translator object
- Abstract class `Translator` which implement `ITranslator` and define static members

### Implementation

Namespace `translators`

Contains a translators which extends `Translator` and use API of popular translate services.

- GoogleTranslator
- YandexTranslator
- BingTranslator

Also contains `FakeTranslator` for mock and tests

### Examples

```ts
import { GoogleTranslator } from '@translate-tools/core/translators/GoogleTranslator';

const translator = new GoogleTranslator();

// Translate single string
translator
	.translate('Hello world', 'en', 'de')
	.then((translate) => console.log('Single translate', translate));

// Translate multiple string
translator
	.translateBatch(['Translator can translate few strings', 'at one time'], 'en', 'de')
	.then((translate) => console.log('Batch translate', translate));
```

## Translate scheduler

Translate scheduler it's task manager which try fit many translate requests to one request to `Translator`.

It's very useful for cases when you have many requests to translate short text but your `Translator` have limits for API requests.

### Abstraction

Namespace `TranslateScheduler`

- Interface `ITranslateScheduler`

### Implementation

Namespace `TranslateScheduler`

- `TranslateScheduler`

### Examples

```ts
import { TranslateScheduler } from '@translate-tools/core/TranslateScheduler/TranslateScheduler';
import { GoogleTranslator } from '@translate-tools/core/translators/GoogleTranslator';

const translator = new GoogleTranslator();
const scheduler = new TranslateScheduler(translator);

// Scheduler will join this requests and execute it as one request
// Scheduler may implement it any way, it may group requests by languages or other way,
// it may call `translate` method or `translateBatch`, etc

scheduler
	.translate('My first translation request', 'en', 'de')
	.then((translate) => console.log('Request #1', translate));

scheduler
	.translate('My second translation request', 'en', 'de')
	.then((translate) => console.log('Request #2', translate));
```

# API

You can specify options in constructor for each `Translator` class.

## apiKey

type: `string`

Access key for requests to translator API

## useMultiplexing

type: `boolean`

Union text array to 1 request (or more, but less than usualy anyway).

Option for reduce the number of requests, but it can make artefacts in translated text.

Some modules may not support this feature.

## headers

type: `Record<string, string>`

Additional headers for requests

## corsProxy

type: `string | ((url: string) => string)`

Proxy prefix or transform function which return url with CORS proxy

CORS proxy useful to avoid CORS error in browser or to mask server requests as browser requests.

All requests will send through this proxy server and this server will modify headers
