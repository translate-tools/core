interface Options {
	tokenStart?: string;
	tokenEnd?: string;
	tokenClose?: string;
}

interface TextContainer {
	id: string;
	text: string;
}

const tokens = ['tokenStart', 'tokenEnd', 'tokenClose'] as const;

/**
 * Util for pack multiple requests to one
 *
 * It's just encode/decode all texts with custom separation options
 */
export class Multiplexor {
	private readonly options: Options = {
		tokenStart: '<',
		tokenEnd: '>',
		tokenClose: '/',
	};

	// private readonly token: Array<Array<string>> = [];
	constructor(options?: Options) {
		if (options !== undefined) {
			['tokenStart', 'tokenEnd', 'tokenClose'].forEach((key) => {
				const item = options[key as keyof Options];
				if (item !== undefined && item.search(/&|:/) !== -1) {
					throw new Error(`Option ${key} has disallow characters (& or :)`);
				}
			});

			for (const key in options) {
				this.options[key as keyof Options] = options[key as keyof Options];
			}
		}
	}

	public encode(data: TextContainer[]) {
		const {
			tokenStart: start = '',
			tokenEnd: end = '',
			tokenClose: close = '',
		} = this.options;

		return data
			.map(
				({ id, text }) =>
					start + id + end + this.escape(text) + start + close + id + end,
			)
			.join(' ');
	}

	public decode(text: string) {
		const {
			tokenStart: start = '',
			tokenEnd: end = '',
			tokenClose: close = '',
		} = this.options;

		const pattern = `${start}\\s*(\\d+)\\s*${end}([\\w\\W]+?)${start}\\s*${close}\\s*\\1\\s*${end}`;
		const matchSet = text.matchAll(new RegExp(pattern, 'gm'));

		const result = [];
		let match = matchSet.next();
		while (!match.done) {
			result.push({
				id: match.value[1],
				text: this.unescape(match.value[2]),
			});
			match = matchSet.next();
		}

		return result;
	}

	private escape(text: string) {
		return tokens.reduce((text, tokenName, index) => {
			const token = this.options[tokenName];

			if (!token) return text;

			return text.replace(
				new RegExp(this.escapeRegExp(token), 'g'),
				`&${index + 1}:`,
			);
		}, text);
	}

	private unescape(text: string) {
		return tokens.reduce((text, tokenName, index) => {
			const token = this.options[tokenName];

			if (!token) return text;

			return text.replace(new RegExp(`&${index + 1}:`, 'g'), token);
		}, text);
	}

	private escapeRegExp(text: string) {
		return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
	}
}
