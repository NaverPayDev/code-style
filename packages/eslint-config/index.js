import react from './react/index.js'
import node from './node/index.js'
import typescript from './typescript/index.js'
import pkg from './package.json'

export default {
    meta: {
        name: pkg.name,
        version: pkg.version,
    },
    configs: {
        node,
        react,
        typescript,
    },
}
