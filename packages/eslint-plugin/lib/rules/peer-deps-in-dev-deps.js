import path from 'path'

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
        fixable: null,
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

                for (const [depName] of Object.entries(peerDeps)) {
                    if (!Object.prototype.hasOwnProperty.call(devDeps, depName)) {
                        context.report({
                            node,
                            messageId: 'missingInDevDeps',
                            data: {packageName: depName},
                        })
                    }
                }
            },
        }
    },
}
