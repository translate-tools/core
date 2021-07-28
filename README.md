The translate tools core kit contains a interfaces and default implementations of basic translation entities.

This package is part of [translate tools project](https://github.com/translate-tools).

Main purpose of core package it's standardization a translator entities.

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
