import 'isomorphic-fetch';
import { Fetcher, FetcherOptions, FetcherRequestType } from '.';

export const convertHeadersToMap = (headers: Headers) => {
	const map = new Map<string, string>();
	headers.forEach((key, value) => {
		map.set(key, value);
	});

	return map;
};

export const basicFetcher: Fetcher = async <T extends FetcherRequestType>(
	url: string,
	{ responseType, ...options }: FetcherOptions<T>,
) => {
	return fetch(url, options).then(async (response) => {
		const data = await response[
			responseType as Exclude<FetcherRequestType, 'stream'>
		]();

		const { ok, status, statusText } = response;
		return {
			headers: convertHeadersToMap(response.headers),
			ok,
			status,
			statusText,
			data,
		};
	});
};
