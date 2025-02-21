import packageJson from 'eslint-plugin-package-json/configs/recommended'

export default [
    packageJson,
    {
        files: ['**/package.json'],
        rules: {
            '@typescript-eslint/consistent-type-imports': 'off',
        },
    },
]
