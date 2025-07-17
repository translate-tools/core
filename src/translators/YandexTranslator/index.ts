import { unescape } from 'lodash';
import queryString from 'query-string';
import z from 'zod';

import { BaseTranslator } from '../BaseTranslator';
import { langCode, langCodeWithAuto } from '../Translator';
import { getYandexSID } from './getYandexSID';

export class YandexTranslator extends BaseTranslator {
	public static readonly translatorName = 'YandexTranslator';

	public static isSupportedAutoFrom() {
		return true;
	}

	public static getSupportedLanguages(): langCode[] {
		// Supported, but not valid languages ['mhr', 'pap', 'ceb', 'mrj', 'udm']

		// eslint-disable
		// prettier-ignore
		return [
			'af', 'am', 'ar', 'az', 'ba', 'be', 'bg', 'bn', 'bs', 'ca',
			'ceb', 'cs', 'cv', 'cy', 'da', 'de', 'el', 'emj', 'en', 'eo',
			'es', 'et', 'eu', 'fa', 'fi', 'fr', 'ga', 'gd', 'gl', 'gu',
			'he', 'hi', 'hr', 'ht', 'hu', 'hy', 'id', 'is', 'it', 'ja',
			'jv', 'ka', 'kazlat', 'kk', 'km', 'kn', 'ko', 'ky', 'la', 'lb',
			'lo', 'lt', 'lv', 'mg', 'mhr', 'mi', 'mk', 'ml', 'mn', 'mr',
			'mrj', 'ms', 'mt', 'my', 'ne', 'nl', 'no', 'pa', 'pap', 'pl',
			'pt', 'ro', 'ru', 'sah', 'si', 'sjn', 'sk', 'sl', 'sq', 'sr',
			'su', 'sv', 'sw', 'ta', 'te', 'tg', 'th', 'tl', 'tr', 'tt',
			'udm', 'uk', 'ur', 'uz', 'uzbcyr', 'vi', 'xh', 'yi', 'zh', 'zu'
		];
		// eslint-enable
	}

	public getLengthLimit() {
		return 4000;
	}

	public getRequestsTimeout() {
		return 500;
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
		const sid = await getYandexSID(this.fetch);
		if (sid === null) {
			throw new Error('Invalid SID');
		}

		const options = {
			format: 'html',
			lang: from === 'auto' ? to : `${from}-${to}`,
		};

		let body = queryString.stringify(options);
		for (const textChunk of text) {
			body += '&text=' + encodeURIComponent(textChunk);
		}

		// NOTE: if service will resist and will not work, it may check order of headers, parameters and requests
		// in this case just make requests less specific to it looks like requests from typical page (with overhead requests if require)
		const urlWithSid =
			'https://translate.yandex.net/api/v1/tr.json/translate?srv=tr-url-widget&id=' +
			sid +
			'-0-0&';
		return this.fetch(urlWithSid + body, {
			responseType: 'json',
			method: 'GET',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				...this.options.headers,
			},
		}).then((response) => {
			const data = z
				.object({
					text: z.string().array(),
				})
				.parse(response.data);

			return data.text.map((text) => unescape(text));
		});
	}
}
