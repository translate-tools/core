import { TranslatorConstructor, TranslatorInstanceMembers } from './Translator';

export type TranslatorInstance = {
	languages: Set<string>;
	languageDetection: boolean;
	translator: TranslatorInstanceMembers;
};

type FallbackTranslatorOptions = {
	onTranslatorError?: (error: unknown, translator: TranslatorInstanceMembers) => void;
};

export function createFallbackTranslator(
	translators: TranslatorInstance[],
): TranslatorConstructor<TranslatorInstanceMembers, [FallbackTranslatorOptions] | []> {
	if (translators.length === 0) throw new Error('No translators provided');

	const supportedLanguages = new Set<string>();
	let isSupportedAutoFrom = false;
	for (const translator of translators) {
		if (translator.languageDetection) isSupportedAutoFrom = true;
		translator.languages.forEach((language) => supportedLanguages.add(language));
	}

	return class FallbackTranslator implements TranslatorInstanceMembers {
		public static readonly translatorName: string = 'FallbackTranslator';

		public static isRequiredKey = () => false;

		public static isSupportedAutoFrom = () => isSupportedAutoFrom;

		// eslint-disable-next-line class-methods-use-this
		public checkDirection(sourceLanguage: string, targetLanguage: string) {
			return translators.some(({ languages, languageDetection, translator }) => {
				if (!languages.has(targetLanguage)) return false;

				if (sourceLanguage === 'auto') {
					if (!languageDetection) return false;
				} else if (!languages.has(sourceLanguage)) return false;

				if (translator.checkDirection)
					return translator.checkDirection(sourceLanguage, targetLanguage);
				return true;
			});
		}

		public static getSupportedLanguages = (): string[] =>
			Array.from(supportedLanguages);

		public getLengthLimit() {
			return translators[
				this.#currentTranslatorIndex ?? 0
			].translator.getLengthLimit();
		}

		public getRequestsTimeout() {
			return translators[
				this.#currentTranslatorIndex ?? 0
			].translator.getRequestsTimeout();
		}

		#currentTranslatorIndex;
		constructor(private readonly options: FallbackTranslatorOptions = {}) {
			this.#currentTranslatorIndex = translators.length > 0 ? 0 : null;
		}

		public async translate(
			text: string,
			sourceLanguage: string,
			targetLanguage: string,
		) {
			const result = await this.translateBatch(
				[text],
				sourceLanguage,
				targetLanguage,
			);

			const translation = result[0];
			if (typeof translation !== 'string')
				throw new TypeError('Result of batch translation is not a string');

			return translation;
		}

		public async translateBatch(
			text: string[],
			sourceLanguage: string,
			targetLanguage: string,
		) {
			if (translators.length === 0) throw new Error('Translators list is empty');

			const startIndex = this.#currentTranslatorIndex ?? 0;
			for (let attempt = 0; ; attempt++) {
				const currentIndex = (startIndex + attempt) % translators.length;
				if (attempt > 0 && currentIndex === startIndex)
					throw new Error('All translators does not work');

				const translatorInfo = translators[currentIndex];

				// Skip translator for unsupported parameters
				if (sourceLanguage === 'auto' && !translatorInfo.languageDetection)
					continue;
				if (
					sourceLanguage !== 'auto' &&
					!translatorInfo.languages.has(sourceLanguage)
				)
					continue;
				if (!translatorInfo.languages.has(targetLanguage)) continue;
				if (
					translatorInfo.translator.checkDirection &&
					!translatorInfo.translator.checkDirection(
						sourceLanguage,
						targetLanguage,
					)
				)
					continue;

				// Ensure safety in runtime
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				if (!translatorInfo)
					throw new RangeError(
						`Translator with index ${currentIndex} is not found. Translators array size is ${translators.length}`,
					);

				const { translator } = translatorInfo;
				try {
					const result = await translator.translateBatch(
						text,
						sourceLanguage,
						targetLanguage,
					);

					// Remember index of translator that does work
					if (startIndex !== currentIndex) {
						// Update only in case the global state has not been changed yet
						if (startIndex === this.#currentTranslatorIndex)
							this.#currentTranslatorIndex = currentIndex;
					}

					return result;
				} catch (error) {
					// Report error
					if (this.options.onTranslatorError)
						this.options.onTranslatorError(error, translator);

					continue;
				}
			}
		}

		// TODO: update interface to require language parameters, for precious score
		public checkLimitExceeding(text: string | string[]) {
			const plainText = Array.isArray(text) ? text.join('') : text;
			const extra = plainText.length - this.getLengthLimit();
			return extra > 0 ? extra : 0;
		}
	};
}
