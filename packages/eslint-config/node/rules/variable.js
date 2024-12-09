export default {
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
         */
        'no-unused-vars': ['error', {ignoreRestSiblings: true, argsIgnorePattern: '^_', varsIgnorePattern: '^_'}],

        /**
         * Disallow the use of undeclared variables unless mentioned in global comments
         * @see https://eslint.org/docs/latest/rules/no-undef
         */
        'no-undef': ['error'],
    },
}
