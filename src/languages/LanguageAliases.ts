export const createLanguageAliasesMap = (languages: string[]) => {
	const complexLanguages = languages.filter((language) => language.includes('-'));

	// Build languages map
	const languagesMap: Record<string, string[]> = {};
	for (const language of complexLanguages) {
		const simpleLanguage = language.split('-')[0];

		if (!(simpleLanguage in languagesMap)) {
			languagesMap[simpleLanguage] = [language];
			continue;
		}

		languagesMap[simpleLanguage].push(language);
	}

	return languagesMap;
};

export class LanguageAliases {
	private readonly simpleLanguages;
	private readonly languagesMaps;
	constructor(private readonly languagesList: string[]) {
		// Build map
		const languagesMap = createLanguageAliasesMap(languagesList);
		this.languagesMaps = {
			normal: languagesMap,
			reverse: Object.fromEntries(
				Object.entries(languagesMap)
					.map(([simpleLanguage, aliases]) =>
						aliases.map((alias) => [alias, simpleLanguage]),
					)
					.flat(),
			) as Record<string, string[]>,
		};

		this.simpleLanguages = new Set(languagesList);
	}

	public getAll() {
		return Array.from(
			new Set([...this.languagesList, ...Object.keys(this.languagesMaps.normal)]),
		);
	}

	public get(language: string) {
		// Return mapped language
		const languageAliases = this.languagesMaps.normal[language];
		// Check if key is exists
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (languageAliases) return languageAliases[0];

		// Return language in list
		if (this.simpleLanguages.has(language)) return language;

		return null;
	}
}
