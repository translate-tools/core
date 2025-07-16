export type FetcherRequestType = 'text' | 'json' | 'arrayBuffer';
export type FetcherResponseDataByTypeMap = {
	text: string;
	json: any;
	arrayBuffer: ArrayBuffer;
};

export type FetcherOptions<T extends FetcherRequestType> = {
	method?: string;
	responseType: T;
	headers?: Record<string, string>;
	body?: string | Blob | BufferSource | null;

	/** A string whose value is a same-origin URL, "about:client", or the empty string, to set request's referrer. */
	referrer?: string;

	/** An AbortSignal to set request's signal. */
	signal?: AbortSignal | null;
};

export interface FetcherResponse<D = any> {
	readonly headers: Map<string, string>;
	readonly ok: boolean;
	readonly status: number;
	readonly statusText: string;
	readonly data: D;
}

export type Fetcher = <T extends FetcherRequestType>(
	url: string,
	options: FetcherOptions<T>,
) => Promise<FetcherResponse<FetcherResponseDataByTypeMap[T]>>;
