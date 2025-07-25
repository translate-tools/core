import z from 'zod';

import { BaseTranslator } from '../BaseTranslator';

export class TartuNLPTranslator extends BaseTranslator {
	public static readonly translatorName = 'TartuNLPTranslator';

	public static isSupportedAutoFrom() {
		return false;
	}

	public static getSupportedLanguages(): string[] {
		// eslint-disable
		// prettier-ignore
		return [
			"en", "et", "de", "lt", "lv",
			"fi", "ru", "no", "hu", "se",
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

	public async translate(text: string, from: string, to: string) {
		return this.translateBatch([text], from, to).then((resp) => resp[0]);
	}

	public async translateBatch(text: string[], from: string, to: string) {
		return this.fetch('https://api.tartunlp.ai/translation/v2', {
			responseType: 'json',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...this.options.headers,
			},
			body: JSON.stringify({ text, src: from, tgt: to }),
		}).then((rsp) => {
			return z
				.object({ result: z.string().array() })
				.parse(rsp.data, { error: () => 'Unexpected data' }).result;
		});
	}
}
