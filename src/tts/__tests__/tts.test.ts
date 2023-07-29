const mp3Parser = require('mp3-parser');

import { TTSProvider } from '..';
import { isLanguageCodeISO639v1 } from '../../languages';
import { GoogleTTS } from '../GoogleTTS';
import { LingvaTTS } from '../LingvaTTS';

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
			const audioBufferView = new DataView(audioBuffer.buffer);
			const parsedAudioFrame = mp3Parser.readFrameHeader(audioBufferView);
			expect(parsedAudioFrame).toHaveProperty('mpegAudioVersion');
			expect(parsedAudioFrame).toHaveProperty('channelMode');
			expect(parsedAudioFrame).toHaveProperty('samplingRate');
			expect(parsedAudioFrame).toHaveProperty('bitrate');
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
