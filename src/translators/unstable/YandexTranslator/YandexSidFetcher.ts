// Source: https://github.com/FilipePS/Traduzir-paginas-web/blob/f3a4956a1aa96b7a9124864158a5200827694521/background/translationService.js

import { Fetcher } from '../../../utils/fetcher/types';

export class YandexSidFetcher {
	constructor(private readonly fetcher: Fetcher) {}

	private sid: string | null = null;
	private sidTime: number | null = null;
	private pendingRequest: Promise<string | null> | null = null;

	/**
	 * Get SID with reuse from cache
	 */
	public async get() {
		if (!this.pendingRequest) {
			this.pendingRequest = Promise.resolve()
				.then(async () => {
					// 3 hours
					const lifeTime = 3 * 60 * 60 * 1000;

					// Reset state and fetch new SID
					if (
						!this.sid ||
						!this.sidTime ||
						Date.now() - this.sidTime > lifeTime
					) {
						this.sid = null;
						this.sidTime = null;

						const sid = await this.fetch();

						// Update data
						this.sid = sid;
						this.sidTime = Date.now();

						return sid;
					}

					return this.sid;
				})
				.catch((error: unknown) => {
					// Reset state
					this.reset();

					throw error;
				})
				.finally(() => {
					this.pendingRequest = null;
				});
		}

		return this.pendingRequest;
	}

	/**
	 * Reset the state and fetch new SID next time
	 */
	public reset() {
		this.sid = null;
		this.sidTime = null;
		this.pendingRequest = null;
	}

	/**
	 * Get new SID with no caching
	 */
	public fetch = async (retryLimit = 100) => {
		const url =
			'https://translate.yandex.net/website-widget/v1/widget.js?widgetId=ytWidget&pageLang=es&widgetTheme=light&autoMode=false';

		// Retry fetch until success
		for (let attempt = 0; attempt < retryLimit; attempt++) {
			try {
				const sid = await this.fetcher(url, { responseType: 'text' }).then(
					(response) => {
						const result = /sid:\s'[0-9a-f.]+/.exec(
							typeof response.data === 'string' ? response.data : '',
						);

						return result?.[0] && result[0].length > 7
							? result[0].substring(6)
							: null;
					},
				);

				if (sid) return sid;
			} catch (error) {
				console.error(error);
			}

			await new Promise((resolve) => setTimeout(resolve, 100));
		}

		return null;
	};
}
