import queryString from 'query-string';

import { BaseTranslator } from '../BaseTranslator';
import { getFixedLanguage, languageAliases } from './languages';
import { getToken } from './token';
import { encodeForBatch, parseXMLResponse, visitArrayItems } from './utils';

/**
 * Common class for google translator implementations
 */
export abstract class AbstractGoogleTranslator extends BaseTranslator {
	public static isSupportedAutoFrom() {
		return true;
	}

	public static getSupportedLanguages(): string[] {
		return languageAliases.getAll();
	}

	public getLengthLimit() {
		return 4000;
	}

	public getRequestsTimeout() {
		return 300;
	}
}

/**
 * Translator implementation which use Google API with token from https://translate.google.com
 */
export class GoogleTranslator extends AbstractGoogleTranslator {
	public static readonly translatorName = 'GoogleTranslator';

	public checkLimitExceeding(text: string | string[]) {
		if (Array.isArray(text)) {
			const encodedText = encodeForBatch(text).join('');
			const extra = encodedText.length - this.getLengthLimit();
			return extra > 0 ? extra : 0;
		} else {
			const extra = text.length - this.getLengthLimit();
			return extra > 0 ? extra : 0;
		}
	}

	public translate(text: string, from: string, to: string) {
		return getToken(text).then(({ value: tk }) => {
			const apiPath = 'https://translate.google.com/translate_a/single';

			const data = {
				client: 't',
				sl: getFixedLanguage(from),
				tl: getFixedLanguage(to),
				hl: getFixedLanguage(to),
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

			const url = apiPath + '?' + queryString.stringify(data);

			return this.fetch(url, {
				responseType: 'json',
				method: 'GET',
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

	public translateBatch(text: string[], from: string, to: string) {
		const preparedText = encodeForBatch(text);
		return getToken(preparedText.join('')).then(({ value: tk }) => {
			const apiPath = 'https://translate.googleapis.com/translate_a/t';

			const data = {
				anno: 3,
				client: 'te',
				v: '1.0',
				format: 'html',
				sl: getFixedLanguage(from),
				tl: getFixedLanguage(to),
				tk,
			};

			const url = apiPath + '?' + queryString.stringify(data);
			const body = preparedText
				.map((text) => `&q=${encodeURIComponent(text)}`)
				.join('');

			return this.fetch(url, {
				responseType: 'json',
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					...this.options.headers,
				},
				body,
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
								const parsedText = parseXMLResponse(obj);
								result.push(parsedText || obj);
							} else {
								const parsedText = parseXMLResponse(obj);
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

						return result;
					} catch (err) {
						console.warn('Got response', rawResp);
						throw err;
					}
				});
		});
	}
}

/**
 * Translator implementation which use Google API without token
 */
export class GoogleTranslatorTokenFree extends AbstractGoogleTranslator {
	public static readonly translatorName = 'GoogleTranslatorTokenFree';

	public translate = async (text: string, from: string, to: string) => {
		const [translation] = await this.translateBatch([text], from, to);
		return translation;
	};

	public translateBatch(text: string[], from: string, to: string) {
		const apiPath = 'https://translate.googleapis.com/translate_a/t';

		const data = {
			client: 'dict-chrome-ex',
			sl: getFixedLanguage(from),
			tl: getFixedLanguage(to),
			q: text,
		};

		const url = apiPath + '?' + queryString.stringify(data);

		return this.fetch(url, {
			responseType: 'json',
			method: 'GET',
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
					for (let idx = 0; idx < intermediateTextsArray.length; idx++) {
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

					return result;
				} catch (err) {
					console.warn('Got response', rawResp);
					throw err;
				}
			});
	}
}
