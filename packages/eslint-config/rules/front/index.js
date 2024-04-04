module.exports = {
    extends: [
        './style',
        './variable',
        './react.js',
        './react-hooks.js',
        './jsx-a11y.js',
        './import.js',
        './node.js',
    ].map(require.resolve),
}
