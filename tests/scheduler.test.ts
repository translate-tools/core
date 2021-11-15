import { Scheduler } from '../src/util/Scheduler';
import { FakeTranslator } from '../src/translators/FakeTranslator';

const text = 'Hello world';
const from = 'en';
const to = 'de';

const expectation = `*[${from}-${to}]${text}`;

test('test `FakeTranslator`', (done) => {
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

test('test `Scheduler`', (done) => {
	const translator = new FakeTranslator();
	const scheduler = new Scheduler(translator);
	scheduler
		.translate(text, from, to)
		.then((translation) => {
			expect(typeof translation).toBe('string');
			expect(translation).toBe(expectation);

			done();
		})
		.catch(done);
});
