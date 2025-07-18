import xpath from 'xpath';
import { Document, DOMParser, MIME_TYPE } from '@xmldom/xmldom';

export const encodeForBatch = (textList: string[]) => {
	return textList.map((text, i) => `<pre><a i="${i}">${text}</a></pre>`);
};

export const parseXMLResponse = (text: string) => {
	let doc: Document;
	try {
		doc = new DOMParser().parseFromString(text, MIME_TYPE.XML_APPLICATION);
	} catch (err) {
		console.error(err);
		return null;
	}

	const nodesWithTranslation = xpath.select(
		'//pre/*[not(self::i)]',
		doc as unknown as Node,
	);

	if (!nodesWithTranslation) return null;

	if (!Array.isArray(nodesWithTranslation))
		throw new Error('Unexpected XML parsed result');

	return nodesWithTranslation
		.map((node) => {
			// Select text in child nodes or in self
			const textNodes = xpath.select('descendant-or-self::*/text()', node);
			if (!Array.isArray(textNodes)) return '';

			if (textNodes.length > 1) {
				console.debug('More than one text node found');
			}

			return textNodes.length === 0
				? ''
				: textNodes.map((node) => node.nodeValue).join(' ');
		})
		.join(' ');
};

export function deepExploreArray(obj: unknown, depth: number) {
	let currentDepth = 0;
	let currentObj = obj;
	while (depth > currentDepth) {
		if (!Array.isArray(currentObj)) {
			throw new TypeError(
				'Error while explore array on depth #' + String(currentDepth),
			);
		}

		currentObj = currentObj[0];
		currentDepth++;
	}

	return currentObj;
}

/**
 * Visit each item in array recursively
 */
export const visitArrayItems = (arr: unknown[], visitor: (obj: unknown) => void) => {
	arr.forEach((obj) => {
		if (Array.isArray(obj)) {
			visitArrayItems(obj, visitor);
		} else {
			visitor(obj);
		}
	});
};
