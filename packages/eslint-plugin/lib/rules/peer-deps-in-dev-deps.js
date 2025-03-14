import path from 'path'

import {getIndentationLength} from '../utils/getIndentationLength.js'

/**
 * @type {import('eslint').Rule.RuleModule}
 */
export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'Ensure that all peerDependencies are also declared in devDependencies.',
            recommended: false,
        },
        fixable: 'code',
        schema: [],
        messages: {
            missingInDevDeps: "'{{packageName}}' is declared in peerDependencies but not in devDependencies.",
        },
    },

    create(context) {
        return {
            Program(node) {
                const filename = path.basename(context.getFilename())
                if (filename !== 'package.json') {
                    return
                }

                const sourceCode = context.sourceCode ?? context.getSourceCode()
                let json

                try {
                    json = JSON.parse(sourceCode.getText())
                } catch (error) {
                    // eslint-disable-next-line no-console
                    console.error('Failed to parse package.json:', error)
                    return
                }

                const peerDeps = json.peerDependencies || {}
                const devDeps = json.devDependencies || {}

                const peerDepsNode = sourceCode.ast.body[0].expression.properties.find(
                    (property) => property.key.value === 'peerDependencies',
                )
                const devDepsNode = sourceCode.ast.body[0].expression.properties.find(
                    (property) => property.key.value === 'devDependencies',
                )

                for (const [depName, depVersion] of Object.entries(peerDeps)) {
                    if (!Object.prototype.hasOwnProperty.call(devDeps, depName)) {
                        context.report({
                            node,
                            messageId: 'missingInDevDeps',
                            data: {packageName: depName},
                            loc: devDepsNode?.loc || peerDepsNode?.loc,
                            fix(fixer) {
                                const s = ' '.repeat(getIndentationLength(sourceCode.getText()))
                                const ss = s.repeat(2)
                                const newDevDep = `"${depName}": "${depVersion}"`

                                if (devDepsNode) {
                                    if (devDepsNode.value.properties.length > 0) {
                                        const lastDevDep =
                                            devDepsNode.value.properties[devDepsNode.value.properties.length - 1]

                                        return fixer.insertTextAfter(lastDevDep, `,\n${ss}${newDevDep}`)
                                    } else {
                                        return fixer.replaceText(
                                            devDepsNode,
                                            `"devDependencies": {\n${ss}${newDevDep}\n${s}}`,
                                        )
                                    }
                                } else {
                                    return fixer.insertTextBefore(
                                        peerDepsNode,
                                        `"devDependencies": {\n${ss}${newDevDep}\n${s}},\n${s}`,
                                    )
                                }
                            },
                        })
                    }
                }
            },
        }
    },
}
