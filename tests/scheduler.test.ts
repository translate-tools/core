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

test('test scheduler queue priority', (done) => {
	const translator = new FakeTranslator();
	const scheduler = new Scheduler(translator, {
		// Add to stable results
		taskBatchHandleDelay: 10,
	});

	// Data set
	const tasksList = [
		{
			text: 'Priority -1',
			priority: -1,
		},
		{
			text: 'Priority 1',
			priority: 1,
		},
		{
			text: 'Priority 2',
			priority: 2,
		},
		{
			text: 'Priority 3',
			priority: 3,
		},
		{
			text: 'Most low priority',
			priority: -999,
		},
		{
			text: 'Most high priority',
			priority: 999,
		},
	];

	(async () => {
		const expectedResults = await Promise.all(
			tasksList
				.slice()
				.sort((a, b) => b.priority - a.priority)
				.map(({ text }) => translator.translate(text, from, to)),
		);

		const results: string[] = [];

		await Promise.all(
			tasksList.map(({ text, priority }) =>
				scheduler
					.translate(text, from, to, { priority })
					.then((translatedText) => results.push(translatedText)),
			),
		).catch(done);

		expectedResults.forEach((expectedText, idx) => {
			expect(results[idx]).toBe(expectedText);
		});
	})()
		.catch(done)
		.finally(done);
});
