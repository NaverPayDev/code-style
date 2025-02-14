import {getExportDefaultDeclaration} from '@naverpay/ast-parser'
import {minimatch} from 'minimatch'

/**
 * @type {import('eslint').Rule.RuleModule}
 */
export default {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'should memoize all react components',
            recommended: true,
        },
        fixable: 'code',
        schema: [
            {
                type: 'objects',
                rules: {
                    type: 'array',
                    default: true,
                },
            },
        ],
    },
    create: function (context) {
        const filename = context.filename.replace(context.cwd, '')
        const isFileInPath = context.options[0].path.some((pattern) => minimatch(filename, pattern))
        if (!isFileInPath) {
            return {}
        }

        let isAlreadyMemoized = false

        const sourceCode = context.sourceCode ?? context.getSourceCode()

        /**
         * @type {import('eslint').Scope.Scope | undefined}
         */
        let globalScope

        function importReactMemo(fixer) {
            let i = 0
            const importDeclarations = []
            let iterateNode
            while ((iterateNode = globalScope.block.body[i++]).type === 'ImportDeclaration') {
                importDeclarations.push(iterateNode)
            }

            const reactImportDeclaration = importDeclarations.find(({source: {value}}) => value === 'react')

            let isDefault = false
            let hasImportMemo = false
            let isDefaultOnly = false
            if (reactImportDeclaration) {
                // import React from react
                isDefault = reactImportDeclaration.specifiers.some(
                    ({type, local}) => type === 'ImportDefaultSpecifier' && local.name === 'React',
                )

                // only import React from 'react'
                isDefaultOnly = reactImportDeclaration.specifiers.length === 1 && isDefault

                // import {memo} from react와 같은 형식으로 memo import가 있는 경우
                hasImportMemo = reactImportDeclaration.specifiers.some(({imported}) => imported?.name === 'memo')
            }

            const result = []

            //  react import declaration doesn't exist and there is at least one import declaration.
            if (!reactImportDeclaration && importDeclarations.length > 0) {
                result.push(fixer.insertTextBefore(importDeclarations[0], "import {memo} from 'react'\n"))
            }
            //  react import declaration doesn't exist and there are no import declarations.
            if (!reactImportDeclaration && importDeclarations.length < 1) {
                result.push(fixer.insertTextBefore(globalScope.block.body[0], "import {memo} from 'react'\n\n"))
            }

            if (isDefaultOnly) {
                result.push(fixer.insertTextAfter(reactImportDeclaration.specifiers[0], ', {memo}'))
            }

            if (reactImportDeclaration && !isDefaultOnly && !hasImportMemo) {
                result.push(fixer.insertTextAfter(reactImportDeclaration.specifiers[1], ', memo'))
            }

            return result
        }

        return {
            Program: function (node) {
                globalScope = sourceCode.getScope ? sourceCode.getScope(node) : context.getScope()

                const exportDefaultDeclaration = getExportDefaultDeclaration(globalScope.block).declaration
                if (
                    exportDefaultDeclaration.type === 'CallExpression' &&
                    exportDefaultDeclaration.callee.name === 'memo'
                ) {
                    isAlreadyMemoized = true
                }
            },
            // const res = function getAssets({width, height, color}) ... 에 대응
            FunctionExpression: function (node) {
                if (isAlreadyMemoized) return

                const hasJSXBody = node.body.body.some(
                    (item) => item.type === 'ReturnStatement' && item.argument.type === 'JSXElement',
                )

                const isWrappedMemo = node.parent.type === 'CallExpression' && node.parent.callee.name === 'memo'

                if (hasJSXBody && !isWrappedMemo) {
                    const variableName = node.id.name

                    context.report({
                        node,
                        message: `😡 variable ${variableName} is a react component, but it is not memoized. Please memoize it for stable reference.`,
                        fix: function (fixer) {
                            const result = []
                            result.push(...importReactMemo(fixer))

                            result.push(fixer.insertTextBefore(node, `memo(`))
                            result.push(fixer.insertTextAfter(node, ')'))
                            return result
                        },
                    })
                }
            },
            // function getAssets({width, height, color}) ... 에 대응
            FunctionDeclaration: function (node) {
                if (isAlreadyMemoized) return

                // JSX를 리턴하는 함수인지 체크
                const hasJSXBody = node.body.body.some(
                    (item) => item.type === 'ReturnStatement' && item.argument.type === 'JSXElement',
                )

                if (hasJSXBody) {
                    // 함수 선언식 export 구문을 찾고, 여기에서 memo가 되었는지 확인
                    const functionName = node.id.name

                    // export function 또는 export default 의 경우에는 fixer로 도와줄 수 없으므로 경고만 한다.
                    if (
                        node.parent.type === 'ExportNamedDeclaration' ||
                        node.parent.type === 'ExportDefaultDeclaration'
                    ) {
                        context.report({
                            node,
                            message: `😡 function ${functionName} is a react component, but it is not memoized. Please memoize it for stable reference.`,
                        })
                    } else {
                        // export 가 memo 래핑 없이 바로 되었는지 확인
                        const exportWithoutMemo = node.parent.body.find(
                            (item) =>
                                item.type === 'ExportDefaultDeclaration' &&
                                item.declaration.name === functionName &&
                                item.declaration.type === 'Identifier',
                        )

                        if (exportWithoutMemo) {
                            context.report({
                                node,
                                message: `😡 function ${functionName} is a react component, but it is not memoized. Please memoize it for stable reference.`,
                                fix: function (fixer) {
                                    const result = []
                                    result.push(...importReactMemo(fixer))
                                    result.push(fixer.insertTextBefore(exportWithoutMemo.declaration, `memo(`))
                                    result.push(fixer.insertTextAfter(exportWithoutMemo.declaration, `)`))
                                    return result
                                },
                            })
                        }
                    }
                }
            },
            // const getAssets = ({width, height, color}) => ... 에 대응
            VariableDeclaration: function (node) {
                if (isAlreadyMemoized) return

                if (node.declarations.length === 1) {
                    const nodeDeclaration = node.declarations[0]

                    if (
                        nodeDeclaration.init.callee?.name !== 'memo' &&
                        nodeDeclaration.init.type === 'ArrowFunctionExpression' &&
                        ((nodeDeclaration.init?.body?.body &&
                            (nodeDeclaration.init?.body?.body || []).find(
                                (item) => item.type === 'ReturnStatement' && item.argument.type === 'JSXElement',
                            )) ||
                            nodeDeclaration.init.body.type === 'JSXElement')
                    ) {
                        const variableName = nodeDeclaration.id.name

                        context.report({
                            node,
                            message: `😡 variable ${variableName} is a react component, but it is not memoized. Please memoize it for stable reference.`,
                            fix: function (fixer) {
                                const result = []

                                result.push(...importReactMemo(fixer))
                                result.push(fixer.insertTextBefore(nodeDeclaration.init, `memo(`))
                                result.push(fixer.insertTextAfter(nodeDeclaration.init.body, `)`))

                                return result
                            },
                        })
                    }
                }
            },
        }
    },
}
