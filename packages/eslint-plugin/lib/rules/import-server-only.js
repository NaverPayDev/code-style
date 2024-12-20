import path from 'path'

import micromatch from 'micromatch'

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'Require `server-only` import in specific folders.',
            recommended: false,
        },
        fixable: 'code',
        schema: [
            {
                type: 'object',
                properties: {
                    include: {
                        type: 'array',
                        items: {type: 'string'},
                        minItems: 1,
                    },
                    exclude: {
                        type: 'array',
                        items: {type: 'string'},
                        minItems: 0,
                    },
                },
                additionalProperties: false,
            },
        ],
    },
    create(context) {
        const {include, exclude} = context.options[0] || {}
        const filePath = path.relative(context.getCwd(), context.getFilename())

        const isIncluded = micromatch.isMatch(filePath, include)
        const isExcluded = micromatch.isMatch(filePath, exclude)

        if (!(isIncluded && !isExcluded)) {
            return {}
        }

        return {
            Program(node) {
                const hasServerOnlyImport = node.body.some(
                    (statement) => statement.type === 'ImportDeclaration' && statement.source.value === 'server-only',
                )

                const sourceCode = context.getSourceCode()
                if (!hasServerOnlyImport) {
                    context.report({
                        node,
                        message: 'This file must include `import server-only`.',
                        fix(fixer) {
                            const firstToken = sourceCode.getFirstToken(node)
                            return fixer.insertTextBefore(firstToken, "import 'server-only'\n")
                        },
                    })
                }
            },
        }
    },
}
