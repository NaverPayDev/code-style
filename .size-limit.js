const path = require('path')
const glob = require('glob')
const fs = require('fs')

const packageJsonList = glob
    .globSync('**/package.json', {
        cwd: path.join(process.cwd(), 'packages'),
    })
    .map((filePath) => {
        const {name, main} = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'packages', filePath), 'utf8'))
        const packageName = name.split('/')[1]
        return {
            name: packageName,
            path: `packages/${packageName}${main.slice(1)}`,
        }
    })

module.exports = packageJsonList
