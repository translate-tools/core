import { FakeTranslator } from '../FakeTranslator';

describe('FakeTranslator', () => {
	test('method `translate` for single text', async () => {
		const from = 'en';
		const to = 'de';

		const text = 'Hello world';
		const expectation = `*[${from}-${to}]${text}`;

		const translator = new FakeTranslator();
		await translator.translate(text, from, to).then((translation) => {
			expect(translation).toBe(expectation);
		});
	});

	test('method `translateBatch` for multiple texts', async () => {
		const from = 'en';
		const to = 'de';

		const text1 = 'Hello world';
		const expectation1 = `*[${from}-${to}]${text1}`;

		const text2 = 'My name is Jeff';
		const expectation2 = `*[${from}-${to}]${text2}`;

		const translator = new FakeTranslator();
		await translator.translateBatch([text1, text2], from, to).then((translation) => {
			expect(translation).toEqual([expectation1, expectation2]);
		});
	});
});
