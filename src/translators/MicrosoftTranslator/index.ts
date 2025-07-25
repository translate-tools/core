import { z } from 'zod';

import { LanguageAliases } from '../../languages/LanguageAliases';

import { BaseTranslator } from '../BaseTranslator';

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

// eslint-disable
// prettier-ignore
const supportedLanguagesMap = new LanguageAliases([
	"ace", "af", "sq", "am", "ar", "arz", "ary", "arb", "hy", "as",
	"ast", "az", "ban", "bn", "ba", "eu", "bbc", "be", "bho", "bik",
	"brx", "bs", "bg", "yue", "ca", "ceb", "hne", "lzh", "zh-Hans",
	"zh-Hant", "co", "hr", "cs", "da", "prs", "dv", "doi", "nl", "en",
	"en-GB", "epo", "et", "fo", "fj", "fil", "fi", "fr", "fr-CA", "fy",
	"fur", "gl", "lug", "ka", "de", "el", "gu", "ht", "ha", "he", "hil",
	"hi", "mww", "hu", "iba", "is", "ig", "ilo", "id", "ikt", "iu", "iu-Latn",
	"ga", "it", "jam", "ja", "jav", "kea", "kn", "pam", "ks", "kk", "km",
	"rw", "tlh-Latn", "gom", "ko", "kri", "ku", "kmr", "ky", "lo", "la", "lv",
	"lij", "lim", "ln", "lt", "lmo", "dsb", "lb", "mk", "mai", "mg", "ms",
	"ml", "mt", "mr", "mwr", "mfe", "min", "mn-Cyrl", "mn-Mong", "my", "mi",
	"ne", "nb", "nno", "nya", "oc", "or", "pap", "ps", "fa", "pl", "pt",
	"pt-PT", "pa", "pnb", "otq", "ro", "run", "ru", "sm", "sa", "srd",
	"sr-Cyrl", "sr-Latn", "st", "nso", "tn", "crs", "sn", "scn", "sd", "si",
	"sk", "sl", "so", "es", "su", "sw", "sv", "ty", "tgk", "ta", "tt", "te",
	"tet", "th", "bo", "ti", "tpi", "to", "tr", "tk", "uk", "hsb", "ur", "ug",
	"uz", "vec", "vi", "war", "cy", "xh", "ydd", "yo", "yua", "zu"
]);
// eslint-enable

export class MicrosoftTranslator extends BaseTranslator<{ tokenLifetime?: number }> {
	public static readonly translatorName = 'MicrosoftTranslator';

	public static isSupportedAutoFrom = () => true;

	public static getSupportedLanguages(): string[] {
		return supportedLanguagesMap.getAll();
	}

	public getLengthLimit() {
		return 50_000;
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

	public async translate(text: string, from: string, to: string) {
		return this.translateBatch([text], from, to).then((resp) => resp[0]);
	}

	public async translateBatch(text: string[], from: string, to: string) {
		const sourceLanguage = from === 'auto' ? 'auto' : supportedLanguagesMap.get(from);
		const targetLanguage = supportedLanguagesMap.get(to);

		if (!sourceLanguage) throw new TypeError(`Unsupported source language ${from}`);
		if (!targetLanguage) throw new TypeError(`Unsupported source language ${to}`);

		const token = await this.getToken();

		const url =
			'https://api-edge.cognitive.microsofttranslator.com/translate?' +
			// Omit `from` parameter for auto detection of language
			(sourceLanguage !== 'auto'
				? `from=${encodeURIComponent(sourceLanguage)}&`
				: '') +
			`to=${encodeURIComponent(
				targetLanguage,
			)}&api-version=3.0&includeSentenceLength=true`;

		return this.fetch(url, {
			responseType: 'json',
			method: 'POST',
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
			body: JSON.stringify(text.map((text) => ({ Text: text }))),
		}).then((rawResult) => {
			const result = ResponseScheme.parse(rawResult.data);

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

	protected token:
		| {
				value: string;
				issuedAt: number;
		  }
		| Promise<string>
		| null = null;
	protected async getToken() {
		// Wait resolution if pending
		if (this.token instanceof Promise) return this.token;

		// Fetch new token
		const tokenLifetime = this.options.tokenLifetime ?? 30_000;
		if (!this.token || Date.now() - this.token.issuedAt > tokenLifetime) {
			this.token = this.fetch('https://edge.microsoft.com/translate/auth', {
				responseType: 'text',
				method: 'GET',
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
				body: null,
			}).then(({ data: token }) => {
				this.token = { value: token, issuedAt: Date.now() };
				return token;
			});

			return await this.token;
		}

		// Use cached value
		return this.token.value;
	}
}
