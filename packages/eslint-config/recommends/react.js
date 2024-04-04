module.exports = {
    extends: [
        'plugin:react/recommended', // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/configs/recommended.js (React specific linting rules for eslint)
        'plugin:react/jsx-runtime', // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/configs/jsx-runtime.js (Disable new JSX transform from React 17 relevant rules)
        'plugin:react-hooks/recommended', // https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/src/index.js#L14-L21 (enforces the Rules of Hooks)
    ],
}
