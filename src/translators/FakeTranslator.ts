/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/require-await */
import { BaseTranslator } from './BaseTranslator';

/**
 * Fake translator for use in tests and debug
 */
export class FakeTranslator extends BaseTranslator<{
	delay?: number | 'random';
}> {
	public static readonly translatorName = 'FakeTranslator';

	public static isSupportedAutoFrom() {
		return false;
	}

	public static getSupportedLanguages(): string[] {
		return ['ru', 'en', 'de', 'ja'];
	}

	public getLengthLimit() {
		return 3000;
	}

	public getRequestsTimeout() {
		return 10;
	}

	public checkDirection(from: string, to: string) {
		return from == 'ru' && to == 'ja' ? false : true;
	}

	public translate(text: string, from: string, to: string) {
		const delay =
			this.options.delay === undefined
				? 0
				: this.options.delay === 'random'
					? Math.floor(Math.random() * 1000)
					: this.options.delay;
		return new Promise<string>((resolve) => {
			setTimeout(() => {
				resolve(`*[${from}-${to}]` + text);
			}, delay);
		});
	}

	public translateBatch(text: string[], from: string, to: string) {
		return Promise.all(
			text.map((i) => this.translate(i, from, to).catch(() => null)),
		);
	}
}

/**
 * Fake translator which always throw error for use in tests and debug
 */
export class ErrorFakeTranslator extends FakeTranslator {
	public static readonly translatorName = 'FakeTranslator';

	public async translate(_text: string, _from: string, _to: string): Promise<string> {
		throw new Error('Fake error for translate method');
	}

	public async translateBatch(
		_text: string[],
		_from: string,
		_to: string,
	): Promise<string[]> {
		throw new Error('Fake error for translateBatch method');
	}
}
