const mp3Parser = require('mp3-parser');

import { langCodes } from '../util/languages';
import { GoogleTTS } from './GoogleTTS';
import { LingvaTTS } from './LingvaTTS';

([GoogleTTS, LingvaTTS] as const).map((translatorClass) => {
	describe(`methods of TTS class "${translatorClass.name}"`, () => {
		test(`getAudioBuffer returns audio buffer`, async () => {
			const tts = new translatorClass();
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

		test(`getSupportedLanguages returns array of supported languages`, async () => {
			const supportedLanguages = translatorClass.getSupportedLanguages();

			// Languages array are not empty
			expect(Array.isArray(supportedLanguages)).toBeTruthy();
			expect(supportedLanguages.length).not.toEqual(0);
			expect(supportedLanguages.length > 0).toBeTruthy();

			// All language coded are correct
			supportedLanguages.forEach((lang) => {
				expect((langCodes as readonly string[]).includes(lang));
			});
		});
	});
});
