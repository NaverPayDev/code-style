import packageJson from 'eslint-plugin-package-json'

export default [
    packageJson.configs.recommended,
    {
        files: ['**/package.json'],
        rules: {
            '@typescript-eslint/consistent-type-imports': 'off',
        },
    },
]
