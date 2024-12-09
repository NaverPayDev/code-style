import naverpay from '@naverpay/eslint-plugin'

export default {
    plugins: {
        naverpay,
    },
    rules: {
        /**
         * Enforce camelcase naming convention
         * @see https://eslint.org/docs/latest/rules/camelcase
         */
        camelcase: 'off',

        /**
         * Disallow reassigning function parameters
         * @see https://eslint.org/docs/latest/rules/no-param-reassign
         */
        'no-param-reassign': 'error',

        /**
         * Disallow unused variables
         * @see https://eslint.org/docs/latest/rules/no-unused-vars
         * @todo remove react pattern
         */
        'no-unused-vars': [
            'error',
            {ignoreRestSiblings: true, argsIgnorePattern: '^_', varsIgnorePattern: '(React|^_)'},
        ],

        /**
         * Disallow the use of undeclared variables unless mentioned in global comments
         * @see https://eslint.org/docs/latest/rules/no-undef
         */
        'no-undef': ['error'],

        /**
         * Disallow default import
         * @see https://github.com/NaverPayDev/code-style/blob/main/packages/eslint-plugin/docs/prevent-default-import.md
         * @todo remove this rule from node
         */
        'naverpay/prevent-default-import': ['error', {packages: ['react']}],
    },
}
