import path from 'path'
import {fileURLToPath} from 'url'

import {FlatCompat} from '@eslint/eslintrc'
import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginYml from 'eslint-plugin-yml'
import neostandard from 'neostandard'

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
    baseDirectory: __dirname,
})

export default [
    js.configs.recommended,
    ...neostandard({noStyle: true}),
    eslintConfigPrettier,
    ...compat.extends('plugin:react/recommended', 'plugin:react/jsx-runtime', 'plugin:react-hooks/recommended'),
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
