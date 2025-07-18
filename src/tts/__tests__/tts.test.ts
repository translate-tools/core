import { parseBuffer } from 'music-metadata';

import { isLanguageCodeISO639v1 } from '../../languages';

import { GoogleTTS } from '../GoogleTTS';
import { LingvaTTS } from '../LingvaTTS';
import { TTSProvider } from '..';

const ttsConstructor: TTSProvider[] = [GoogleTTS, LingvaTTS];

ttsConstructor.map((ttsConstructor) => {
	describe(`methods of TTS class "${ttsConstructor.name}"`, () => {
		test(`getAudioBuffer returns audio buffer`, async () => {
			const tts = new ttsConstructor();
			const audioBuffer = await tts.getAudioBuffer(
				'Hello world. This is a demo text from TTS module',
				'en',
			);

			expect(audioBuffer.buffer).toBeInstanceOf(ArrayBuffer);
			expect(typeof audioBuffer.type).toBe('string');

			// Parse as audio file
			const parsedAudioFrame = await parseBuffer(
				new Uint8Array(audioBuffer.buffer),
			);

			expect(parsedAudioFrame.format.bitrate).toBe(64000);
			expect(parsedAudioFrame.format.codec).toBe('MPEG 2 Layer 3');
			expect(parsedAudioFrame.format.container).toBe('MPEG');
			expect(parsedAudioFrame.format.duration).toBeGreaterThan(0);
			expect(parsedAudioFrame.format.hasAudio).toBe(true);
			expect(parsedAudioFrame.format.hasVideo).toBe(false);
			expect(parsedAudioFrame.format.sampleRate).toBe(24000);
			expect(parsedAudioFrame.format.numberOfSamples).toBeGreaterThan(100_000);
		});

		// Disable test, to allow TTS to return any lang codes they support
		// Users must filter lang codes on their side, to ensure valid ISO codes
		test.skip(`getSupportedLanguages returns array of supported languages`, async () => {
			const supportedLanguages = ttsConstructor.getSupportedLanguages();

			// Languages array are not empty
			expect(Array.isArray(supportedLanguages)).toBeTruthy();
			expect(supportedLanguages.length).not.toEqual(0);
			expect(supportedLanguages.length > 0).toBeTruthy();

			// All language coded are correct
			supportedLanguages.forEach((lang) => {
				expect(isLanguageCodeISO639v1(lang)).toBeTruthy();
			});
		});
	});
});
