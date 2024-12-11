import babelParser from '@babel/eslint-parser'
import globals from 'globals'

import configs from './configs.js'
import rules from './rules/index.js'

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
