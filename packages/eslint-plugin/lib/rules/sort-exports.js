import {minimatch} from 'minimatch'

function getCommentFromNode(context, node) {
    const beforeComments = context.getSourceCode().getCommentsBefore(node)
    const afterComments = context.getSourceCode().getCommentsAfter(node)
    const result = {}

    const nodeStartLine = node.loc.start.line
    const nodeEndLine = node.loc.end.line

    if (beforeComments.length) {
        const beforeLatestComment = beforeComments[beforeComments.length - 1]
        const endLocLine = beforeLatestComment.loc.end.line
        if (endLocLine === nodeStartLine - 1) {
            result.before = beforeLatestComment
        }
    }

    if (afterComments.length) {
        const afterLatestComment = afterComments[0]
        const startLocLine = afterLatestComment.loc.start.line
        if (startLocLine === nodeEndLine) {
            result.after = afterLatestComment
        }
    }

    return result
}

function getOriginComment(node) {
    if (node.type === 'Block') {
        return `/*${node.value}*/`
    }

    if (node.type === 'Line') {
        return `//${node.value}`
    }

    throw new Error(`Unexpected comment type: ${node.type}`)
}

function getIdentifier(node) {
    if (node.type === 'ExportNamedDeclaration') {
        const {
            source: {raw, value},
            range,
            specifiers,
            specifiers: [
                {
                    exported: {name},
                },
            ],
            exportKind,
        } = node

        let wholeLine = ''

        if (specifiers.length === 1) {
            if (specifiers[0].local.name === 'default') {
                // export {default as Foo} from './assets/Foo'
                wholeLine = `export { default as ${name} } from ${raw}`
            } else {
                // export {Foo} from './assets/Foo'
                wholeLine = `export ${exportKind === 'type' ? 'type' : ''} { ${name} } from ${raw}`
            }
        } else {
            // export {default as foo, bar} from './assets/Foo'
            const findDefaultExport = specifiers.find((item) => item.local.name === 'default')
            const sortedExports = specifiers
                .filter((item) => item.local.name !== 'default')
                .sort((a, b) => a.local.name.localeCompare(b.local.name))
                .map((item) => item.local.name)
            if (findDefaultExport) {
                wholeLine = `export { default as ${findDefaultExport.exported.name}, ${sortedExports.join(
                    ', ',
                )} } from ${raw}`
            } else {
                wholeLine = `export ${exportKind === 'type' ? 'type' : ''} { ${sortedExports.join(', ')} } from ${raw}`
            }
        }

        return {
            raw,
            range,
            name,
            node,
            wholeLine,
            value,
        }
    }

    if (node.type === 'ExportAllDeclaration') {
        const {
            source: {raw, value},
            range,
        } = node

        const wholeLine = `export * from ${raw}`

        return {
            raw,
            range,
            value,
            node,
            wholeLine,
        }
    }
}

/**
 * @type {import('eslint').Rule.RuleModule}
 */
const rule = {
    meta: {
        type: 'suggestion',

        docs: {
            description: 'sort all exports in a file',
            recommended: false,
        },
        fixable: 'code',
        schema: [
            {
                properties: [
                    {
                        rules: {
                            type: 'array',
                        },
                    },
                ],
            },
        ],
    },
    create: function (context) {
        const rawFileName = context.getFilename()
        const cwd = context.getCwd()
        const filename = rawFileName.replace(cwd, '')
        const {
            options: [config],
        } = context

        const {rules} = config

        if (!rules) {
            throw new Error('rules should be provided')
        }

        const foundRule = rules.find((item) => item.paths.some((pattern) => minimatch(filename, pattern)))

        if (!foundRule) {
            return {}
        }

        if (!['path', 'identifier'].includes(foundRule.sortBy)) {
            throw new Error('sortBy should be path or identifier')
        }

        const depth = foundRule.depth ? Number(foundRule.depth) : undefined

        if (foundRule.sortBy === 'path' && !depth) {
            throw new Error('sort by path should use with config.depth number')
        }

        const {sortBy} = foundRule

        return {
            onCodePathEnd: function (codePath, code) {
                const getAllNamedExports = code.body.filter((node) => node.type === 'ExportNamedDeclaration')
                const getAllExportAll = code.body.filter((node) => node.type === 'ExportAllDeclaration')

                const allNamedExportsInfo = getAllNamedExports.map((node) => getIdentifier(node))
                const allExportAll = getAllExportAll.map((node) => getIdentifier(node))

                const sortedAllExportAll = [...allExportAll].sort((a, b) => {
                    if (sortBy === 'path') {
                        const aPath = a.value.split('/').slice(0, depth + 1)
                        const bPath = b.value.split('/').slice(0, depth + 1)

                        const result = aPath.join('').localeCompare(bPath.join(''))
                        if (result !== 0) {
                            return result
                        } else {
                            return a.value.localeCompare(b.value)
                        }
                    }

                    if (sortBy === 'identifier') {
                        return a.value.localeCompare(b.value)
                    }
                    return undefined
                })

                const sortedAllNamedExportsInfo = [...allNamedExportsInfo].sort((a, b) => {
                    if (sortBy === 'path') {
                        const aPath = a.value.split('/').slice(0, depth + 1)
                        const bPath = b.value.split('/').slice(0, depth + 1)

                        const result = aPath.join('').localeCompare(bPath.join(''))
                        if (result !== 0) {
                            return result
                        } else {
                            return a.name.localeCompare(b.name)
                        }
                    }

                    if (sortBy === 'identifier') {
                        return a.name.localeCompare(b.name)
                    }
                    return undefined
                })

                let currentGroup
                for (let i = 0; i < allNamedExportsInfo.length; i++) {
                    const original = allNamedExportsInfo[i]
                    const should = sortedAllNamedExportsInfo[i]

                    const group = depth ? should.value.split('/')[depth] : undefined

                    const {after: afterShouldComment} = getCommentFromNode(context, should.node)
                    const {after: afterOriginalComment} = getCommentFromNode(context, original.node)

                    const replaceTargetRange = [
                        original.range[0],
                        afterOriginalComment ? afterOriginalComment.range[1] : original.range[1],
                    ]

                    const wholeLine =
                        should.wholeLine + (afterShouldComment ? getOriginComment(afterShouldComment) : '')

                    if (original.name !== should.name) {
                        const diff = group !== currentGroup
                        if (diff) {
                            currentGroup = group
                        }

                        context.report({
                            message: `Exported name '${original.name}' should be sorted alphabetically.`,
                            node: original.node,
                            fix(fixer) {
                                return [
                                    fixer.replaceTextRange(
                                        replaceTargetRange,
                                        (diff ? `/** ${group} */\n` : '') + wholeLine,
                                    ),
                                ]
                            },
                        })
                    }
                }

                for (let i = 0; i < allExportAll.length; i++) {
                    const original = allExportAll[i]
                    const should = sortedAllExportAll[i]

                    const {after: afterShouldComment} = getCommentFromNode(context, should.node)
                    const {after: afterOriginalComment} = getCommentFromNode(context, original.node)

                    const replaceTargetRange = [
                        original.range[0],
                        afterOriginalComment ? afterOriginalComment.range[1] : original.range[1],
                    ]

                    const wholeLine =
                        should.wholeLine + (afterShouldComment ? getOriginComment(afterShouldComment) : '')

                    if (original.value !== should.value) {
                        context.report({
                            message: `Exported path '${original.value}' should be sorted alphabetically.`,
                            node: original.node,
                            fix(fixer) {
                                return [fixer.replaceTextRange(replaceTargetRange, wholeLine)]
                            },
                        })
                    }
                }
            },
        }
    },
}

export default rule
