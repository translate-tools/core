import z from 'zod';

import { BaseTranslator, TranslatorOptions } from '../../BaseTranslator';
import { langCode, langCodeWithAuto } from '../../Translator';

// FIXME: translator fails the test `Translate many texts with "translateBatch"` - fix it or remove this translator
export class LingvaTranslate extends BaseTranslator {
	public static readonly translatorName = 'LingvaTranslate';

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

	// URL of your instance, look at https://github.com/thedaviddelta/lingva-translate#instances
	// for local instance use URL "http://localhost:3000"
	private readonly apiHost;

	constructor(options: TranslatorOptions) {
		super(options);

		this.apiHost = options.apiHost ?? 'https://translate.plausibility.cloud';
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
		const requestUrl = `${this.apiHost}/api/v1/${encodeURIComponent(
			from,
		)}/${encodeURIComponent(to)}/${encodeURIComponent(text)}`;
		return this.fetch(requestUrl, {
			responseType: 'json',
			method: 'GET',
			headers: {
				'User-Agent':
					'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:99.0) Gecko/20100101 Firefox/99.0',
				Accept: '*/*',
				'Accept-Language': 'en-US,en;q=0.5',
				'Sec-Fetch-Dest': 'empty',
				'Sec-Fetch-Mode': 'cors',
				'Sec-Fetch-Site': 'same-origin',
				'Content-Type': 'application/x-www-form-urlencoded',
				...this.options.headers,
			},
		}).then((rsp) => {
			return z
				.object({
					translation: z.string(),
				})
				.parse(rsp.data, { error: () => 'Unexpected data' }).translation;
		});
	}

	public async translateBatch(texts: string[], from: langCodeWithAuto, to: langCode) {
		return Promise.all(texts.map((text) => this.translate(text, from, to)));
	}
}
