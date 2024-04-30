const indentString = (str, count, indent = ' ') => str.replace(/^/gm, indent.repeat(count))

const isValid = (str) => !['null', 'undefined', 'none'].includes(str)

const isEmptyString = (str) => typeof str === 'string' && str.length === 0

const isStringObject = (str) => {
    try {
        JSON.parse(str)
        return true
    } catch {
        return false
    }
}

const trimAll = (str) => str.replace(/[ \n]+/g, '')

const numberReplacer = (str) => str.replace(/\{([0-9.-]+)\}/g, '"$1"')

module.exports = {
    indentString,
    isValid,
    isEmptyString,
    isStringObject,
    numberReplacer,
    trimAll,
}
