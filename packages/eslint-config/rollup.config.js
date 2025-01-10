import fs from 'fs'
import path from 'path'

import json from '@rollup/plugin-json'
import builtins from 'builtin-modules'

/**
 * @type {import('rollup').RollupOptions}
 */
export default ['esm', 'cjs'].map((module) => {
    const pkg = JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url), 'utf8'))

    return {
        input: 'index.js',
        output: {
            format: module,
            dir: 'dist/' + module,
            ...(module === 'esm'
                ? {
                      entryFileNames: `[name]${path.extname('./dist/' + module + '/index.mjs')}`,
                      preserveModulesRoot: path.dirname('index.js'),
                      preserveModules: true,
                      interop: 'esModule',
                  }
                : {
                      exports: 'auto',
                      interop: 'auto',
                  }),
        },
        external: [...Object.keys(pkg?.dependencies || []), ...Object.keys(pkg?.peerDependencies || []), ...builtins],
        plugins: [json()],
    }
})
