// eslint.config.js
import { globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import { readFileSync } from 'fs';
import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';

export default tseslint.config(
	eslint.configs.recommended,
	tseslint.configs.recommendedTypeChecked,
	globalIgnores([
		'**/*.test.ts',
		// Use ignore rules from `.prettierignore`
		...readFileSync('.prettierignore', { encoding: 'utf8' })
			.split('\n')
			.filter((rule) => rule && !rule.startsWith('#')),
	]),
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
			globals: {
				window: 'readonly',
				document: 'readonly',
				require: 'readonly',
				console: 'readonly',
				module: 'writable',
			},
		},
		plugins: {
			import: importPlugin,
			'unused-imports': unusedImports,
			'simple-import-sort': simpleImportSort,
		},
		settings: {
			'import/resolver': {
				typescript: {
					alwaysTryTypes: true,
					project: './tsconfig.json',
				},
			},
		},
		rules: {
			'import/no-useless-path-segments': ['error', { noUselessIndex: true }],
			'import/no-unresolved': ['error', { ignore: ['^vitest/config'] }],
			'import/export': 'off',
			'import/namespace': 'warn',
			'import/no-duplicates': ['error', { 'prefer-inline': true }],
			'import/newline-after-import': ['error', { count: 1 }],

			'@typescript-eslint/no-empty-object-type': [
				'error',
				{
					allowObjectTypes: 'always',
				},
			],

			'unused-imports/no-unused-imports': 'error',

			'simple-import-sort/imports': [
				'error',
				{
					groups: [
						['^\\u0000'],
						['^node:'],
						['^react', '^\\w', '^@\\w'],
						['^'],
						['^../../'],
						['^../', '^./', '^\\.'],
						['\\.css$'],
					],
				},
			],

			'function-call-argument-newline': ['error', 'consistent'],
			'no-var': 'error',
			'no-bitwise': 'error',
			'no-multi-spaces': 'error',
			'no-multiple-empty-lines': 'error',
			'space-in-parens': 'error',
			semi: 'error',
			'prefer-const': 'error',

			'no-use-before-define': 'off',
			'@typescript-eslint/no-use-before-define': 'error',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					args: 'all',
					argsIgnorePattern: '^_',
					caughtErrors: 'all',
					caughtErrorsIgnorePattern: '^_',
					destructuredArrayIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					ignoreRestSiblings: true,
				},
			],

			camelcase: [
				'error',
				{
					allow: ['^UNSAFE_', '^UNSTABLE_'],
				},
			],
			'arrow-parens': ['error', 'always'],
			'operator-linebreak': [
				'error',
				'after',
				{
					overrides: {
						'?': 'before',
						':': 'before',
					},
				},
			],
			'space-before-function-paren': [
				'error',
				{
					asyncArrow: 'always',
					anonymous: 'never',
					named: 'never',
				},
			],
		},
	},
	prettier,
	{
		files: ['**/*.js', '*.{js,mjs,cjs}'],
		extends: [tseslint.configs.disableTypeChecked],
		rules: {
			"@typescript-eslint/no-require-imports": "off"
		}
	},
);
