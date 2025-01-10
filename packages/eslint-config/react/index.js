import globals from 'globals'

import configs from './configs.js'
import rules from './rules/index.js'
import typescript from '../typescript/index.js'
import yaml from '../yaml/index.js'

export default [
    ...configs,
    ...typescript,
    ...rules,
    ...yaml,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.jest,
                ...globals.vitest,
                ...globals.es2023,
            },
        },
        linterOptions: {
            reportUnusedDisableDirectives: true,
        },
    },
]
