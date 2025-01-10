import eslintPluginYml from 'eslint-plugin-yml'

export default [
    ...eslintPluginYml.configs['flat/recommended'],
    ...eslintPluginYml.configs['flat/prettier'],
    /**
     * Disable rules that cause problems with YAML files requiring type information
     */
    {
        files: ['**/*.yaml', '**/*.yml'],
        rules: {
            '@typescript-eslint/naming-convention': 'off',
            '@typescript-eslint/consistent-type-imports': 'off',
        },
    },
]
