import axios from 'axios';

import { langCode, langCodeWithAuto } from '../../types/Translator';
import { BaseTranslator } from '../../util/BaseTranslator';

export class DeepLTranslator extends BaseTranslator<{ AccessKey: string }> {
	public static readonly translatorName = 'DeepLTranslator';

	public static isRequiredKey = () => true;

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

	public async translateBatch(text: string[], from: langCodeWithAuto, to: langCode) {
		// eslint-disable-next-line camelcase
		const requestBody: Record<string, string | string[]> = { text, target_lang: to };

		if (from !== 'auto') {
			requestBody['source_lang'] = from;
		}

		const stringifiedBody = Object.entries(requestBody)
			.map(([key, value]) => {
				if (!Array.isArray(value)) return `${key}=${encodeURIComponent(value)}`;

				// Handle array parameters
				return value.map((t) => `${key}=` + encodeURIComponent(t)).join('&');
			})
			.join('&');

		return axios
			.post('https://api-free.deepl.com/v2/translate', stringifiedBody, {
				withCredentials: false,
				headers: {
					Authorization: `DeepL-Auth-Key ${this.options.AccessKey}`,
					'Content-Type': 'application/x-www-form-urlencoded',
					...this.options.headers,
				},
			})
			.then((rsp) => {
				if (
					typeof rsp.data !== 'object' ||
					rsp.data === null ||
					!Array.isArray((rsp.data as any).translations)
				) {
					throw new TypeError('Unexpected data');
				}

				return ((rsp.data as any).translations as any[]).map(({ text }) => text);
			});
	}
}
