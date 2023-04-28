// Source: https://github.com/FilipePS/Traduzir-paginas-web/blob/f3a4956a1aa96b7a9124864158a5200827694521/background/translationService.js

import axios from 'axios';

let lastYandexRequestSIDTime: number | null = null;
let yandexTranslateSID: string | null = null;
let yandexSIDNotFound: boolean = false;

export function getYandexSID() {
	return new Promise<void>((resolve) => {
		let updateYandexSid = false;
		if (lastYandexRequestSIDTime) {
			const date = new Date();
			if (yandexTranslateSID) {
				date.setHours(date.getHours() - 12);
			} else if (yandexSIDNotFound) {
				date.setMinutes(date.getMinutes() - 30);
			} else {
				date.setMinutes(date.getMinutes() - 2);
			}
			if (date.getTime() > lastYandexRequestSIDTime) {
				updateYandexSid = true;
			}
		} else {
			updateYandexSid = true;
		}

		if (updateYandexSid) {
			lastYandexRequestSIDTime = Date.now();
			const url =
				'https://translate.yandex.net/website-widget/v1/widget.js?widgetId=ytWidget&pageLang=es&widgetTheme=light&autoMode=false';

			axios
				.get(url)
				.then((response) => {
					const result = (
						typeof response.data === 'string' ? response.data : ''
					).match(/sid\:\s\'[0-9a-f\.]+/);

					if (result && result[0] && result[0].length > 7) {
						yandexTranslateSID = result[0].substring(6);
						yandexSIDNotFound = false;
					} else {
						yandexSIDNotFound = true;
					}

					resolve();
				})
				.catch((error) => {
					console.error(error);
					resolve();
				});
		} else {
			resolve();
		}
	}).then(() => yandexTranslateSID);
}
