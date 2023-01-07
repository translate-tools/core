import { stringify } from 'query-string';
import { unescape } from 'lodash';

import { langCode, langCodeWithAuto } from '../../types/Translator';
import { BaseTranslator } from '../../util/BaseTranslator';
import { fetchResponseToJson } from '../../lib/fetchResponseToJson';

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
			'az', 'ml', 'sq', 'mt', 'am', 'mk', 'en', 'mi', 'ar', 'mr',
			'hy', 'af', 'mn', 'eu', 'de', 'ba', 'ne', 'be', 'no', 'bn',
			'pa', 'my', 'bg', 'fa', 'bs', 'pl', 'cy', 'pt', 'hu', 'ro',
			'vi', 'ru', 'ht', 'gl', 'sr', 'nl', 'si', 'sk', 'el', 'sl',
			'ka', 'sw', 'gu', 'su', 'da', 'tg', 'he', 'th', 'yi', 'tl',
			'id', 'ta', 'ga', 'tt', 'it', 'te', 'is', 'tr', 'es', 'kk',
			'uz', 'kn', 'uk', 'ca', 'ur', 'ky', 'fi', 'zh', 'fr', 'ko',
			'hi', 'xh', 'hr', 'km', 'cs', 'lo', 'sv', 'la', 'gd', 'lv',
			'et', 'lt', 'eo', 'lb', 'jv', 'mg', 'ja', 'ms',
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
		const sid = await getYandexSID();
		if (sid === null) {
			throw new Error('Invalid SID');
		}

		const options = {
			format: 'html',
			lang: from === 'auto' ? to : `${from}-${to}`,
		};

		let body = stringify(options);
		for (const textChunk of text) {
			body += '&text=' + encodeURIComponent(textChunk);
		}

		// NOTE: if service will resist and will not work, it may check order of headers, parameters and requests
		// in this case just make requests less specific to it looks like requests from typical page (with overhead requests if require)
		const urlWithSid =
			'https://translate.yandex.net/api/v1/tr.json/translate?srv=tr-url-widget&id=' +
			sid +
			'-0-0&';
		return fetch(this.wrapUrlToCorsProxy(urlWithSid + body), {
			method: 'GET',
			credentials: 'omit',
			referrerPolicy: 'no-referrer',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				...this.options.headers,
			},
		})
			.then(fetchResponseToJson)
			.then((resp) => {
				if (
					!(resp instanceof Object) ||
					!Array.isArray(resp.text) ||
					resp.text.length !== text.length
				) {
					throw new Error('Unexpected response');
				}

				return resp.text.map((text: any) => {
					if (typeof text !== 'string') {
						throw new Error('Unexpected response type');
					}

					return unescape(text);
				});
			});
	}
}
