import {createViteConfig} from '@naverpay/pite'
import builtins from 'builtin-modules'

export default createViteConfig({
    entry: ['./lib/index.js'],
    ignoredPolyfills: ['esnext.json.parse', 'es.array.push'],
    options: {
        minify: false,
        rollupOptions: {
            external: [...builtins],
        },
    },
})
