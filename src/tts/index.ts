/**
 * Object with audio data
 */
export type TTSAudioBuffer = {
	/**
	 * Audio mimetype
	 */
	type: string;
	/**
	 * Buffer contains audio bytes
	 */
	buffer: ArrayBuffer;
};

/**
 * TTS instance members
 */
export interface TTSProviderProps {
	/**
	 * Get blob with audio
	 * @param text text to speak
	 * @param language text language
	 * @param options optional map with preferences to generate audio
	 */
	getAudioBuffer(
		text: string,
		language: string,
		options?: Record<string, string>,
	): Promise<TTSAudioBuffer>;
}

/**
 * TTS constructor members
 */
export interface TTSProviderStaticProps {
	getSupportedLanguages(): string[];
}

/**
 * Text to speech module
 */
export type TTSProvider = TTSProviderStaticProps & {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	new (...args: any[]): TTSProviderProps;
};
