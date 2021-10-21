module.exports = {
	testEnvironment: 'node',

	globals: {
		extensionsToTreatAsEsm: ['.ts', '.js'],
		'ts-jest': {
			useESM: true,
		},
	},

	preset: 'ts-jest/presets/js-with-ts-esm',
};
