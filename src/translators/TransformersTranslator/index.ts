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

const instances: Array<{
	pipeline: Promise<TranslationPipeline>;
	config: Partial<TransformersTranslatorInstanceConfig>;
}> = [];

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
			// Search for instances
			const instance = instances.find(
				({ config }) =>
					config.model === model &&
					config.device === device &&
					config.dtype === dtype,
			);

			if (instance) {
				console.log('Use instance from cache');
				this.pipeline = instance.pipeline;
			} else {
				// @ts-ignore
				this.pipeline = pipeline('translation', model, {
					// eslint-disable-next-line camelcase
					progress_callback: onProgress,
					dtype,
					device,
				});

				instances.push({
					pipeline: this.pipeline,
					config: {
						model,
						device,
						dtype,
					},
				});
			}
		}

		return this.pipeline;
	}

	public getLengthLimit(): number {
		return 8000;
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
			max_length: Math.round(text.length * 5),
			min_length: Math.round(text.length * 0.6),
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
