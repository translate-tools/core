import { FakeTranslator } from '../src/translators/FakeTranslator';

// Test a test utilities

test('test FakeTranslator', (done) => {
	const from = 'en';
	const to = 'de';

	const text = 'Hello world';
	const expectation = `*[${from}-${to}]${text}`;

	const translator = new FakeTranslator();
	translator
		.translate(text, from, to)
		.then((translation) => {
			expect(typeof translation).toBe('string');
			expect(translation).toBe(expectation);

			done();
		})
		.catch(done);
});
