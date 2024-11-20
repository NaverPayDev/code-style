import {traverseAllNodes} from '../utils/astParser.js'

/** 특정 ImportDefaultSpecifier의 멤버변수를 참조하는 노드 목록을 반환 */
const getImportDefaultSpecifierReferences = (importDefaultSpecifier, allNodes) => {
    return traverseAllNodes(allNodes, (innerNode) => {
        const importDefaultSpecifierName = importDefaultSpecifier?.local?.name
        if (!importDefaultSpecifierName) {
            return
        }

        if (
            innerNode.type === 'JSXElement' &&
            innerNode.openingElement.name?.object?.name === importDefaultSpecifierName
        ) {
            return innerNode
        }

        if (innerNode.type === 'TSQualifiedName' && innerNode.left?.name === importDefaultSpecifierName) {
            return innerNode
        }

        if (innerNode.type === 'MemberExpression' && innerNode.object?.name === importDefaultSpecifierName) {
            return innerNode
        }
    })
}

/** 패키지 이름으로 ImportDefaultSpecifier, importSpecifiers을 찾아서 반환 */
const getImportDefaultSpecifierByPackageName = (packageName, allNodes) => {
    const importDeclaration = allNodes.find(
        (currentNode) => currentNode.type === 'ImportDeclaration' && currentNode.source.value === packageName,
    )
    const importDefaultSpecifier = importDeclaration?.specifiers.find(
        (specifier) => specifier.type === 'ImportDefaultSpecifier',
    )
    const importSpecifiers = importDeclaration?.specifiers?.filter((specifier) => specifier.type === 'ImportSpecifier')

    return {
        importDefaultSpecifier,
        importSpecifiers,
    }
}

/** importDefaultSpecifier를 제거하고 member를 ImportSpecifiers에 추가 */
const fixDefaultToNamedImport = ({fixer, memberName, importDefaultSpecifier, importSpecifiers, allNodes}) => {
    const fixed = []
    const importDefaultSpecifierReferences = getImportDefaultSpecifierReferences(importDefaultSpecifier, allNodes)
    const hasDefaultSpecifierReference = !!importDefaultSpecifier && importDefaultSpecifierReferences.length > 1

    if (hasDefaultSpecifierReference) {
        // 이미 ImportSpecifier가 있다면 안에 추가
        if (importSpecifiers?.length > 0) {
            const lastImportSpecifier = importSpecifiers[importSpecifiers.length - 1]

            const alreadyImported = importSpecifiers.some(
                (importSpecifier) => importSpecifier.local.name === memberName,
            )
            // ImportSpecifier 안에 이미 존재하는 모듈이면 pass
            if (!alreadyImported) {
                fixed.push(fixer.insertTextAfter(lastImportSpecifier, ', ' + memberName))
            }
        } else {
            // 이전에 ImportSpecifier가 없었다면
            fixed.push(fixer.insertTextAfter(importDefaultSpecifier, `, {${memberName}}`))
        }
    }
    // DefaultSpecifier를 현재 MemberExpression 외에서 사용하지 않는 경우
    else {
        if (importSpecifiers?.length > 0) {
            // 이미 ImportSpecifier가 있다면 안에 추가
            const lastImportSpecifier = importSpecifiers[importSpecifiers.length - 1]
            fixed.push(fixer.removeRange([importDefaultSpecifier.range[1], importDefaultSpecifier.range[1] + 2]))
            fixed.push(fixer.remove(importDefaultSpecifier))

            const alreadyImported = importSpecifiers.some(
                (importSpecifier) => importSpecifier.local.name === memberName,
            )
            // ImportSpecifier 안에 이미 존재하는 모듈이면 pass
            if (!alreadyImported) {
                fixed.push(fixer.insertTextAfter(lastImportSpecifier, ', ' + memberName))
            }
        } else {
            // ImportSpecifier가 없으면 새로 추가
            fixed.push(fixer.replaceText(importDefaultSpecifier, `{${memberName}}`))
        }
    }

    return fixed
}

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'receive a list of packages to prevent default import.',
        },
        fixable: 'code',
        schema: [
            {
                type: 'object',
                properties: {
                    packages: {type: 'array', items: {type: 'string'}},
                },
            },
        ],
    },
    create(context) {
        const packages = context.options[0]?.packages ?? []
        const allNodes = context.sourceCode.ast.body

        return {
            ImportDeclaration(node) {
                const importDefaultSpecifier = node.specifiers.find(
                    (specifier) => specifier.type === 'ImportDefaultSpecifier',
                )
                const hasImportSpecifiers = node.specifiers.some((specifier) => specifier.type === 'ImportSpecifier')
                const importDefaultSpecifierReferences = getImportDefaultSpecifierReferences(
                    importDefaultSpecifier,
                    allNodes,
                )
                const noImportDefaultSpecifierReference =
                    importDefaultSpecifier && importDefaultSpecifierReferences.length === 0

                packages.forEach((packageName) => {
                    // ImportDefaultSpecifier 사용처가 없고
                    if (packageName === node.source.value && noImportDefaultSpecifierReference) {
                        if (!hasImportSpecifiers) {
                            // ImportSpecifier가 없는 경우
                            context.report({
                                node,
                                message: `'${packageName}' should use named import instead of default import.`,
                                fix: (fixer) => fixer.remove(node),
                            })
                        } else {
                            // ImportSpecifier는 있는 경우
                            context.report({
                                node,
                                message: `'${importDefaultSpecifier.local.name}' is not being used.`,
                                fix: (fixer) => {
                                    const fixed = []

                                    fixed.push(
                                        fixer.removeRange([
                                            importDefaultSpecifier.range[1],
                                            importDefaultSpecifier.range[1] + 2,
                                        ]),
                                    )
                                    fixed.push(fixer.remove(importDefaultSpecifier))

                                    return fixed
                                },
                            })
                        }
                    }
                })
            },
            MemberExpression(node) {
                packages.forEach((packageName) => {
                    const {importDefaultSpecifier, importSpecifiers} = getImportDefaultSpecifierByPackageName(
                        packageName,
                        allNodes,
                    )

                    if (importDefaultSpecifier && node.object.name === importDefaultSpecifier.local.name) {
                        context.report({
                            node,
                            message: `'${node.object.name}.${node.property.name}' should be used as '${node.property.name}'`,
                            fix: (fixer) => {
                                const fixed = []

                                fixed.push(fixer.replaceText(node, node.property.name))
                                fixed.push(
                                    ...fixDefaultToNamedImport({
                                        fixer,
                                        memberName: node.property.name,
                                        importDefaultSpecifier,
                                        importSpecifiers,
                                        allNodes,
                                    }),
                                )

                                return fixed
                            },
                        })
                    }
                })
            },
            TSQualifiedName(node) {
                packages.forEach((packageName) => {
                    const {importDefaultSpecifier, importSpecifiers} = getImportDefaultSpecifierByPackageName(
                        packageName,
                        allNodes,
                    )

                    if (importDefaultSpecifier && node.left.name === importDefaultSpecifier.local.name) {
                        context.report({
                            node,
                            message: `'${node.left.name}.${node.right.name}' should be used as '${node.right.name}'`,
                            fix: (fixer) => {
                                const fixed = []

                                fixed.push(fixer.replaceText(node, node.right.name))
                                fixed.push(
                                    ...fixDefaultToNamedImport({
                                        fixer,
                                        memberName: node.right.name,
                                        importDefaultSpecifier,
                                        importSpecifiers,
                                        allNodes,
                                    }),
                                )

                                return fixed
                            },
                        })
                    }
                })
            },
            JSXElement(node) {
                packages.forEach((packageName) => {
                    const {importDefaultSpecifier, importSpecifiers} = getImportDefaultSpecifierByPackageName(
                        packageName,
                        allNodes,
                    )

                    if (
                        importDefaultSpecifier &&
                        node.openingElement.name?.object?.name === importDefaultSpecifier.local.name
                    ) {
                        context.report({
                            node,
                            message: `'${node.openingElement.name.object.name}.${node.openingElement.name.property.name}' should be used as '${node.openingElement.name.property.name}'`,
                            fix: (fixer) => {
                                const fixed = []

                                fixed.push(
                                    fixer.replaceText(node.openingElement.name, node.openingElement.name.property.name),
                                )
                                if (node.closingElement) {
                                    fixed.push(
                                        fixer.replaceText(
                                            node.closingElement.name,
                                            node.closingElement.name.property.name,
                                        ),
                                    )
                                }
                                fixed.push(
                                    ...fixDefaultToNamedImport({
                                        fixer,
                                        memberName: node.openingElement.name.property.name,
                                        importDefaultSpecifier,
                                        importSpecifiers,
                                        allNodes,
                                    }),
                                )

                                return fixed
                            },
                        })
                    }
                })
            },
        }
    },
}
