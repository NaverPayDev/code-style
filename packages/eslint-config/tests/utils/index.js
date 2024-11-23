import {ESLint} from 'eslint'

export const createLinter = ({ruleId, config}) => {
    const eslint = new ESLint({
        overrideConfigFile: true,
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

/**
 * 빈배열이면 문제 있음
 */
export const checkErrorRule = (messages, ruleId) => messages.every((message) => message.ruleId === ruleId)
