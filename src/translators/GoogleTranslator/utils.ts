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
