import {
	TranslatorInstance,
	Translator,
	langCode,
	langCodeWithAuto,
} from '../types/Translator';

/**
 * Fake translator for use in tests and debug
 */
export class FakeTranslator extends Translator implements TranslatorInstance {
	delay?: number | 'random';

	constructor(delay?: number | 'random') {
		super();
		this.delay = delay;
	}

	isSupportedAutoFrom() {
		return false;
	}

	getSupportedLanguages(): langCode[] {
		return ['ru', 'en', 'de', 'ja'];
	}

	getLengthLimit() {
		return 3000;
	}

	getRequestsTimeout() {
		return 10;
	}

	checkDirection(from: langCodeWithAuto, to: langCode) {
		return from == 'ru' && to == 'ja' ? false : true;
	}

	translate(text: string, from: langCodeWithAuto, to: langCode) {
		const delay =
			this.delay === undefined
				? 0
				: this.delay === 'random'
					? Math.floor(Math.random() * 1000)
					: this.delay;
		return new Promise<string>((resolve) => {
			setTimeout(() => resolve(`*[${from}-${to}]` + text), delay);
		});
	}

	translateBatch(text: string[], from: langCodeWithAuto, to: langCode) {
		return Promise.all(
			text.map((i) => this.translate(i, from, to).catch(() => null)),
		);
	}
}

/**
 * Fake translator which always throw error for use in tests and debug
 */
export class ErrorFakeTranslator extends FakeTranslator {
	async translate(
		_text: string,
		_from: langCodeWithAuto,
		_to: langCode,
	): Promise<string> {
		throw new Error('Fake error for translate method');
	}

	async translateBatch(
		_text: string[],
		_from: langCodeWithAuto,
		_to: langCode,
	): Promise<string[]> {
		throw new Error('Fake error for translateBatch method');
	}
}
