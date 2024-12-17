import react from 'eslint-plugin-react'

export default {
    plugins: {
        react,
    },
    rules: {
        /**
         * Disallow missing displayName in a React component definition
         * @see https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/display-name.md
         */
        'react/display-name': 'off',

        /**
         * Enforce or disallow spaces inside of curly braces in JSX attributes and expressions
         * @see https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-child-element-spacing.md
         */
        'react/jsx-child-element-spacing': 'off',

        /**
         * Enforce closing bracket location in JSX
         * @see https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-closing-bracket-location.md
         */
        'react/jsx-closing-bracket-location': 'off',

        /**
         * Enforce closing tag location for multiline JSX
         * @see https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-closing-tag-location.md
         */
        'react/jsx-closing-tag-location': 'off',

        /**
         * Enforce consistent linebreaks in curly braces in JSX attributes and expressions
         * @see https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-curly-newline.md
         */
        'react/jsx-curly-newline': 'off',

        /**
         * Enforce or disallow spaces inside of curly braces in JSX attributes and expressions
         * @see https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-curly-spacing.md
         */
        'react/jsx-curly-spacing': 'off',

        /**
         * Enforce or disallow spaces around equal signs in JSX attributes
         * @see https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-equals-spacing.md
         */
        'react/jsx-equals-spacing': 'off',

        /**
         * Enforce proper position of the first property in JSX
         * @see https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-first-prop-new-line.md
         */
        'react/jsx-first-prop-new-line': 'off',

        /**
         * Enforce JSX indentation
         * @see https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-indent.md
         */
        'react/jsx-indent': 'off',

        /**
         * Enforce props indentation in JSX
         * @see https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-indent-props.md
         */
        'react/jsx-indent-props': 'off',

        /**
         * Enforce maximum of props on a single line in JSX
         * @see https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-max-props-per-line.md
         */
        'react/jsx-max-props-per-line': 'off',

        /**
         * Require one JSX element per line
         * @see https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-one-expression-per-line.md
         */
        'react/jsx-one-expression-per-line': 'off',

        /**
         * Disallow multiple spaces between inline JSX props
         * @see https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-props-no-multi-spaces.md
         */
        'react/jsx-props-no-multi-spaces': 'off',

        /**
         * Enforce spacing before closing bracket in JSX
         * @see https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-space-before-closing.md
         */
        'react/jsx-space-before-closing': 'off',

        /**
         * Enforce whitespace in and around the JSX opening and closing brackets
         * @see https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-tag-spacing.md
         */
        'react/jsx-tag-spacing': 'off',

        /**
         * Disallow missing parentheses around multiline JSX
         * @see https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-wrap-multilines.md
         */
        'react/jsx-wrap-multilines': 'off',

        /**
         * Disallow file extensions that may contain JSX
         * @see https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-filename-extension.md
         */
        'react/jsx-filename-extension': 'off',

        /**
         * Disallow JSX prop spreading
         * @see https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-props-no-spreading.md
         */
        'react/jsx-props-no-spreading': 'off',

        /**
         * Enforce props alphabetical sorting
         * @see https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-sort-props.md
         */
        'react/jsx-sort-props': [
            'warn',
            {
                noSortAlphabetically: true,
                shorthandFirst: false,
                callbacksLast: false,
                reservedFirst: true,
            },
        ],

        /**
         * Disallow missing props validation in a React component definition
         * @see https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/prop-types.md
         */
        'react/prop-types': 'off',

        /**
         * Enforce class component state initialization style
         * @see https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/state-in-constructor.md
         */
        'react/state-in-constructor': 'off',

        /**
         * Enforces where React component static properties should be positioned
         * @see https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/static-property-placement.md
         */
        'react/static-property-placement': 'off',

        /**
         * Disallow usage of Array index in keys
         * @see https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-array-index-key.md
         */
        'react/no-array-index-key': 'off',

        /**
         * Enforce event handler naming conventions in JSX
         * @see https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-handler-names.md
         */
        'react/jsx-handler-names': [
            'warn',
            {
                eventHandlerPrefix: '(on|handle)',
                eventHandlerPropPrefix: '(on|handle)',
                checkLocalVariables: true,
                checkInlineFunction: false,
            },
        ],
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
}
