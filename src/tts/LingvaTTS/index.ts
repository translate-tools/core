import axios from 'axios';

import { TTSAudioBuffer, TTSProviderProps } from '..';

export class LingvaTTS implements TTSProviderProps {
	private host = 'https://translate.plausibility.cloud';

	public async getAudioBuffer(text: string, language: string): Promise<TTSAudioBuffer> {
		const url = `${this.host}/api/v1/audio/${encodeURIComponent(
			language,
		)}/${encodeURIComponent(text)}`;

		return axios({ url, method: 'GET', responseType: 'json' }).then(
			({ data: json }) => {
				if (typeof json !== 'object' || json === null) {
					throw new TypeError('Unexpected response');
				}
				if (!('audio' in json) || !Array.isArray((json as any).audio)) {
					throw new TypeError('Unexpected response');
				}

				return {
					type: 'audio/mpeg',
					buffer: new Uint8Array((json as any).audio).buffer,
				};
			},
		);
	}

	public static getSupportedLanguages() {
		// prettier-ignore
		return [
			"af", "sq", "am", "ar", "hy", "as", "ay", "az", "bm", "eu",
			"be", "bn", "bho", "bs", "bg", "ca", "ceb", "ny", "zh", "zh_HANT",
			"co", "hr", "cs", "da", "dv", "doi", "nl", "en", "eo", "et", "ee",
			"tl", "fi", "fr", "fy", "gl", "ka", "de", "el", "gn", "gu", "ht",
			"ha", "haw", "iw", "hi", "hmn", "hu", "is", "ig", "ilo", "id",
			"ga", "it", "ja", "jw", "kn", "kk", "km", "rw", "gom", "ko",
			"kri", "ku", "ckb", "ky", "lo", "la", "lv", "ln", "lt", "lg",
			"lb", "mk", "mai", "mg", "ms", "ml", "mt", "mi", "mr", "mni-Mtei",
			"lus", "mn", "my", "ne", "no", "or", "om", "ps", "fa", "pl",
			"pt", "pa", "qu", "ro", "ru", "sm", "sa", "gd", "nso", "sr",
			"st", "sn", "sd", "si", "sk", "sl", "so", "es", "su", "sw", "sv",
			"tg", "ta", "tt", "te", "th", "ti", "ts", "tr", "tk", "ak", "uk", "ur",
			"ug", "uz", "vi", "cy", "xh", "yi", "yo", "zu"
		];
	}
}
