import fs from 'node:fs'

import node from './configs/node.js'
import front from './configs/front.js'

const pkg = JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url), 'utf8'))

export default {
    meta: {
        name: pkg.name,
        version: pkg.version,
    },
    configs: {
        node,
        front,
    },
}
