import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		fileParallelism: false,
		testTimeout: 0,
	},
});
