/** @deprecated */
module.exports = {
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
                const defaultSpecifier = node.specifiers.find(
                    (specifier) => specifier.type === 'ImportDefaultSpecifier',
                )
                const hasImportSpecifiers = node.specifiers.some((specifier) => specifier.type === 'ImportSpecifier')
                const noDefaultSpecifierReference =
                    !!defaultSpecifier &&
                    context.sourceCode.getDeclaredVariables(defaultSpecifier)[0]?.references.length === 0

                packages.forEach((packageName) => {
                    // DefaultSpecifier 사용처가 없고
                    if (packageName === node.source.value && noDefaultSpecifierReference) {
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
                                message: `'${defaultSpecifier.local.name}' is not being used.`,
                                fix: (fixer) => {
                                    const fixed = []

                                    fixed.push(
                                        fixer.removeRange([defaultSpecifier.range[1], defaultSpecifier.range[1] + 2]),
                                    )
                                    fixed.push(fixer.remove(defaultSpecifier))

                                    return fixed
                                },
                            })
                        }
                    }
                })
            },
            MemberExpression(node) {
                packages.forEach((packageName) => {
                    const importDeclaration = allNodes.find(
                        (currentNode) =>
                            currentNode.type === 'ImportDeclaration' && currentNode.source.value === packageName,
                    )
                    const defaultSpecifier = importDeclaration?.specifiers.find(
                        (specifier) => specifier.type === 'ImportDefaultSpecifier',
                    )
                    const hasDefaultSpecifier = !!defaultSpecifier
                    const hasDefaultSpecifierReference =
                        hasDefaultSpecifier &&
                        context.sourceCode.getDeclaredVariables(defaultSpecifier)[0]?.references.length >= 2

                    if (hasDefaultSpecifier && node.object.name === defaultSpecifier.local.name) {
                        const ImportSpecifiers = importDeclaration.specifiers.filter(
                            (specifier) => specifier.type === 'ImportSpecifier',
                        )

                        context.report({
                            node,
                            message: `'${node.object.name}.${node.property.name}' should be used as '${node.property.name}'`,
                            fix: (fixer) => {
                                const fixed = []

                                fixed.push(fixer.replaceText(node, node.property.name))

                                // DefaultSpecifier를 현재 MemberExpression 외에서 사용하고 있을 경우
                                if (hasDefaultSpecifierReference) {
                                    // 이미 ImportSpecifier가 있다면 안에 추가
                                    if (ImportSpecifiers.length > 0) {
                                        const lastImportSpecifier = ImportSpecifiers[ImportSpecifiers.length - 1]

                                        const alreadyImported = ImportSpecifiers.some(
                                            (importSpecifier) => importSpecifier.local.name === node.property.name,
                                        )
                                        // ImportSpecifier 안에 이미 존재하는 모듈이면 pass
                                        if (!alreadyImported) {
                                            fixed.push(
                                                fixer.insertTextAfter(lastImportSpecifier, ', ' + node.property.name),
                                            )
                                        }
                                    } else {
                                        // 이전에 ImportSpecifier가 없었다면
                                        fixed.push(fixer.insertTextAfter(defaultSpecifier, `, {${node.property.name}}`))
                                    }
                                }
                                // DefaultSpecifier를 현재 MemberExpression 외에서 사용하지 않는 경우
                                else {
                                    if (ImportSpecifiers.length > 0) {
                                        // 이미 ImportSpecifier가 있다면 안에 추가
                                        const lastImportSpecifier = ImportSpecifiers[ImportSpecifiers.length - 1]
                                        fixed.push(
                                            fixer.removeRange([
                                                defaultSpecifier.range[1],
                                                defaultSpecifier.range[1] + 2,
                                            ]),
                                        )
                                        fixed.push(fixer.remove(defaultSpecifier))

                                        const alreadyImported = ImportSpecifiers.some(
                                            (importSpecifier) => importSpecifier.local.name === node.property.name,
                                        )
                                        // ImportSpecifier 안에 이미 존재하는 모듈이면 pass
                                        if (!alreadyImported) {
                                            fixed.push(
                                                fixer.insertTextAfter(lastImportSpecifier, ', ' + node.property.name),
                                            )
                                        }
                                    } else {
                                        // ImportSpecifier가 없으면 새로 추가
                                        fixed.push(fixer.replaceText(defaultSpecifier, `{${node.property.name}}`))
                                    }
                                }

                                return fixed
                            },
                        })
                    }
                })
            },
            TSQualifiedName(node) {
                packages.forEach((packageName) => {
                    const importDeclaration = allNodes.find(
                        (currentNode) =>
                            currentNode.type === 'ImportDeclaration' && currentNode.source.value === packageName,
                    )
                    const defaultSpecifier = importDeclaration?.specifiers.find(
                        (specifier) => specifier.type === 'ImportDefaultSpecifier',
                    )
                    const hasDefaultSpecifier = !!defaultSpecifier
                    const hasDefaultSpecifierReference =
                        hasDefaultSpecifier &&
                        context.sourceCode.getDeclaredVariables(defaultSpecifier)[0]?.references.length >= 2
                    if (hasDefaultSpecifier && node.left.name === defaultSpecifier.local.name) {
                        const ImportSpecifiers = importDeclaration.specifiers.filter(
                            (specifier) => specifier.type === 'ImportSpecifier',
                        )
                        context.report({
                            node,
                            message: `'${node.left.name}.${node.right.name}' should be used as '${node.right.name}'`,
                            fix: (fixer) => {
                                const fixed = []
                                fixed.push(fixer.replaceText(node, node.right.name))
                                // DefaultSpecifier를 현재 MemberExpression 외에서 사용하고 있을 경우
                                if (hasDefaultSpecifierReference) {
                                    // 이미 ImportSpecifier가 있다면 안에 추가
                                    if (ImportSpecifiers.length > 0) {
                                        const lastImportSpecifier = ImportSpecifiers[ImportSpecifiers.length - 1]

                                        const alreadyImported = ImportSpecifiers.some(
                                            (importSpecifier) => importSpecifier.local.name === node.right.name,
                                        )
                                        // ImportSpecifier 안에 이미 존재하는 모듈이면 pass
                                        if (!alreadyImported) {
                                            fixed.push(
                                                fixer.insertTextAfter(lastImportSpecifier, ', ' + node.right.name),
                                            )
                                        }
                                    } else {
                                        // 이전에 ImportSpecifier가 없었다면
                                        fixed.push(fixer.insertTextAfter(defaultSpecifier, `, {${node.right.name}}`))
                                    }
                                }
                                // DefaultSpecifier를 현재 MemberExpression 외에서 사용하지 않는 경우
                                else {
                                    if (ImportSpecifiers.length > 0) {
                                        // 이미 ImportSpecifier가 있다면 안에 추가
                                        const lastImportSpecifier = ImportSpecifiers[ImportSpecifiers.length - 1]
                                        fixed.push(
                                            fixer.removeRange([
                                                defaultSpecifier.range[1],
                                                defaultSpecifier.range[1] + 2,
                                            ]),
                                        )
                                        fixed.push(fixer.remove(defaultSpecifier))

                                        const alreadyImported = ImportSpecifiers.some(
                                            (importSpecifier) => importSpecifier.local.name === node.right.name,
                                        )
                                        // ImportSpecifier 안에 이미 존재하는 모듈이면 pass
                                        if (!alreadyImported) {
                                            fixed.push(
                                                fixer.insertTextAfter(lastImportSpecifier, ', ' + node.right.name),
                                            )
                                        }
                                    } else {
                                        // ImportSpecifier가 없으면 새로 추가
                                        fixed.push(fixer.replaceText(defaultSpecifier, `{${node.right.name}}`))
                                    }
                                }
                                return fixed
                            },
                        })
                    }
                })
            },
        }
    },
}
