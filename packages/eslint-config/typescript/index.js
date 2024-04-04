module.exports = {
    extends: [
        '../recommends',
        '../recommends/react',
        '../recommends/typescript',
        '../rules/front',
        '../rules/typescript',
    ].map(require.resolve),
    env: {
        node: true,
        browser: true,
        jest: true,
    },
    overrides: [
        {
            files: ['*.js', '*.jsx'],
            rules: {
                'no-undef': 'error',
            },
        },
    ],
    reportUnusedDisableDirectives: true,
}
