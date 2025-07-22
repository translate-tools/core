/**
 * This code taken from https://github.com/zlargon/google-tts/blob/42bae63cf406c3cf20521e0cf36cbc5d9b9dce31/test/split-long-text.test.js
 * This code is under MIT license (2016 Leon Huang)
 */

import { splitLongText } from './splitLongText';

const longArticle = `The Industrial Revolution had several roots, one of which was a commercial revolution that, beginning as far back as the sixteenth century, accompanied Europe’s expansion overseas.
Both exports and imports showed spectacular growth, particularly in England and France.
An increasingly larger portion of the stepped-up commercial activity was the result of trade with overseas colonies.
Imports included a variety of new beverages, spices, and ship’s goods around the world and brought money flowing back.
Europe’s economic institutions, particularly those in England, were strong, had wealth available for new investment, and seemed almost to be waiting for some technological breakthrough that would expand their profit-making potential even more.

The breakthrough came in Great Britain, where several economic advantages created a climate especially favorable to the encouragement of new technology.
One was its geographic location at the crossroads of international trade.
Internally, Britain was endowed with easily navigable natural waterway, which helped its trade and communication with the world.
Beginning in the 1770’s, it enjoyed a boom in canal building, which helped make its domestic market more accessible.
Because water transportation was the cheapest means of carrying goods to market, canals reduced prices and thus increased consumer demand.
Great Britain also had rich deposits of coal that fed the factories springing up in industrial and consumer goods.

Another advantage was Britain’s large population of rural, agricultural wage earners,as well as cottage workers, who had the potential of being more mobile than peasants of some other countries.
Eventually they found their way to the cities or mining communities and provided the human power upon which the Industrial Revolution was built.
The British people were also consumers; the absence of internal tariffs, such as those that existed in France or Italy or between the German states, made Britain the largest free-trade area in Europe.
Britain’s relatively stable government also helped create an atmosphere conducive to industrial progress.

Great Britain’s better-developed banking and credit system also helped speed the industrial progress, as did the fact that it was the home of an impressive array of entrepreneurs and inventors.
Among them were a large number of nonconformists whose religious principles encouraged thrift and industry rather than luxurious living and who tended to pour their profits back into their business, thus providing the basis for continued expansion.

A precursor to the Industrial Revolution was a revolution in agricultural techniques.
Ideas about agricultural reform developed first in Holland, where as early as the mid-seventeenth century, such modern methods as crop rotation, heavy fertilization, and diversification were all in use.
Dutch peasant farmers were known throughout Europe for their agricultural innovations, but as British markets and opportunities grew, the English quickly learned from them.
As early as the seventeenth century the Dutch were helping them drain marshes and fens where, with the help of advanced techniques, they grew new crops.
By the mid-eighteenth century new agricultural methods as well as selective breeding of livestock had caught on throughout the country.

aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa

Much of the increased production was consumed by Great Britain’s burgeoning population.
At the same time, people were moving to the city, partly because of the enclosure movement; that is, the fencing of common fields and pastures in order to provide more compact, efficient privately held agricultural parcels that would produce more goods and greater profits.
In the sixteenth century enclosures were usually used for creating sheep pastures, but by the eighteenth century new farming techniques made it advantageous for large landowners to seek enclosures in order to improve agricultural production.
Between 1714 and 1820 over 6 million acres of English land were enclosed.
As a result, many small, independent farmers were forced to sell out simply because they could not compete.
Non-landholding peasants and cottage workers, who worked for wages and grazed cows or pigs on the village common, were also hurt when the common was no longer available.
It was such people who began to flock to the cities seeking employment and who found work in the factories that would transform the nation and, the world.

aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`;

const text200 =
	'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
	'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
	'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
	'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

describe('Split long text', () => {
	it('each the length of short text should shorter than 200', () => {
		const results = splitLongText(longArticle);
		for (const str of results) {
			expect(str.length <= 200).toBe(true);
		}
	});

	it('the single word with 200 length', () => {
		expect(splitLongText(text200)).toStrictEqual([text200]);
	});

	it('the single word is too long to split into short text', () => {
		expect(() => splitLongText(text200, { maxLength: 100 })).toThrow(
			'The word is too long to split into a short text:',
		);
	});

	it('split long chinese text into short text', () => {
		const longChineseText =
			'如果想想生物在死之后被完全摧毁的种种方式，能够这样频繁出现化石是一件很令人惊讶的事。食腐动物和细菌的' +
			'破坏、化学性腐烂、腐蚀以及其它地质因素都会非常不利于保存。不过，如果生物体碰巧具有矿化的骨骼并且死于' +
			'可以迅速被沉积物掩埋的地方，摆脱被完全摧毁的几率便会大大增加。海底通常就具有上述的两方面条件，这里生' +
			'活着很多带壳的无脊椎动物（没有脊椎的动物），不断累积的似雨的沉积颗粒会把它们掩埋起来。虽然多数的化石' +
			'是在海洋沉积岩中发现的';

		// no additional split punctuation
		expect(() => splitLongText(longChineseText)).toThrow(
			'The word is too long to split into a short text:',
		);

		// add additional split punctuation
		const results = splitLongText(longChineseText, { splitPunct: '，、。（）' });
		expect(results.length).toBe(2);
		expect(results[1]).toBe('虽然多数的化石是在海洋沉积岩中发现的');
	});
});
