import axios from 'axios';
import { stringify } from 'query-string';

import { langCode, langCodeWithAuto } from '../../Translator';
import { BaseTranslator, TranslatorOptions } from '../../BaseTranslator';

export class LibreTranslateTranslator extends BaseTranslator {
	public static readonly translatorName = 'LibreTranslateTranslator';

	public static isRequiredKey = () => false;

	public static isSupportedAutoFrom = () => true;

	public static getSupportedLanguages(): langCode[] {
		// eslint-disable
		// prettier-ignore
		return [
			"en", "ar", "az", "zh", "cs",
			"nl", "eo", "fi", "fr", "de",
			"el", "hi", "hu", "id", "ga",
			"it", "ja", "ko", "fa", "pl",
			"pt", "ru", "sk", "es", "sv",
			"tr", "uk", "vi"
		];
		// eslint-enable
	}

	// URL of your instance of LibreTranslate
	// for local instance use URL "http://localhost/translate"
	private readonly apiHost;

	constructor(options: TranslatorOptions) {
		super(options);

		this.apiHost = options.apiHost ?? 'https://translate.terraprint.co/translate';
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
		const requestData: Record<any, any> = {
			q: text,
			source: from,
			target: to,
			format: 'text',
		};

		if (this.options.apiKey) {
			requestData['api_key'] = this.options.apiKey;
		}

		return axios
			.post(this.apiHost, stringify(requestData), {
				headers: {
					'User-Agent':
						'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:99.0) Gecko/20100101 Firefox/99.0',
					Accept: '*/*',
					'Accept-Language': 'en-US,en;q=0.5',
					'Sec-Fetch-Dest': 'empty',
					'Sec-Fetch-Mode': 'cors',
					'Sec-Fetch-Site': 'same-origin',
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			})
			.then((rsp) => {
				if (
					typeof rsp.data !== 'object' ||
					rsp.data === null ||
					typeof (rsp.data as any).translatedText !== 'string'
				) {
					throw new TypeError('Unexpected data');
				}

				return (rsp.data as any).translatedText as string;
			});
	}

	public async translateBatch(texts: string[], from: langCodeWithAuto, to: langCode) {
		return Promise.all(texts.map((text) => this.translate(text, from, to)));
	}
}
