import node from './node/index.js'
import pkg from './package.json'
import packageJson from './packageJson/index.js'
import react from './react/index.js'
import strict from './strict/index.js'
import typescript from './typescript/index.js'

export default {
    meta: {
        name: pkg.name,
        version: pkg.version,
    },
    configs: {
        node,
        react,
        typescript,
        strict,
        packageJson,
    },
}
