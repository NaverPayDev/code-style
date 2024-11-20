import fs from 'node:fs'

import memoReactComponents from './rules/memo-react-components.js'
import optimizeSvgComponents from './rules/optimize-svg-components.js'
import preventDefaultImport from './rules/prevent-default-import.js'
import sortExports from './rules/sort-exports.js'
import svgUniqueId from './rules/svg-unique-id.js'

const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

const plugin = {
    meta: {
        name: pkg.name,
        version: pkg.version,
    },
    rules: {
        'memo-react-components': memoReactComponents,
        'optimize-svg-components': optimizeSvgComponents,
        'prevent-default-import': preventDefaultImport,
        'sort-exports': sortExports,
        'svg-unique-id': svgUniqueId,
    },
}

export default plugin
