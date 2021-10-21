import { GoogleTranslator } from '../src/translators/GoogleTranslator';

// TODO: write tests for other translators

test('test `translate` method', (done) => {
	const translator = new GoogleTranslator();
	translator
		.translate('Hello world', 'en', 'ru')
		.then((translation) => {
			expect(typeof translation).toBe('string');
			expect(translation).toContain('мир');

			done();
		})
		.catch(done);
});

test('test `translateBatch` method', (done) => {
	const translator = new GoogleTranslator();
	translator
		.translateBatch(['Hello world', 'my name is Jeff'], 'en', 'ru')
		.then((translation) => {
			expect(Array.isArray(translation)).toBe(true);
			expect(translation.length).toBe(2);

			expect(translation[0]).toContain('мир');
			expect(translation[1]).toContain('Джефф');

			done();
		})
		.catch(done);
});
