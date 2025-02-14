import {extractComponentProps, getImportDeclarations} from '@naverpay/ast-parser'
import {minimatch} from 'minimatch'

import {FIRST_RANGE} from '../constants/index.js'
import {findSpecificImportDeclaration, getJSXReturnStatement} from '../utils/astParser.js'
import {isEmptyObject, has} from '../utils/object.js'
import {getLatestRangeOfProps} from '../utils/svg/props.js'

function insertCustomImport({fixer, scope}) {
    const result = []
    const importDeclarations = getImportDeclarations(scope.block)

    const svgUniqueIDDeclaration = findSpecificImportDeclaration(importDeclarations, {
        name: 'SvgUniqueID',
    })

    /**
     * @description SvgUniqueID가 이미 import된 경우 제거하고 @naverpay/svg-manager에서 import
     */
    if (svgUniqueIDDeclaration) {
        result.push(fixer.remove(svgUniqueIDDeclaration))
    }

    const reactImportDeclaration = importDeclarations.find(({source: {value}}) => value === 'react')

    const targetNode = reactImportDeclaration

    const textToInsert = `\n${"import {SvgUniqueID} from '@naverpay/svg-manager'"}\n`

    if (!targetNode) {
        const lastestImportDeclarationRange =
            importDeclarations.length > 0
                ? importDeclarations[importDeclarations.length - 1].range ?? FIRST_RANGE
                : FIRST_RANGE

        result.push(fixer.insertTextBeforeRange(lastestImportDeclarationRange, textToInsert))
    } else {
        result.push(fixer.insertTextAfter(targetNode, textToInsert))
    }

    return result
}

/**
 * @param {ReturnType<import ('@pie/ast-parser').extractComponentProps>} props
 */
function getIdProps(props) {
    if (!props || isEmptyObject(props)) {
        return null
    }

    return typeof props === 'string' ? `${props}.id` : 'id'
}
/**
 *
 * @param {ReturnType<import ('@pie/ast-parser').extractComponentProps>} props
 * @param {import('eslint').Scope.Scope} globalScope
 * @param {import('eslint').Rule.RuleFixer} fixer
 */
function insertIdProps(props, globalScope, fixer) {
    if (!props || isEmptyObject(props) || typeof props === 'string' || has(props, 'id')) {
        return []
    }

    const [start, end] = getLatestRangeOfProps(globalScope)

    if (start && end) {
        return [fixer.insertTextAfterRange([start, end], ', id')]
    }

    return []
}

/**
 * @param {JSXElement|undefined} node
 */
function isSvgElement(node) {
    return node && node.openingElement.name.type === 'JSXIdentifier' && node.openingElement.name.name === 'svg'
}
/**
 * @type {import('eslint').Rule.RuleModule}
 */
export default {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'set a unique id to svg component',
            recommended: true,
        },
        fixable: 'code',
        schema: [
            {
                type: 'object',
                properties: {
                    paths: {
                        type: 'array',
                        items: {type: 'string'},
                    },
                },
            },
        ],
    },
    create: function (context) {
        const filename = context.filename.replace(context.cwd, '')
        const {
            options: [config],
        } = context

        const {paths} = config

        if (!paths) {
            throw new Error('paths should be provided')
        }

        const foundRule = paths.find((pattern) => minimatch(filename, pattern))

        if (!foundRule) {
            return {}
        }

        /**
         * @type {import('eslint').Scope.Scope | undefined}
         */
        let globalScope
        const sourceCode = context.sourceCode ?? context.getSourceCode()

        return {
            Program: function (node) {
                globalScope = sourceCode.getScope ? sourceCode.getScope(node) : context.getScope()
            },
            onCodePathEnd: function (_, code) {
                const svgElement = getJSXReturnStatement(globalScope)
                if (!isSvgElement(svgElement)) return

                const props = extractComponentProps(globalScope.block)
                const idPropsValue = getIdProps(props)
                const propsDefinition = idPropsValue ? ` id={${idPropsValue}}` : ''

                try {
                    context.report({
                        node: code,
                        message: `All IDs within the svg code must be unique.`,
                        fix: function (fixer) {
                            const result = [
                                ...insertCustomImport({fixer, scope: globalScope}),
                                ...insertIdProps(props, globalScope, fixer),
                                fixer.insertTextBefore(svgElement, `<SvgUniqueID${propsDefinition}>\n`),
                                fixer.insertTextAfter(svgElement, '\n</SvgUniqueID>'),
                            ]

                            return result
                        },
                    })
                } catch (error) {
                    context.report(code, error.message)
                }
            },
        }
    },
}
