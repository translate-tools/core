import { parseXMLResponse, visitArrayItems } from './utils';

describe('parseXMLResponse', () => {
	test('Single string is returned as is', () => {
		expect(
			parseXMLResponse('<pre><a i="0">Demo -Text zur Übersetzung</a></pre>'),
		).toBe('Demo -Text zur Übersetzung');
	});

	test('Few elements is joined with space', () => {
		expect(
			parseXMLResponse(
				'<pre><a i="0">single text</a><a i="1">another text</a></pre>',
			),
		).toBe('single text another text');
	});
});

describe('visitArrayItems', () => {
	test('Flat array', () => {
		const callback = vi.fn();
		visitArrayItems(['foo', 'bar', 'baz', 'qux'], callback);

		expect(callback.mock.calls).toStrictEqual([['foo'], ['bar'], ['baz'], ['qux']]);
	});

	test('Nested arrays', () => {
		const callback = vi.fn();
		visitArrayItems([['foo', 'bar'], 'baz', ['qux']], callback);

		expect(callback.mock.calls).toStrictEqual([['foo'], ['bar'], ['baz'], ['qux']]);
	});
});
