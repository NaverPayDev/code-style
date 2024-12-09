import globals from 'globals'
import babelParser from '@babel/eslint-parser'

import rules from './rules/index.js'
import configs from './configs.js'

export default [
    ...configs,
    ...rules,
    {
        languageOptions: {
            parser: babelParser,
            parserOptions: {
                requireConfigFile: false,
            },
            globals: {
                ...globals.commonjs,
                ...globals.node,
                ...globals.jest,
                ...globals.es2023,
                Atomics: 'readonly',
                SharedArrayBuffer: 'readonly',
            },
        },
        linterOptions: {
            reportUnusedDisableDirectives: true,
        },
    },
]
