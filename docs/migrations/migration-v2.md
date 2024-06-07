Migration guide for version 2.

# Use custom fetcher

Option `corsProxy` been removed.

If you used this option, you should update your code to use custom fetcher like that:

```ts
import { GoogleTranslator } from '@translate-tools/core/translators/GoogleTranslator';

import { Fetcher } from '@translate-tools/core/utils/Fetcher';
import { basicFetcher } from '@translate-tools/core/utils/Fetcher/basicFetcher';

// Extend `basicFetcher` with use CORS proxy for all requests
const fetcher: Fetcher = async (url, options) => {
	// Use some CORS proxy service as prefix
	return basicFetcher('https://corsproxy.io/?' + url, options);
};

const translator = new GoogleTranslator({ fetcher });
```
