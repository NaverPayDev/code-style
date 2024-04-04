const {ESLint} = require('eslint')

const baseConfig = {
    root: true,
    parser: '@babel/eslint-parser',
    env: {
        browser: true,
        jest: true,
        es2023: true,
    },
}

const createLinter = ({ruleId, config}) => {
    const eslint = new ESLint({
        baseConfig,
        overrideConfig: config,
        ignore: false,
    })

    return {
        lintFile: async (filePath) => {
            const [error] = await eslint.lintFiles([filePath])
            const errors = error.messages.filter((message) => message.ruleId === ruleId)

            return errors
        },
        lintText: async (code) => {
            const [error] = await eslint.lintText(code)
            const errors = error.messages.filter((message) => message.ruleId === ruleId)

            return errors
        },
    }
}

const checkErrorRule = (messages, ruleId) => messages.every((message) => message.ruleId === ruleId)

module.exports = {
    createLinter,
    checkErrorRule,
}
