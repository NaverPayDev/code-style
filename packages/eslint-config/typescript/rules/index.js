import tseslint from 'typescript-eslint'

export default [
    {
        plugins: {
            '@typescript-eslint': tseslint.plugin,
        },
        rules: {
            /**
             * Require let or const instead of var
             * @see https://eslint.org/docs/latest/rules/no-var
             */
            'no-var': 'off',

            /**
             * Disallow variable declarations from shadowing variables declared in the outer scope
             * @see https://typescript-eslint.io/rules/no-shadow
             */
            'no-shadow': 'off',
            '@typescript-eslint/no-shadow': 'error',

            /**
             * Disallow explicit type declarations for variables or parameters initialized to a number, string, or boolean
             * @see https://typescript-eslint.io/rules/no-inferrable-types
             */
            '@typescript-eslint/no-inferrable-types': 'off',

            /**
             * Require explicit return types on functions and class methods
             * @see https://typescript-eslint.io/rules/explicit-function-return-type
             */
            '@typescript-eslint/explicit-function-return-type': 'off',

            /**
             * Require explicit accessibility modifiers on class properties and methods
             * @see https://typescript-eslint.io/rules/explicit-member-accessibility
             */
            '@typescript-eslint/explicit-member-accessibility': ['error', {accessibility: 'no-public'}],

            /**
             * Disallow require statements except in import statements
             * @see https://typescript-eslint.io/rules/no-var-requires
             */
            '@typescript-eslint/no-var-requires': 'off',

            /**
             * Disallow the use of variables before they are defined
             * @see https://eslint.org/docs/latest/rules/no-use-before-define
             */
            'no-use-before-define': 'off',

            /**
             * Disallow the use of variables before they are defined
             * @see https://typescript-eslint.io/rules/no-use-before-define
             */
            '@typescript-eslint/no-use-before-define': ['error', {functions: false, classes: true}],

            /**
             * Enforce camelcase naming convention
             * @see https://eslint.org/docs/latest/rules/camelcase
             */
            camelcase: 'off',

            /**
             * Disallow empty functions
             * @see https://typescript-eslint.io/rules/no-empty-function
             */
            '@typescript-eslint/no-empty-function': 'off',

            /**
             * Disallow unused expressions
             * @see https://eslint.org/docs/latest/rules/no-unused-expressions
             */
            'no-unused-expressions': 'off',

            /**
             * Disallow unused expressions
             * @see https://typescript-eslint.io/rules/no-unused-expressions
             */
            '@typescript-eslint/no-unused-expressions': [
                'error',
                {
                    allowShortCircuit: true,
                    allowTernary: true,
                    allowTaggedTemplates: true,
                },
            ],

            /**
             * Disallow unused variables
             * @see https://typescript-eslint.io/rules/no-unused-vars
             */
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {ignoreRestSiblings: true, argsIgnorePattern: '^_', varsIgnorePattern: '^_'},
            ],

            /**
             * Disallow the use of undeclared variables unless mentioned in global comments
             * @see https://eslint.org/docs/latest/rules/no-undef
             */
            'no-undef': 'off',

            /**
             * Enforce consistent usage of type imports
             * @see https://typescript-eslint.io/rules/consistent-type-imports/
             */
            '@typescript-eslint/consistent-type-imports': ['error'],
        },
    },
]
