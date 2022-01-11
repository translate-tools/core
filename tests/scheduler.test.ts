import { Scheduler } from '../src/util/Scheduler';
import { FakeTranslator } from '../src/translators/FakeTranslator';

const from = 'en';
const to = 'de';

const constructExpectation = (text: string) => `*[${from}-${to}]${text}`;

test('test `FakeTranslator`', (done) => {
	const text = 'Hello world';
	const expectation = constructExpectation(text);

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

// TODO: add test for queue priority
test('test `Scheduler`', (done) => {
	const translator = new FakeTranslator();
	const scheduler = new Scheduler(translator);

	const text = 'Hello world';
	const textsList = Array(100)
		.fill(text)
		.map((val, idx) => `${val} #${idx}`);
	Promise.all(textsList.map((text) => scheduler.translate(text, from, to)))
		.then((translations) => {
			translations.forEach((translation, idx) => {
				expect(typeof translation).toBe('string');

				const expectation = constructExpectation(`${text} #${idx}`);
				expect(translation).toBe(expectation);
			});

			done();
		})
		.catch(done);
});
