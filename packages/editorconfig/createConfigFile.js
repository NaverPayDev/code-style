#!/usr/bin/env node
const {execSync} = require('child_process')
const fs = require('fs')
const path = require('path')

const createConfigFile = (dirname, fileName, destFileName = fileName) => {
    try {
        const source = path.join(dirname, fileName)
        const config = fs.readFileSync(source)

        const gitRoot = execSync('git rev-parse --show-toplevel').toString().trim()
        const dest = path.join(gitRoot, destFileName)

        if (fs.existsSync(dest)) {
            process.exit(0)
        }
        fs.writeFileSync(dest, config)
        console.log(`${destFileName} is created successfully`)
    } catch (error) {
        console.log(`Failed to create ${destFileName}`)
        console.log(error?.message)
        process.exit(0)
    }
}

module.exports = {
    createConfigFile,
}
