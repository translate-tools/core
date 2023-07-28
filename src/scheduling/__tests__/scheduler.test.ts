import { Scheduler } from '../Scheduler';
import { FakeTranslator } from '../../translators/FakeTranslator';

const from = 'en';
const to = 'de';

test('test Scheduler', (done) => {
	const translator = new FakeTranslator();
	const scheduler = new Scheduler(translator);

	const textSample = 'Hello world';
	const textsForTest = Array(100)
		.fill(textSample)
		.map((val, idx) => `${val} #${idx}`);

	Promise.all(textsForTest.map((text) => scheduler.translate(text, from, to)))
		.then((translations) =>
			Promise.all(
				translations.map(async (translation, idx) => {
					const expectedText = await translator.translate(
						`${textSample} #${idx}`,
						from,
						to,
					);
					expect(translation).toBe(expectedText);
				}),
			),
		)
		.finally(done)
		.catch(done);
});

test('test Scheduler queue priority', (done) => {
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
