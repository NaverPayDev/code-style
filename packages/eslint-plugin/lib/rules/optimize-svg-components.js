import {getJSXElement, getImportDeclarations, extractComponentProps} from '@naverpay/ast-parser'
import {minimatch} from 'minimatch'

import {SVG_OPTIMIZED_COMMENT_CONTENT} from '../constants/index.js'
import {isEmpty} from '../utils/index.js'
import {findSpecificImportDeclaration, hasSpecificReturnStatement, getAllComments} from '../utils/astParser.js'
import {
    insertCustomImport,
    svgoOptimize,
    replacePropsTypeDeclaration,
    parseSvgComponent,
} from '../utils/svg/transform.js'

/**
 *
 * @param {import('eslint').Rule.RuleContext} context
 * @returns {boolean}
 */
const svgValidator = (context) => {
    const globalScope = context.getScope()
    const importDeclarations = getImportDeclarations(globalScope.block)
    const hasClassNames =
        findSpecificImportDeclaration(importDeclarations, {
            from: 'classnames/bind',
        }) ||
        findSpecificImportDeclaration(importDeclarations, {
            from: 'styled-components',
        })
    const props = hasClassNames ? null : extractComponentProps(globalScope.block)
    const comments = getAllComments(context)

    const isOptimizedAlready = comments.some(({value}) => value.includes(SVG_OPTIMIZED_COMMENT_CONTENT))

    return !isEmpty(props) && !hasClassNames && !isOptimizedAlready
}

const includeHangul = (sourceCode, node) => {
    const variable = sourceCode.getText(node) // variable 구현체

    const koreanRegExp = /[ㄱ-ㅎㅏ-ㅣ가-힣]/
    return koreanRegExp.test(variable)
}

/**
 *
 * @param {import('eslint').Rule.Node} node
 */
const getTargetNode = (node) => {
    if (node.parent?.parent?.type === 'VariableDeclaration') {
        return node.parent?.parent
    } else if (node.parent?.parent?.parent?.type === 'VariableDeclaration') {
        return node.parent?.parent?.parent
    } else if (node.type === 'FunctionDeclaration') {
        return node
    }
}

/**
 *
 * @param {import('estree').VariableDeclaration | import('estree').FunctionDeclaration} node
 * @returns {{isFixable: boolean; name: string}}
 */
const prepareMetadata = (node) => {
    if (node.type === 'VariableDeclaration') {
        const nodeDeclaration = node.declarations[0]
        const variableName = nodeDeclaration.id.name
        return {
            isFixable: true,
            name: variableName,
        }
    } else if (node.type === 'FunctionDeclaration') {
        const hasJSXBody = hasSpecificReturnStatement(node, 'JSXElement')
        return {
            isFixable: hasJSXBody,
            name: node.id.name,
        }
    }
}

const properties = {
    type: 'object',
    properties: {
        path: {
            type: 'string',
        },
        excludes: {
            type: 'array',
            items: [
                {
                    type: 'string',
                },
            ],
        },
    },
}

/**
 * @type {import('eslint').Rule.RuleModule}
 */
export default {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Optimization is recommended for svg components.',
            recommended: true,
        },
        fixable: 'code',
        schema: [
            {
                type: 'objects',
                properties: {
                    pathGroups: {
                        type: 'array',
                        items: [properties],
                    },
                    excludes: {
                        type: 'array',
                        items: [{type: 'string'}],
                    },
                },
            },
        ],
    },
    create: function (context) {
        const filenameWithPath = context.filename.replace(context.cwd, '')

        const [filename] = filenameWithPath.split('/').reverse()

        const globalExcludes = context.options[0].excludes || []

        if (globalExcludes.some((excludedPath) => minimatch(filenameWithPath, excludedPath))) {
            return {}
        }

        const pathGroups = context.options[0].pathGroups
        const matchedGroup = pathGroups.find(
            ({path, excludes = []}) => minimatch(filenameWithPath, path) && !excludes.includes(filename),
        )

        if (!matchedGroup) {
            return {}
        }

        const globalScope = context.getScope()
        const sourceCode = context.getSourceCode()
        const canOptimize = svgValidator(context)

        if (!canOptimize) {
            return {}
        }

        return {
            onCodePathEnd: function (codePath, code) {
                try {
                    // 변수타입, 함수타입 모두 GET
                    const node = getTargetNode(code)
                    if (!node) {
                        throw new Error(`${filename} is a component that does not need to be optimized.`)
                    }

                    const {isFixable, name} = prepareMetadata(node)

                    if (isFixable) {
                        const hasHangul = includeHangul(sourceCode, node)
                        // component에 한글 포함 시 최적화 제외
                        if (hasHangul) {
                            context.report({
                                node,
                                message: `${name} contains Hangul in svg code. Optimization is possible only when Hangul is removed.`,
                            })
                            return
                        }

                        context.report({
                            node,
                            message: `${name} is svg component. Optimization is recommended.`,
                            fix: function (fixer) {
                                // svg 구현체
                                const svgNode = getJSXElement(globalScope.block, 'svg')

                                const contents = sourceCode.text // 전체 코드
                                const {svgCode, props, exceptAttr} = parseSvgComponent({contents, globalScope}, name)

                                // jsxElement가 없는 경우 최적화 제외
                                if (!svgCode) {
                                    return null
                                }

                                // 기본 fixer : import문 추가, SVGStyleProps 타입 어노테이션으로 교체
                                const result = [
                                    ...insertCustomImport({
                                        fixer,
                                        scope: globalScope,
                                        context,
                                    }),
                                    ...replacePropsTypeDeclaration({
                                        fixer,
                                        scope: globalScope,
                                    }),
                                ]

                                // svg 최적화
                                const optimizedCodes = svgoOptimize({svgCode, props, exceptAttr})

                                // 최적화 결과로 나온 코드로 교체
                                result.push(fixer.replaceText(svgNode, optimizedCodes))

                                return result
                            },
                        })
                    }
                } catch (error) {
                    context.report(code, error.message)
                }
            },
        }
    },
}
