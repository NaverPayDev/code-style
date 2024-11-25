import globals from 'globals'

import recommends from '../recommends/index.js'
import recommendsReact from '../recommends/react.js'
import recommendsTypescript from '../recommends/typescript.js'
import rulesFront from '../rules/front/index.js'
import rulesTypescript from '../rules/typescript/index.js'

export default [
    ...recommends,
    ...recommendsReact,
    ...recommendsTypescript,
    ...rulesFront,
    rulesTypescript,
    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.browser,
                ...globals.jest,
            },
        },
    },
    {
        files: ['*.js', '*.jsx'],
        rules: {
            'no-undef': 'error',
        },
    },
]
