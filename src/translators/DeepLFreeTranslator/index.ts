import { langCode, langCodeWithAuto } from '../Translator';
import { BaseTranslator, TranslatorOptions } from '../BaseTranslator';
import { freeHosts } from './hosts';

export type DeepLTranslatorOptions = {
	apiHost?: string;
};

const getRandomItem = <T>(array: Array<T>): T => {
	const max = array.length;
	const randomIndex = Math.floor(Math.random() * max);
	return array[randomIndex];
};

const filteredFreeHosts = freeHosts.filter(
	(host) => host.startsWith('https') && /(\d+.){3}\d+/.test(host) === false,
);

// TODO: fix `HTTPError: Response code 429 (Too Many Requests)`. We should call multiple servers
export class DeepLFreeTranslator extends BaseTranslator<DeepLTranslatorOptions> {
	public static readonly translatorName = 'DeepLFreeTranslator';

	public static isRequiredKey = () => false;

	public static isSupportedAutoFrom = () => true;

	public static getSupportedLanguages(): langCode[] {
		// eslint-disable
		// prettier-ignore
		return [
			'bg', 'cs', 'da', 'de', 'el', 'en', 'es', 'et', 'fi', 'fr',
			'hu', 'id', 'it', 'ja', 'ko', 'lt', 'lv', 'nb', 'nl', 'pl',
			'pt', 'ro', 'ru', 'sk', 'sl', 'sv', 'tr', 'uk', 'zh'
		];
		// eslint-enable
	}

	private readonly apiHost;
	constructor({
		apiHost = 'https://deeplx.vercel.app',
		...options
	}: TranslatorOptions<DeepLTranslatorOptions>) {
		super(options);

		this.apiHost = apiHost;
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
		const host = this.apiHost ?? getRandomItem(filteredFreeHosts);

		console.log('use host', host);

		const abortController = new AbortController();
		setTimeout(() => {
			abortController.abort(new Error('Timeout'));
		}, 5000);

		for (let retry = 0; retry < 8; retry++) {
			if (abortController.signal.aborted)
				throw (
					abortController.signal.reason ??
					new Error('Aborted with unknown reason')
				);

			const response = await this.fetch(`${host}/translate`, {
				signal: abortController.signal,
				responseType: 'json',
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					...this.options.headers,
				},
				// eslint-disable-next-line camelcase
				body: JSON.stringify({ text, source_lang: from, target_lang: to }),
			});

			// Try another host if not provided host. If provided, we must sent requests only there
			if (!response.ok && !this.apiHost) continue;

			const data = response.data.data;
			if (typeof data !== 'string') throw new Error('Bad response');

			return data;
		}

		throw new Error('Out of retries');
	}

	public async translateBatch(texts: string[], from: langCodeWithAuto, to: langCode) {
		return Promise.all(texts.map((text) => this.translate(text, from, to)));
	}
}
