The guide how to migrate from version 3 to 4

# Microsoft translator is removed

`MicrosoftTranslator` has been removed. Use `GoogleTranslator` instead.

replace:

```ts
import { MicrosoftTranslator } from 'anylang/translators';

const translator = new MicrosoftTranslator();
```

to:

```ts
import { GoogleTranslator } from 'anylang/translators';

const translator = new GoogleTranslator();
```