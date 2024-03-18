module.exports = {
	env: {
		browser: true,
		node: true,
		es2021: true
	},
	extends: [
		"plugin:@typescript-eslint/recommended",
		"plugin:react/recommended",
		"plugin:react-hooks/recommended"
	],
	plugins: [
		"import",
		"unused-imports",
		"sort-imports-es6-autofix",
		"@typescript-eslint",
		"eslint-plugin-react-compiler"
	],
	rules: {
		"react-compiler/react-compiler": "error",
		"arrow-body-style": ["error", "as-needed"],
		"sort-imports-es6-autofix/sort-imports-es6": [
			2,
			{
				ignoreCase: false,
				ignoreMemberSort: false,
				memberSyntaxSortOrder: ["none", "all", "multiple", "single"]
			}
		],
		"@typescript-eslint/no-unused-vars": [
			2,
			{
				ignoreRestSiblings: true
			}
		],
		"@typescript-eslint/naming-convention": [
			"warn",
			{
				selector: "interface",
				format: ["PascalCase"],
				custom: {
					regex: "^I[A-Z]",
					match: false
				}
			}
		],
		"react-hooks/exhaustive-deps": 2,
		"react/react-in-jsx-scope": 0
	},
	settings: {
		"import/resolver": {
			typescript: {}
		},
		react: {
			version: "detect"
		}
	},
	parser: "@typescript-eslint/parser"
};
