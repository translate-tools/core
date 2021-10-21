import { GoogleTranslator } from '../src/translators/GoogleTranslator';

test('hello world test', (done) => {
	const translator = new GoogleTranslator();
	translator
		.translate('hello world', 'en', 'ru')
		.then((translation) => {
			expect(translation).toContain('мир');
			done();
		})
		.catch(done);
});
