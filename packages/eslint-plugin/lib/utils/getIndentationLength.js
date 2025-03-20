export function getIndentationLength(jsonString) {
    const lines = jsonString.split('\n')

    for (const line of lines) {
        const trimmedLine = line.trim()
        if (trimmedLine.startsWith('"')) {
            const leadingWhitespace = line.match(/^\s*/)[0]
            return leadingWhitespace.length
        }
    }

    return 2
}
