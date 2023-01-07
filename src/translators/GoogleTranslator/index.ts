import axios from 'axios';
import { stringify } from 'query-string';
import xpath from 'xpath';
import { DOMParser } from '@xmldom/xmldom';

import { langCode, langCodeWithAuto } from '../../types/Translator';
import { BaseTranslator } from '../../util/BaseTranslator';
import { getToken } from './token';
import { visitArrayItems } from './utils';

/**
 * Common class for google translator implementations
 */
export abstract class AbstractGoogleTranslator extends BaseTranslator {
	public static isSupportedAutoFrom() {
		return true;
	}

	public static getSupportedLanguages(): langCode[] {
		// Supported, but not valid languages ["zh-cn", "zh-tw", 'ceb', 'haw', 'iw', 'hmn', 'jw', 'ma']

		// eslint-disable
		// prettier-ignore
		return [
			'af', 'sq', 'am', 'ar', 'hy', 'az', 'eu', 'be', 'bn', 'bs',
			'bg', 'ca', 'ny', 'co', 'hr', 'cs', 'da', 'nl', 'en', 'eo',
			'et', 'tl', 'fi', 'fr', 'fy', 'gl', 'ka', 'de', 'el', 'gu',
			'ht', 'ha', 'hi', 'hu', 'is', 'ig', 'id', 'ga', 'it', 'ja',
			'kn', 'kk', 'km', 'ko', 'ku', 'ky', 'lo', 'la', 'lv', 'lt',
			'lb', 'mk', 'mg', 'ms', 'ml', 'mt', 'mi', 'mr', 'mn', 'my',
			'ne', 'no', 'ps', 'fa', 'pl', 'pt', 'pa', 'ro', 'ru', 'sm',
			'gd', 'sr', 'st', 'sn', 'sd', 'si', 'sk', 'sl', 'so', 'es',
			'su', 'sw', 'sv', 'tg', 'ta', 'te', 'th', 'tr', 'uk', 'ur',
			'uz', 'vi', 'cy', 'xh', 'yi', 'yo', 'zu', 'zh',
		];
		// eslint-enable
	}

	public getLengthLimit() {
		return 4000;
	}

	public getRequestsTimeout() {
		return 300;
	}

	protected readonly langReplacements: Record<string, string> = {
		zh: 'zh-cn',
	};

	protected fixLang(lang: langCodeWithAuto) {
		return lang in this.langReplacements ? this.langReplacements[lang] : lang;
	}
}

/**
 * Translator implementation which use Google API with token from https://translate.google.com
 */
export class GoogleTranslator extends AbstractGoogleTranslator {
	public static readonly translatorName = 'GoogleTranslator';

	public checkLimitExceeding(text: string | string[]) {
		if (Array.isArray(text)) {
			const encodedText = this.encodeForBatch(text).join('');
			const extra = encodedText.length - this.getLengthLimit();
			return extra > 0 ? extra : 0;
		} else {
			const extra = text.length - this.getLengthLimit();
			return extra > 0 ? extra : 0;
		}
	}

	public translate(text: string, from: langCodeWithAuto, to: langCode) {
		return getToken(text).then(({ value: tk }) => {
			const apiPath = 'https://translate.google.com/translate_a/single';

			const data = {
				client: 't',
				sl: this.fixLang(from),
				tl: this.fixLang(to),
				hl: this.fixLang(to),
				dt: ['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'],
				ie: 'UTF-8',
				oe: 'UTF-8',
				otf: 1,
				ssel: 0,
				tsel: 0,
				kc: 7,
				q: text,
				tk,
			};

			const url = apiPath + '?' + stringify(data);

			return axios
				.get(this.wrapUrlToCorsProxy(url), {
					withCredentials: false,
					headers: this.options.headers,
				})
				.then((rsp) => rsp.data)
				.then((rsp) => {
					if (!(rsp instanceof Array) || !(rsp[0] instanceof Array)) {
						throw new Error('Unexpected response');
					}

					const translatedText = rsp[0]
						.map((chunk) =>
							chunk instanceof Array && typeof chunk[0] === 'string'
								? chunk[0]
								: '',
						)
						.join('');

					return translatedText;
				});
		});
	}

	private parseXMLResponse = (text: string) => {
		try {
			const doc = new DOMParser().parseFromString(text);
			const nodes = xpath.select('//pre/*[not(self::i)]//text()', doc);
			return nodes.length === 0
				? null
				: nodes.map((node) => node.toString()).join(' ');
		} catch (err) {
			return null;
		}
	};

	public translateBatch(text: string[], from: langCodeWithAuto, to: langCode) {
		const preparedText = this.encodeForBatch(text);
		return getToken(preparedText.join('')).then(({ value: tk }) => {
			const apiPath = 'https://translate.googleapis.com/translate_a/t';

			const data = {
				anno: 3,
				client: 'te',
				v: '1.0',
				format: 'html',
				sl: this.fixLang(from),
				tl: this.fixLang(to),
				tk,
			};

			const url = apiPath + '?' + stringify(data);
			const body = preparedText
				.map((text) => `&q=${encodeURIComponent(text)}`)
				.join('');

			return axios({
				url: this.wrapUrlToCorsProxy(url),
				method: 'POST',
				withCredentials: false,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					...this.options.headers,
				},
				data: body,
			})
				.then((rsp) => rsp.data)
				.then((rawResp) => {
					try {
						if (!Array.isArray(rawResp)) {
							throw new Error('Unexpected response');
						}

						const isSingleResponseMode = text.length === 1;

						const result: string[] = [];
						visitArrayItems(rawResp, (obj) => {
							if (isSingleResponseMode && result.length === 1) return;

							if (typeof obj !== 'string') return;

							if (isSingleResponseMode) {
								const parsedText = this.parseXMLResponse(obj);
								result.push(parsedText || obj);
							} else {
								const parsedText = this.parseXMLResponse(obj);
								if (parsedText !== null) {
									result.push(parsedText);
								}
							}
						});

						if (result.length !== text.length) {
							throw new Error(
								'Mismatching a lengths of original and translated arrays',
							);
						}

						return result as string[];
					} catch (err) {
						console.warn('Got response', rawResp);
						throw err;
					}
				});
		});
	}

	private encodeForBatch(textList: string[]) {
		return textList.map((text, i) => `<pre><a i="${i}">${text}</a></pre>`);
	}
}

/**
 * Translator implementation which use Google API without token
 */
export class GoogleTranslatorTokenFree extends AbstractGoogleTranslator {
	public static readonly translatorName = 'GoogleTranslatorTokenFree';

	public translate = async (text: string, from: langCodeWithAuto, to: langCode) => {
		const [translation] = await this.translateBatch([text], from, to);
		return translation;
	};

	public translateBatch(text: string[], from: langCodeWithAuto, to: langCode) {
		const apiPath = 'https://translate.googleapis.com/translate_a/t';

		const data = {
			client: 'dict-chrome-ex',
			sl: this.fixLang(from),
			tl: this.fixLang(to),
			q: text,
		};

		const url = apiPath + '?' + stringify(data);

		return axios({
			url: this.wrapUrlToCorsProxy(url),
			method: 'GET',
			withCredentials: false,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				...this.options.headers,
			},
		})
			.then((rsp) => rsp.data)
			.then((rawResp) => {
				try {
					if (!Array.isArray(rawResp)) {
						throw new Error('Unexpected response');
					}

					const intermediateTextsArray: string[] = [];
					visitArrayItems(rawResp, (obj) => {
						if (typeof obj === 'string') {
							intermediateTextsArray.push(obj);
						}
					});

					const result: string[] = [];

					const isSingleResponseMode = text.length === 1;
					const isOneToOneMappingMode =
						intermediateTextsArray.length === text.length;
					for (const idx in intermediateTextsArray) {
						const text = intermediateTextsArray[idx];

						if (isSingleResponseMode) {
							result.push(text);
							break;
						}

						// Each second text it's not translation if not 1-1 mapping
						const isTranslation =
							isOneToOneMappingMode || Number(idx) % 2 === 0;
						if (isTranslation) {
							result.push(text);
						}
					}

					if (result.length !== text.length) {
						console.warn('Translation result', result);
						throw new Error(
							'Mismatching a lengths of original and translated arrays',
						);
					}

					return result as string[];
				} catch (err) {
					console.warn('Got response', rawResp);
					throw err;
				}
			});
	}
}
