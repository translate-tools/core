import { createLanguageAliasesMap, LanguageAliases } from './LanguageAliases';

const languages = ['foo', 'bar-A', 'bar-B', 'bar-C', 'baz-A', 'baz-B', 'qux'];

test('Language aliases map is a map where key is simple code and value is full code variants', () => {
	expect(createLanguageAliasesMap(languages)).toStrictEqual({
		bar: ['bar-A', 'bar-B', 'bar-C'],
		baz: ['baz-A', 'baz-B'],
	});
});

describe('Language codes mapping', () => {
	const map = new LanguageAliases(languages);

	test('Complex language codes is converted to a simple aliases', () => {
		expect(map.getAll()).toStrictEqual([
			'foo',
			'bar-A',
			'bar-B',
			'bar-C',
			'baz-A',
			'baz-B',
			'qux',
			'bar',
			'baz',
		]);
	});

	test('Simple language code stay simple', () => {
		expect(map.get('foo')).toBe('foo');
		expect(map.get('qux')).toBe('qux');
	});

	test('Alias of complex language code returns first complex variant', () => {
		expect(map.get('bar')).toBe('bar-A');
		expect(map.get('baz')).toBe('baz-A');
	});

	test('Complex language code stay complex', () => {
		expect(map.get('bar-A')).toBe('bar-A');
		expect(map.get('bar-B')).toBe('bar-B');

		expect(map.get('baz-A')).toBe('baz-A');
		expect(map.get('baz-B')).toBe('baz-B');
	});

	test('Languages out of list returns null', () => {
		expect(map.get('another')).toBe(null);
		expect(map.get('another-one')).toBe(null);
		expect(map.get('another one')).toBe(null);
		expect(map.get('bar-X')).toBe(null);
	});
});
