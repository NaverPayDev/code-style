import jsxA11ly from 'eslint-plugin-jsx-a11y'

export default {
    plugins: {'jsx-a11y': jsxA11ly},
    rules: {
        /**
         * Enforce that all elements that require alternative text have meaningful information to relay back to the end user
         * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/alt-text.md
         */
        'jsx-a11y/alt-text': 'error',

        /**
         * Enforce onClick is accompanied by at least one of the following: onKeyUp, onKeyDown, onKeyPress
         * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/click-events-have-key-events.md
         */
        'jsx-a11y/click-events-have-key-events': 'off',

        /**
         * The semantic value can then be expressed to a user via assistive technology
         * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-static-element-interactions.md
         */
        'jsx-a11y/no-static-element-interactions': 'off',

        /**
         * A non-interactive element does not support event handlers (mouse and key handlers)
         * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-noninteractive-element-interactions.md
         */
        'jsx-a11y/no-noninteractive-element-interactions': 'off',

        /**
         * Enforce that a label tag has a text label and an associated control
         * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/label-has-associated-control.md
         */
        'jsx-a11y/label-has-associated-control': 'error',
    },
}
