import naverpay from '@naverpay/eslint-config'

export default [
    {
        ignores: ['**/dist/**'],
    },
    ...naverpay.configs.node,
]
