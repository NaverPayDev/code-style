import path from 'path'
import fs from 'fs'
import builtins from 'builtin-modules'
import json from '@rollup/plugin-json'

/**
 * @type {import('rollup').RollupOptions}
 */
export default ['esm', 'cjs'].map((module) => {
    const pkg = JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url), 'utf8'))

    return {
        input: 'lib/index.js',
        output: {
            format: module,
            dir: 'dist/' + module,
            ...(module === 'esm'
                ? {
                      entryFileNames: `[name]${path.extname('./dist/' + module + '/index.mjs')}`,
                      preserveModulesRoot: path.dirname('lib/index.js'),
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
