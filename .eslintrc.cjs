module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['svelte3', '@typescript-eslint', 'testing-library', 'jest-dom'],
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
	ignorePatterns: ['*.cjs'],
	overrides: [
		{ files: ['*.svelte'], processor: 'svelte3/svelte3' },
		{
			files: ['tests/components/*.ts'],
			extends: ['plugin:jest-dom/recommended', 'plugin:testing-library/dom']
		}
	],
	settings: {
		'svelte3/typescript': () => require('typescript')
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	}
};
