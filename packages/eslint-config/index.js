import node from './configs/node.js'
import front from './configs/front.js'
import typescript from './configs/typescript.js'

import pkg from './package.json'

export default {
    meta: {
        name: pkg.name,
        version: pkg.version,
    },
    configs: {
        node,
        front,
        typescript,
    },
}
