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
