import reactHooks from 'eslint-plugin-react-hooks'

export default {
    plugins: {
        'react-hooks': reactHooks,
    },
    rules: {
        /**
         * Checks effect dependencies
         * @see https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/README.md
         */
        'react-hooks/exhaustive-deps': 'error',
    },
}
