import globals from 'globals'
import babelParser from '@babel/eslint-parser'

import recommends from '../recommends/index.js'
import recommendsReact from '../recommends/react.js'
import rulesFront from '../rules/front/index.js'

export default [
    ...recommends,
    ...recommendsReact,
    ...rulesFront,
    {
        languageOptions: {
            parser: babelParser,
            parserOptions: {
                allowImportExportEverywhere: true,
                sourceType: 'module',
                requireConfigFile: false,
                babelOptions: {
                    plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-transform-react-jsx'],
                },
            },
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
