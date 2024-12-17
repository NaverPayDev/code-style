import globals from 'globals'

import rules from './rules/index.js'
import typescript from '../typescript/index.js'
import configs from './configs.js'

export default [
    ...configs,
    ...typescript,
    ...rules,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.jest,
                ...globals.es2023,
            },
        },
        linterOptions: {
            reportUnusedDisableDirectives: true,
        },
        settings: {
            'import/resolver': {
                node: {
                    moduleDirectory: ['node_modules', 'src'],
                },
            },
        },
    },
]
