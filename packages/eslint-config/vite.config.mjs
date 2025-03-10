import {createViteConfig} from '@naverpay/pite'
import builtins from 'builtin-modules'

export default createViteConfig({
    entry: ['./index.js'],
    options: {
        minify: false,
        rollupOptions: {
            external: [...builtins],
        },
    },
})
