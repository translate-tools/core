/* eslint-disable camelcase */
import { BaseTranslator } from '../BaseTranslator';
import { langCode, langCodeWithAuto } from '../Translator';
import { getLanguagesMap } from './constants';
import {
	pipeline,
	ProgressInfo,
	TranslationOutput,
	TranslationPipeline,
} from '@huggingface/transformers';
import { DeviceType } from '@huggingface/transformers/types/utils/devices';
import { DataType } from '@huggingface/transformers/types/utils/dtypes';

export type TransformersTranslatorInstanceConfig = {
	model: string;
	device: DeviceType;
	dtype?: DataType;
	onProgress?: (info: ProgressInfo) => void;
};

export class TransformersTranslator extends BaseTranslator {
	constructor(private readonly config: Partial<TransformersTranslatorInstanceConfig>) {
		super();
	}

	private pipeline: Promise<TranslationPipeline> | null = null;
	private async getPipeline() {
		const {
			model = 'Xenova/nllb-200-distilled-600M',
			device,
			dtype,
			onProgress,
		} = this.config;

		// Init
		if (!this.pipeline) {
			// @ts-ignore
			this.pipeline = pipeline('translation', model, {
				// eslint-disable-next-line camelcase
				progress_callback: onProgress,
				dtype,
				device,
			});
		}

		return this.pipeline;
	}

	public getLengthLimit(): number {
		return 5000;
	}
	public getRequestsTimeout(): number {
		return 0;
	}

	public async translate(
		text: string,
		sourceLanguage: langCodeWithAuto,
		targetLanguage: langCode,
	): Promise<string> {
		const pipeline = await this.getPipeline();

		const languagesMap = getLanguagesMap();

		const result = (await pipeline(text, {
			// @ts-ignore
			tgt_lang: languagesMap[targetLanguage],
			src_lang: languagesMap[sourceLanguage],
		})) as TranslationOutput;

		if (!Array.isArray(result))
			throw new TypeError('Unexpected type returned by translation pipeline');
		if (result.length !== 1)
			throw new RangeError(
				'Translated text length does not match source texts length',
			);

		return result.map((result) => result.translation_text).join(' ');
	}

	public async translateBatch(
		texts: string[],
		sourceLanguage: langCodeWithAuto,
		targetLanguage: langCode,
	) {
		return Promise.all(
			texts.map((text) => this.translate(text, sourceLanguage, targetLanguage)),
		);
	}

	static getSupportedLanguages = (): langCode[] => {
		return Object.keys(getLanguagesMap());
	};
}
