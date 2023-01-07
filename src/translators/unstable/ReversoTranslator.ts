import { langCode } from '../../types/Translator';
import { BaseTranslator } from '../../util/BaseTranslator';
import { Multiplexor } from '../../lib/Multiplexor';
import { fetchResponseToJson } from '../../lib/fetchResponseToJson';

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
			const encodedText = this.mtp.encode(
				text.map((text, id) => ({ text, id: '' + id })),
			);
			const extra = encodedText.length - this.getLengthLimit();
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
				origin: 'reversodesktop',
				sentenceSplitter: true,
				contextResults: true,
				languageDetection: false,
			},
		};

		return fetch(
			this.wrapUrlToCorsProxy('https://api.reverso.net/translate/v1/translation'),
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json; charset=utf-8',
					...this.options.headers,
				},
				body: JSON.stringify(data),
			},
		)
			.then(fetchResponseToJson)
			.then((response) => {
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

	private readonly mtp = new Multiplexor({ tokenStart: '<', tokenEnd: '>' });
	public translateBatch(text: string[], langFrom: langCode, langTo: langCode) {
		const encodedText = this.mtp.encode(
			text.map((text, id) => ({ text, id: '' + id })),
		);

		return this.translate(encodedText, langFrom, langTo).then((rawTranslate) => {
			const result = Array<string | null>(text.length);

			const decodedMap = this.mtp.decode(rawTranslate);
			decodedMap.forEach(({ id, text }) => {
				const index = +id;
				result[index] = text;
			});

			return result;
		});
	}
}
