import { Scheduler } from '../Scheduler';
import { FakeTranslator } from '../../translators/FakeTranslator';

const wait = (time: number) => new Promise((res) => setTimeout(res, time));

const from = 'en';
const to = 'de';

test('test Scheduler', async () => {
	const translator = new FakeTranslator();
	const scheduler = new Scheduler(translator);

	const textSample = 'Hello world';
	const textsForTest = Array(100)
		.fill(textSample)
		.map((val, idx) => `${val} #${idx}`);

	await Promise.all(
		textsForTest.map((text) => scheduler.translate(text, from, to)),
	).then((translations) =>
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
	);
});

test('test Scheduler queue priority', async () => {
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
	);

	expectedResults.forEach((expectedText, idx) => {
		expect(results[idx]).toBe(expectedText);
	});
});

describe('translation abortion', () => {
	test('abortion rejects all pending tasks with specified context', async () => {
		const translator = new FakeTranslator({ delay: 1 });
		const scheduler = new Scheduler(translator);

		const from = 'en';
		const to = 'de';

		const requests1 = Array(100)
			.fill(null)
			.map((_, index) =>
				scheduler.translate(`Text for translation #${index}`, from, to, {
					context: 'test1',
				}),
			);
		const requests2 = Array(100)
			.fill(null)
			.map((_, index) =>
				scheduler.translate(`Another text for translation #${index}`, from, to, {
					context: 'test2',
				}),
			);

		// Abortion rejects only tasks with specified context
		await scheduler.abort('test1');
		await expect(Promise.allSettled(requests1)).resolves.toEqual(
			requests1.map(() => ({
				status: 'rejected',
				reason: expect.objectContaining({
					message: expect.stringMatching('Translation is aborted in scheduler'),
				}),
			})),
		);

		// Tasks with another context is ignored and will be translated well
		await expect(Promise.allSettled(requests2)).resolves.toEqual(
			requests2.map(() => ({
				status: 'fulfilled',
				value: expect.stringContaining('Another text for translation'),
			})),
		);
	});

	test('abortion is prevents retries', async () => {
		const translator = new FakeTranslator();
		const spyOnTranslateBatch = vi.spyOn(translator, 'translateBatch');
		spyOnTranslateBatch.mockImplementation(async () => {
			await wait(200);
			throw new Error('Translation error emulation');
		});

		const scheduler = new Scheduler(translator, {
			translatePoolDelay: 50,
			translateRetryAttemptLimit: 5,
		});

		// Collect translation requests
		const requests = Array(3)
			.fill(null)
			.map((_, index) =>
				scheduler.translate(`Text for translation #${index}`, 'en', 'de', {
					context: 'test',
				}),
			);

		// Wait a pool filled and translation method is called
		await wait(80);

		// Abort requests
		await scheduler.abort('test');

		// Abortion immediately rejects a failed in-flight requests with no retries,
		// even if task have more attempts
		await expect(Promise.allSettled(requests)).resolves.toEqual(
			requests.map(() => ({
				status: 'rejected',
				reason: expect.objectContaining({
					message: expect.stringMatching('Translation error emulation'),
				}),
			})),
		);

		// Translation method must be called only once,
		// then throw error and task will immediately fail with no retries
		expect(spyOnTranslateBatch).toBeCalledTimes(1);
	});
});
