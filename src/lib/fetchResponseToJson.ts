/**
 * Try to parse JSON and if it invalid JSON, throw error about invalid data
 *
 * It more clearly than "Unexpected end of input"
 */
export const fetchResponseToJson = async (response: Response) => {
	const text = await response.text();

	try {
		return JSON.parse(text);
	} catch (error) {
		console.error('Data for exception below', text);
		if (error instanceof SyntaxError) {
			throw new Error('Unexpected response');
		} else {
			throw error;
		}
	}
};
