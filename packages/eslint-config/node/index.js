import globals from 'globals'

import configs from './configs.js'
import rules from './rules/index.js'

export default [
    ...configs,
    ...rules,
    {
        languageOptions: {
            globals: {
                ...globals.commonjs,
                ...globals.node,
                ...globals.jest,
                ...globals.vitest,
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
