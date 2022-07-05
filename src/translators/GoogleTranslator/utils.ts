export function deepExploreArray(obj: unknown, depth: number) {
	let currentDepth = 0;
	let currentObj = obj;
	while (depth > currentDepth) {
		if (!Array.isArray(currentObj)) {
			throw new TypeError('Error while explore array on depth #' + currentDepth);
		}

		currentObj = currentObj[0];
		currentDepth++;
	}

	return currentObj;
}

/**
 * Visit each item in array recursively
 */
export const visitArrayItems = (arr: any[], visitor: (obj: unknown) => void) => {
	arr.forEach((obj) => {
		if (Array.isArray(obj)) {
			visitArrayItems(obj, visitor);
		} else {
			visitor(obj);
		}
	});
};
