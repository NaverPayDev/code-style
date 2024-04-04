module.exports = {
    extends: [
        '../recommends',
        '../recommends/react',
        '../recommends/typescript',
        '../recommends/next',
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
