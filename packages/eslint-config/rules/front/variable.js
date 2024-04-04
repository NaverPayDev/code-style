module.exports = {
    rules: {
        /** Enforce camelcase naming convention
         @see https://eslint.org/docs/latest/rules/camelcase */
        camelcase: 'off',

        /** Disallow reassigning function parameters
         @see https://eslint.org/docs/latest/rules/no-param-reassign */
        'no-param-reassign': 'error',

        /** Disallow the use of variables before they are defined
         @see https://eslint.org/docs/latest/rules/no-use-before-define */
        'no-use-before-define': ['error', {functions: false, classes: true, variables: true}],

        /** Disallow unused variables
         @see https://eslint.org/docs/latest/rules/no-unused-vars
         @see https://www.npmjs.com/package/eslint-plugin-unused-imports */
        'no-unused-vars': [
            'error',
            {ignoreRestSiblings: true, argsIgnorePattern: '^_', varsIgnorePattern: '(React|^_)'},
        ],
    },
}
