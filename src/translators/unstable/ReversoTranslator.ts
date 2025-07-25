import z from 'zod';

import { BaseTranslator } from '../BaseTranslator';

/**
 * This module did not test too ago
 */
export class ReversoTranslator extends BaseTranslator {
	public static readonly translatorName = 'ReversoTranslator (public)';

	public static isSupportedAutoFrom() {
		return false;
	}

	public static getSupportedLanguages(): string[] {
		// eslint-disable
		// prettier-ignore
		return [
			'en', 'ar', 'nl', 'he', 'es', 'it', 'zh', 'de', 'pl', 'pt',
			'ro', 'ru', 'tr', 'fr', 'ja',
		];
		// eslint-enable
	}

	public getLengthLimit() {
		return 5000;
	}

	public getRequestsTimeout() {
		return 1000;
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

	private readonly langMap: Record<string, string> = {
		en: 'eng',
		ar: 'ara',
		nl: 'dut',
		he: 'heb',
		es: 'spa',
		it: 'ita',
		zh: 'chi',
		de: 'ger',
		pl: 'pol',
		pt: 'por',
		ro: 'rum',
		ru: 'rus',
		tr: 'tur',
		fr: 'fra',
		ja: 'jpn',
	};

	public translate(text: string, from: string, to: string) {
		const localFrom = this.langMap[from];
		const localTo = this.langMap[to];

		const data = {
			input: text,
			from: localFrom,
			to: localTo,
			format: 'text',
			options: {
				origin: 'translation.web',
				sentenceSplitter: true,
				contextResults: true,
				languageDetection: false,
			},
		};

		const apiHost = 'https://api.reverso.net/translate/v1/translation';
		return this.fetch(apiHost, {
			responseType: 'json',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				...this.options.headers,
			},
			body: JSON.stringify(data),
		}).then((rsp) => {
			const response = z
				.object({
					translation: z.string().array(),
				})
				.parse(rsp.data, { error: () => 'Unexpected response format' });

			return response.translation.join('');
		});
	}

	public translateBatch(text: string[], from: string, to: string) {
		return Promise.all(text.map((text) => this.translate(text, from, to)));
	}
}
