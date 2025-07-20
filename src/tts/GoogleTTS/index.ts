import { bufferToArrayBuffer } from '../../utils/buffers';
import { Fetcher } from '../../utils/Fetcher';
import { basicFetcher } from '../../utils/Fetcher/basicFetcher';

import { TTSAudioBuffer, TTSProviderProps } from '../types';

export class GoogleTTS implements TTSProviderProps {
	private readonly fetcher;
	constructor({ fetcher = basicFetcher }: { fetcher?: Fetcher } = {}) {
		this.fetcher = fetcher;
	}

	public getAudioBuffer(text: string, language: string): Promise<TTSAudioBuffer> {
		const url =
			`https://translate.google.com/translate_tts?ie=UTF-8&tl=${language}&client=dict-chrome-ex&ttsspeed=0.5&q=` +
			encodeURIComponent(text);

		return this.fetcher(url, { responseType: 'arrayBuffer', method: 'GET' }).then(
			({ data }) => {
				let buffer: ArrayBuffer;
				if (typeof Buffer !== 'undefined' && data instanceof Buffer) {
					buffer = bufferToArrayBuffer(data);
				} else if (data instanceof ArrayBuffer) {
					buffer = data;
				} else {
					throw new TypeError('Unexpected response');
				}

				return {
					type: 'audio/mpeg',
					buffer,
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
