import { langCode } from '../Translator';
import { BaseTranslator } from '../BaseTranslator';

/**
 * This module did not test too ago
 */
export class ReversoTranslator extends BaseTranslator {
	public static readonly translatorName = 'ReversoTranslator (public)';

	public static isSupportedAutoFrom() {
		return false;
	}

	public static getSupportedLanguages(): langCode[] {
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

	private langMap: Record<string, string> = {
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

	public translate(text: string, from: langCode, to: langCode) {
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

		const apiHost = this.wrapUrlToCorsProxy(
			'https://api.reverso.net/translate/v1/translation',
		);
		return this.fetch(apiHost, {
			responseType: 'json',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				...this.options.headers,
			},
			body: JSON.stringify(data),
		}).then((rsp) => {
			const response = rsp.data as any;
			if (
				!(response instanceof Object) ||
				!(response.translation instanceof Array) ||
				response.translation.every((i: any) => typeof i !== 'string')
			) {
				throw new Error('Unexpected response');
			}

			return (response.translation as string[]).join('');
		});
	}

	public translateBatch(text: string[], langFrom: langCode, langTo: langCode) {
		return Promise.all(text.map((text) => this.translate(text, langFrom, langTo)));
	}
}
