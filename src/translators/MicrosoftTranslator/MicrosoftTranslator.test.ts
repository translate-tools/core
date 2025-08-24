import { MicrosoftTranslator } from '.';

const originalFetch = globalThis.fetch;
const fetchMock = vi.fn(originalFetch);

globalThis.fetch = fetchMock;

beforeEach(() => {
	fetchMock.mockClear();
});

test('Access token must be requested only once for multiple translation calls', async () => {
	const translator = new MicrosoftTranslator();

	await expect(
		Promise.all([
			translator.translate('Hello world', 'en', 'ja'),
			translator.translate('Hello world', 'en', 'ja'),
			translator.translate('Hello world', 'en', 'ja'),
		]),
	).resolves.not.toThrow();

	expect(fetchMock.mock.calls).toEqual([
		['https://edge.microsoft.com/translate/auth', expect.any(Object)],

		[
			expect.stringMatching(
				'https://api-edge.cognitive.microsofttranslator.com/translate?',
			),
			expect.any(Object),
		],
		[
			expect.stringMatching(
				'https://api-edge.cognitive.microsofttranslator.com/translate?',
			),
			expect.any(Object),
		],
		[
			expect.stringMatching(
				'https://api-edge.cognitive.microsofttranslator.com/translate?',
			),
			expect.any(Object),
		],
	]);
});

describe('Access token must be reused during its lifetime', () => {
	const translator = new MicrosoftTranslator({ tokenLifetime: 100_000 });
	vi.setSystemTime(100_000);

	test('First translation call must requests a token', async () => {
		await expect(
			translator.translate('Hello world', 'en', 'ja'),
		).resolves.not.toThrow();
		expect(fetchMock.mock.calls).toEqual([
			['https://edge.microsoft.com/translate/auth', expect.any(Object)],
			[
				expect.stringMatching(
					'https://api-edge.cognitive.microsofttranslator.com/translate?',
				),
				expect.any(Object),
			],
		]);
	});

	test('Next translation calls must not to request a token when lifetime is not expired', async () => {
		vi.setSystemTime(190_000);
		await expect(
			translator.translate('Hello world', 'en', 'ja'),
		).resolves.not.toThrow();
		expect(fetchMock.mock.calls).toEqual([
			[
				expect.stringMatching(
					'https://api-edge.cognitive.microsofttranslator.com/translate?',
				),
				expect.any(Object),
			],
		]);
		await expect(
			translator.translate('Hello world', 'en', 'ja'),
		).resolves.not.toThrow();
		expect(fetchMock.mock.calls).toEqual([
			[
				expect.stringMatching(
					'https://api-edge.cognitive.microsofttranslator.com/translate?',
				),
				expect.any(Object),
			],
			[
				expect.stringMatching(
					'https://api-edge.cognitive.microsofttranslator.com/translate?',
				),
				expect.any(Object),
			],
		]);
	});

	test('When token lifetime is expired, new token must be requested by a translation method call', async () => {
		vi.setSystemTime(200_001);

		await expect(
			translator.translate('Hello world', 'en', 'ja'),
		).resolves.not.toThrow();
		expect(fetchMock.mock.calls).toEqual([
			['https://edge.microsoft.com/translate/auth', expect.any(Object)],
			[
				expect.stringMatching(
					'https://api-edge.cognitive.microsofttranslator.com/translate?',
				),
				expect.any(Object),
			],
		]);
	});
});

describe('Requests must be retried for network errors', () => {
	const translator = new MicrosoftTranslator({ tokenLifetime: 100_000 });

	describe('Method "translate" will throw error if any problems with token fetching', () => {
		test('Network errors for token fetching', async () => {
			fetchMock.mockReturnValueOnce(
				Promise.reject(new Error('Network error emulation')),
			);

			await expect(translator.translate('Hello world', 'en', 'ja')).rejects.toThrow(
				'Network error emulation',
			);

			expect(fetchMock.mock.calls).toEqual([
				['https://edge.microsoft.com/translate/auth', expect.any(Object)],
			]);
		});

		test('Invalid response for token fetching', async () => {
			fetchMock.mockReturnValueOnce(
				Promise.resolve(
					new Response('Invalid response', {
						status: 404,
					}),
				),
			);

			await expect(translator.translate('Hello world', 'en', 'ja')).rejects.toThrow(
				'Unknown error with status 404',
			);

			expect(fetchMock.mock.calls).toEqual([
				['https://edge.microsoft.com/translate/auth', expect.any(Object)],
			]);
		});

		test('Server errors for token fetching', async () => {
			fetchMock.mockReturnValueOnce(
				Promise.resolve(
					new Response('Invalid response', {
						status: 500,
						statusText: 'Server error',
					}),
				),
			);

			await expect(translator.translate('Hello world', 'en', 'ja')).rejects.toThrow(
				'Server error',
			);

			expect(fetchMock.mock.calls).toEqual([
				['https://edge.microsoft.com/translate/auth', expect.any(Object)],
			]);
		});
	});

	test('Method "translate" will fetch token after network errors', async () => {
		await expect(
			translator.translate('Hello world', 'en', 'ja'),
		).resolves.not.toThrow();
		expect(fetchMock.mock.calls).toEqual([
			['https://edge.microsoft.com/translate/auth', expect.any(Object)],
			[
				expect.stringMatching(
					'https://api-edge.cognitive.microsofttranslator.com/translate?',
				),
				expect.any(Object),
			],
		]);
	});
});
