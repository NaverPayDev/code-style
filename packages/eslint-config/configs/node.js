import globals from 'globals'
import babelParser from '@babel/eslint-parser'

import recommends from '../recommends/index.js'
import node from '../rules/node/index.js'

export default [
    ...node,
    ...recommends,
    {
        rules: {
            'no-unused-vars': 'warn',
        },
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
