module.exports = {
    rules: {
        /** Enforce camelcase naming convention
         @see https://eslint.org/docs/latest/rules/camelcase */
        camelcase: 'off',

        /** Disallow reassigning function parameters
         @see https://eslint.org/docs/latest/rules/no-param-reassign */
        'no-param-reassign': 'error',

        /** Disallow unused variables
         @see https://eslint.org/docs/latest/rules/no-unused-vars
         @see https://www.npmjs.com/package/eslint-plugin-unused-imports */
        'no-unused-vars': [
            'error',
            {ignoreRestSiblings: true, argsIgnorePattern: '^_', varsIgnorePattern: '(React|^_)'},
        ],

        /** Disallow the use of undeclared variables unless mentioned in global comments
         @see https://eslint.org/docs/latest/rules/no-undef */
        'no-undef': ['error'],
    },
}
