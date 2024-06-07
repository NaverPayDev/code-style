const {extractComponentProps, getImportDeclarations} = require('@naverpay/ast-parser')
const {minimatch} = require('minimatch')

const {FIRST_RANGE} = require('../constants')
const {findSpecificImportDeclaration, getJSXReturnStatement} = require('../utils/astParser')
const {isEmptyObject, has} = require('../utils/object')
const {getLatestRangeOfProps} = require('../utils/svg/props')

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
 *
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
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
    meta: {
        type: 'suggestion',

        docs: {
            description: 'set a unique id to svg component',
            recommended: true,
        },
        fixable: 'code',
        schema: [
            {
                properties: [
                    {
                        paths: {
                            type: 'array',
                            items: [{type: 'string'}],
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

        const {paths} = config

        if (!paths) {
            throw new Error('paths should be provided')
        }

        const foundRule = paths.find((pattern) => minimatch(filename, pattern))

        if (!foundRule) {
            return {}
        }

        const globalScope = context.getScope()

        const svgElement = getJSXReturnStatement(globalScope)

        if (
            !svgElement ||
            svgElement.openingElement.name.type !== 'JSXIdentifier' ||
            svgElement.openingElement.name.name !== 'svg'
        ) {
            return {}
        }

        const props = extractComponentProps(globalScope.block)

        const idPropsValue = getIdProps(props)

        const propsDefinition = idPropsValue ? ` id={${idPropsValue}}` : ''

        return {
            onCodePathEnd: function (_, code) {
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
