import naverpay from '@naverpay/eslint-plugin'
import importPlugin from 'eslint-plugin-import'

import {importOrder} from '../../custom/index.js'

export default {
    plugins: {naverpay, import: importPlugin},
    rules: {
        /** Enforce a convention in the order of require() / import statements
         @see https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md */
        'import/order': importOrder(),

        /** In exporting files, this rule checks if there is default export or not
         @see https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/prefer-default-export.md */
        'import/prefer-default-export': 'off',

        /**
         * @see https://github.com/NaverPayDev/code-style/blob/main/packages/eslint-plugin/docs/prevent-default-import.md */
        'naverpay/prevent-default-import': ['error', {packages: ['react']}],

        /** Disallow specified modules when loaded by import
         @see https://eslint.org/docs/latest/rules/no-restricted-imports */
        'no-restricted-imports': [
            'error',
            {
                name: 'lodash',
                message:
                    'lodash는 CommonJS로 작성되어 있어 트리쉐이킹이 되지 않아 번들 사이즈를 크게 합니다. lodash/* 형식으로 import 해주세요.',
            },
        ],
    },
}
