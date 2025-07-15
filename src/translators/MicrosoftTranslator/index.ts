import { langCode, langCodeWithAuto } from '../Translator';
import { BaseTranslator } from '../BaseTranslator';
import { z } from 'zod';

const ResponseScheme = z
	.object({
		translations: z
			.object({
				text: z.string(),
			})
			.array(),
	})
	.array()
	.or(
		z.object({
			error: z.object({
				code: z.number(),
				message: z.string(),
			}),
		}),
	);

export class MicrosoftTranslator extends BaseTranslator {
	public static readonly translatorName = 'MicrosoftTranslator';

	public static isSupportedAutoFrom = () => true;

	public static getSupportedLanguages(): langCode[] {
		// eslint-disable
		// prettier-ignore
		return [
			'bg', 'cs', 'da', 'de', 'el', 'en', 'es', 'et', 'fi', 'fr',
			'hu', 'id', 'it', 'ja', 'ko', 'lt', 'lv', 'nb', 'nl', 'pl',
			'pt', 'ro', 'ru', 'sk', 'sl', 'sv', 'tr', 'uk', 'zh'
		];
		// eslint-enable
	}

	public getLengthLimit() {
		return 5000;
	}

	public getRequestsTimeout() {
		return 300;
	}

	public checkLimitExceeding(text: string | string[]) {
		if (Array.isArray(text)) {
			const arrayLen = text.reduce((acc, text) => acc + text.length, 0);
			const extra = arrayLen - this.getLengthLimit();
			return extra > 0 ? extra : 0;
		} else {
			const extra = text.length - this.getLengthLimit();
			return extra > 0 ? extra : 0;
		}
	}

	public async translate(text: string, from: langCodeWithAuto, to: langCode) {
		return this.translateBatch([text], from, to).then((resp) => resp[0]);
	}

	private async getToken() {
		return fetch('https://edge.microsoft.com/translate/auth', {
			headers: {
				accept: '*/*',
				'accept-language':
					'zh-TW,zh;q=0.9,ja;q=0.8,zh-CN;q=0.7,en-US;q=0.6,en;q=0.5',
				'cache-control': 'no-cache',
				pragma: 'no-cache',
				priority: 'u=1, i',
				'referrer-policy': 'strict-origin-when-cross-origin',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'none',
				'sec-fetch-storage-access': 'active',
			},
			referrerPolicy: 'strict-origin-when-cross-origin',
			body: null,
			method: 'GET',
			mode: 'cors',
			credentials: 'omit',
		}).then((r) => r.text());
	}

	public async translateBatch(text: string[], from: langCodeWithAuto, to: langCode) {
		const token = await this.getToken();

		const url =
			'https://api-edge.cognitive.microsofttranslator.com/translate?' +
			// Omit `from` parameter for auto detection of language
			(from !== 'auto' ? `from=${encodeURIComponent(from)}&` : '') +
			`to=${encodeURIComponent(to)}&api-version=3.0&includeSentenceLength=true`;

		return fetch(url, {
			headers: {
				accept: '*/*',
				'accept-language':
					'zh-TW,zh;q=0.9,ja;q=0.8,zh-CN;q=0.7,en-US;q=0.6,en;q=0.5',
				authorization: `Bearer ${token}`,
				'cache-control': 'no-cache',
				'content-type': 'application/json',
				pragma: 'no-cache',
				priority: 'u=1, i',
				'referrer-policy': 'strict-origin-when-cross-origin',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'none',
				'sec-fetch-storage-access': 'active',
			},
			referrerPolicy: 'strict-origin-when-cross-origin',
			body: JSON.stringify(text.map((text) => ({ Text: text }))),
			method: 'POST',
			mode: 'cors',
			credentials: 'include',
		})
			.then((r) => r.json())
			.then((rawResult) => {
				const result = ResponseScheme.parse(rawResult);

				if ('error' in result) {
					throw new Error(`Code ${result.error.code}: ${result.error.message}`);
				}

				// Transform translations array
				return result.map((translationItem) =>
					// Build translation for single text
					translationItem.translations
						.map((translationSegment) => translationSegment.text)
						.join(' '),
				);
			});
	}
}
