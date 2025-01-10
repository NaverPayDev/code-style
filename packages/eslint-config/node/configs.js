import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginYml from 'eslint-plugin-yml'
import neostandard from 'neostandard'

export default [
    js.configs.recommended,
    ...neostandard({noStyle: true}),
    eslintConfigPrettier,
    ...eslintPluginYml.configs['flat/recommended'],
    ...eslintPluginYml.configs['flat/prettier'],
]
