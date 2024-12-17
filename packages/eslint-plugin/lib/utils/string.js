export const indentString = (str, count, indent = ' ') => str.replace(/^/gm, indent.repeat(count))

export const isValid = (str) => !['null', 'undefined', 'none'].includes(str)

export const isEmptyString = (str) => typeof str === 'string' && str.length === 0

export const isStringObject = (str) => {
    try {
        JSON.parse(str)
        return true
    } catch {
        return false
    }
}

export const trimAll = (str) => str.replace(/[ \n]+/g, '')

export const numberReplacer = (str) => str.replace(/\{([0-9.-]+)\}/g, '"$1"')
