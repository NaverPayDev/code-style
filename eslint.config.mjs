import naverpay from '@naverpay/eslint-config'
import naverpayPlugin from '@naverpay/eslint-plugin'

export default [
    {
        ignores: ['**/dist/**'],
    },
    ...naverpay.configs.node,
    ...naverpay.configs.packageJson,
    {
        files: ['**/package.json'],
        plugins: {'@naverpay': naverpayPlugin},
        rules: {
            '@naverpay/peer-deps-in-dev-deps': 'error',
        },
    },
]
