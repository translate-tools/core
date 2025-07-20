import { Fetcher } from '../../utils/Fetcher';
import { basicFetcher } from '../../utils/Fetcher/basicFetcher';

import { TTSAudioBuffer, TTSProviderProps } from '../types';

export class LingvaTTS implements TTSProviderProps {
	private readonly host;
	private readonly fetcher;
	constructor({
		fetcher = basicFetcher,
		apiHost,
	}: { fetcher?: Fetcher; apiHost?: string } = {}) {
		this.host = apiHost ?? 'https://translate.plausibility.cloud';
		this.fetcher = fetcher;
	}

	public async getAudioBuffer(text: string, language: string): Promise<TTSAudioBuffer> {
		const url = `${this.host}/api/v1/audio/${encodeURIComponent(
			language,
		)}/${encodeURIComponent(text)}`;

		return this.fetcher(url, { responseType: 'json', method: 'GET' }).then(
			({ data: json }) => {
				if (typeof json !== 'object' || json === null) {
					throw new TypeError('Unexpected response');
				}
				if (!('audio' in json) || !Array.isArray(json.audio)) {
					throw new TypeError('Unexpected response');
				}

				return {
					type: 'audio/mpeg',
					buffer: new Uint8Array(json.audio).buffer,
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
