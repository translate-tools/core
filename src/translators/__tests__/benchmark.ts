import { FeatureExtractionPipeline, pipeline } from '@xenova/transformers';

import { TranslatorConstructor } from '../Translator';

function cosineSimilarity(a: number[], b: number[]): number {
	const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
	const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
	const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
	return dot / (normA * normB);
}

class SimilarityScore {
	private pipe: Promise<FeatureExtractionPipeline> | FeatureExtractionPipeline | null =
		null;
	private getPipe() {
		if (this.pipe) return this.pipe;

		this.pipe = pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2').catch(
			(error) => {
				this.pipe = null;
				throw error;
			},
		);
		return this.pipe;
	}

	public async getEmbedding(text: string): Promise<number[]> {
		const pipe = await this.getPipe();

		const output = await pipe(text, { pooling: 'mean', normalize: true });
		return Array.from(output.data) as number[];
	}

	public async score(text1: string, text2: string) {
		return cosineSimilarity(
			await this.getEmbedding(text1),
			await this.getEmbedding(text2),
		);
	}
}

export async function getTranslatorsScore(
	translators: TranslatorConstructor[],
	reference: {
		text: string;
		translation: string;
	},
) {
	const similarity = new SimilarityScore();

	const translatorsScore: Record<string, number> = {};
	for (const translator of translators) {
		console.log(`Score translator ${translator.translatorName}...`);

		const translatorInstance = new translator();
		const translation = await translatorInstance.translate(
			reference.text,
			'en',
			'ru',
		);

		const score = await similarity.score(reference.translation, translation);
		console.log(`Score is ${score}`);

		translatorsScore[translator.translatorName] = score;
	}

	return Object.entries(translatorsScore)
		.map(([name, score]) => ({ name, score }))
		.sort((a, b) => b.score - a.score);
}
