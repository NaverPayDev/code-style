import pkg from '../package.json'
import importServerOnly from './rules/import-server-only'
import memoReactComponents from './rules/memo-react-components.js'
import optimizeSvgComponents from './rules/optimize-svg-components.js'
import peerDepsInDevDeps from './rules/peer-deps-in-dev-deps.js'
import preventDefaultImport from './rules/prevent-default-import.js'
import sortExports from './rules/sort-exports.js'
import svgUniqueId from './rules/svg-unique-id.js'

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
        'import-server-only': importServerOnly,
        'peer-deps-in-dev-deps': peerDepsInDevDeps,
    },
}

export default plugin
