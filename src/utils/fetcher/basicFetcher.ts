import 'isomorphic-fetch';

import {
	Fetcher,
	FetcherOptions,
	FetcherRequestType,
	FetcherResponseDataByTypeMap,
} from './types';

export const convertHeadersToMap = (headers: Headers) => {
	const map = new Map<string, string>();
	headers.forEach((key, value) => {
		map.set(key, value);
	});

	return map;
};

/**
 * Basic implementation of API fetcher
 */
export const basicFetcher: Fetcher = async <T extends FetcherRequestType>(
	url: string,
	{ responseType, ...options }: FetcherOptions<T>,
) => {
	return fetch(url, options).then(async (response) => {
		const data = (await response[responseType]()) as FetcherResponseDataByTypeMap[T];

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
