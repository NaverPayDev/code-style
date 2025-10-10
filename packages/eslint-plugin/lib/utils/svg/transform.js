import {
    getJSXElement,
    getImportDeclarations,
    getReactComponentDeclaration,
    extractComponentProps,
} from '@naverpay/ast-parser'
import {optimize} from 'svgo'

import {numberReplacer} from '../string.js'
import {extractPropsFromLiteralCode, replacePropsWithValueInSvgCode} from './props.js'
import {
    SVG_OPTIMIZE_COMPLETED_COMMENT,
    PROPS_IDENTIFIER_NAME,
    FIRST_RANGE,
    SVG_OPTIMIZED_COMMENT_CONTENT,
} from '../../constants/index.js'
import {
    findSpecificImportDeclaration,
    ReactComponentDeclarationType,
    VariableDeclaratorType,
    getTypeAnnotation,
    getRangesOfObjectExpressionAttrs,
    getAllComments,
} from '../astParser.js'

/**
 * @typedef EslintComponent
 * @property {import('eslint').Rule.RuleFixer} fixer
 * @property {import('eslint').Scope.Scope} scope
 * @property {import('eslint').Rule.RuleContext} context
 */

export const parseSvgComponent = ({contents, globalScope}, componentName) => {
    try {
        // (1) svg html 코드를 ast tree로부터 조회하여 저장
        const jsxElement = getJSXElement(globalScope.block, 'svg')
        if (!jsxElement) {
            return {}
        }

        const objectAttrs = getRangesOfObjectExpressionAttrs(jsxElement)

        const {range} = jsxElement

        // (2) props를 range에 따라 slice하여 <svg>~</svg> 사이의 코드 문자열 저장
        /**
         * @type {string}
         */
        const tmpCode = objectAttrs.reduce((code, [name, {range: attrRange}], index) => {
            const restored = contents.slice(attrRange[0], attrRange[1])
            const from = `${index % 10}`.repeat(attrRange[1] - attrRange[0])
            objectAttrs[index] = [`${name}${index}`, {from, to: `${name}="${name}${index}"`, restored}]

            return code.slice(0, attrRange[0]) + from + code.slice(attrRange[1], code.length)
        }, contents)

        const tmpSvgCode = tmpCode.slice(range[0], range[1])

        const svgCode = objectAttrs.reduce((str, [, {from, to}]) => {
            return str.replace(from, to)
        }, tmpSvgCode)

        // (3) props를 ast tree로부터 extract
        const props = extractComponentProps(globalScope.block)

        // (4) props가 객체가 아닌 'props'라면 svgCode 문자열에서 추출
        if (props === PROPS_IDENTIFIER_NAME) {
            const propsFromSvgCode = extractPropsFromLiteralCode(svgCode)

            // (4)-1. svgCode 문자열에서 props 부분을 최적화 가능한 문자열로 대체
            return {
                svgCode: numberReplacer(replacePropsWithValueInSvgCode(propsFromSvgCode, svgCode)),
                props: propsFromSvgCode,
                exceptAttr: Object.fromEntries(objectAttrs),
            }
        }

        // (5) ast tree로부터 추출한 props로 svgCode 문자열에서 props 부분을 최적화 가능한 문자열로 대체
        return {
            svgCode: numberReplacer(replacePropsWithValueInSvgCode(props, svgCode)),
            props,
            exceptAttr: Object.fromEntries(objectAttrs),
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`[${componentName}] `, error)
        throw error
    }
}

/**
 *
 * @param {EslintComponent} param1
 * @returns {import('eslint').Rule.Fix[]}
 */
export function insertCustomImport({fixer, scope, context}) {
    const comments = getAllComments(context)

    if (comments.some(({value}) => value.includes(SVG_OPTIMIZED_COMMENT_CONTENT))) {
        return []
    }
    const importDeclarations = getImportDeclarations(scope.block)

    const result = []

    const svgStylePropsDeclaration = findSpecificImportDeclaration(importDeclarations, {
        name: 'SVGStyleProps',
    })

    /**
     * @description SVGStyleProps가 이미 import된 경우 제거하고 @naverpay/svg-manager에서 import
     */
    if (svgStylePropsDeclaration) {
        result.push(fixer.remove(svgStylePropsDeclaration))
    }

    const reactImportDeclaration = importDeclarations.find(({source: {value}}) => value === 'react')

    const targetNode = reactImportDeclaration

    const textToInsert = `\n${SVG_OPTIMIZE_COMPLETED_COMMENT}\n${"import type {SVGStyleProps} from '@naverpay/svg-manager'\n"}`

    if (!targetNode) {
        const latestImportDeclarationRange =
            importDeclarations.length > 0
                ? (importDeclarations[importDeclarations.length - 1].range ?? FIRST_RANGE)
                : FIRST_RANGE

        result.push(fixer.insertTextBeforeRange(latestImportDeclarationRange, textToInsert))
    } else {
        result.push(fixer.insertTextAfter(targetNode, textToInsert))
    }

    return result
}

/**
 * @description
 *
 * svgo 플러그인 중, path 요소를 제어하는 플러그인은 과한 최적화 진행하므로 본 플러그인의 의도와 불일치
 *
 * (사전 테스트에서 svg 이모지의 형상이 달라지는 현상 발생)
 *
 * 따라서 path 요소를 제거하는 플러그인을 추가하여, d 속성이 없는 path 요소만을 제거
 */
const removeEmptyPaths = {
    name: 'removeEmptyPaths',
    fn: () => {
        return {
            element: {
                enter: (node, parentNode) => {
                    // path 요소이면서 d 속성이 없거나 빈 경우
                    if (node.name === 'path' && (!node.attributes.d || node.attributes.d.trim() === '')) {
                        // 부모에서 이 노드를 제거
                        parentNode.children = parentNode.children.filter((child) => child !== node)
                    }
                },
            },
        }
    },
}

/**
 * @typedef NextSvgContent
 * @type {object}
 * @property {string} svgCode
 * @property {Object.<string, string | {}>} props
 * @property {Object.<string, {
 * from: string;
 * to: string;
 * restored: string;
 * }>} exceptAttr
 */
/**
 *
 * @param {NextSvgContent} param0
 * @returns {string}
 */
export const svgoOptimize = ({svgCode, props, exceptAttr}) => {
    const {data} = optimize(svgCode, {
        plugins: [
            {
                name: 'removeAttrs',
                active: false,
                params: {
                    attrs: 'g',
                },
            },
            {
                name: 'removeEmptyAttrs',
                active: true,
            },
            {
                name: 'collapseGroups',
                active: true,
            },
            {
                name: 'removeUselessDefs',
                active: false,
            },
            {
                name: 'mergePaths',
                active: true,
            },
            removeEmptyPaths,
        ],
        multipass: false,
    })

    const replaceAttrValues = Object.entries(props).reduce((acc, [key]) => {
        if (key === 'id') {
            return [
                ...acc,
                [new RegExp(`"${key}([-_A-Za-z0-9]+)"`, 'gi'), `{\`\${${key}}$1\`}`],
                [/"url\(#id([-_A-Za-z0-9]*)\)"/gi, `{\`url(#\${${key}}$1)\`}`],
                [new RegExp(`"${key}"`, 'gi'), `{${key}}`],
            ]
        }
        return [...acc, [new RegExp(`"${key}"`, 'gi'), `{${key}}`]]
    }, [])

    const wipStr = replaceAttrValues.reduce((str, [propRegExp, propValue]) => {
        return str.replace(propRegExp, propValue)
    }, data)

    return exceptAttr
        ? Object.entries(exceptAttr).reduce((st, [, {to, restored}]) => st.replace(to, restored), wipStr)
        : wipStr
}

/**
 *
 * @param {EslintComponent} param1
 * @returns {import('eslint').Rule.Fix[]}
 */
export const replacePropsTypeDeclaration = ({fixer, scope}) => {
    const getPropsDeclaration = () => {
        const componentDeclaration = getReactComponentDeclaration(scope.block)

        // const Icon = () => {} or const Icon = memo(() => {})
        if (componentDeclaration.type === ReactComponentDeclarationType.VariableDeclaration) {
            const variableDeclarator = componentDeclaration.declarations[0].init

            // memo() 된 코드
            if (variableDeclarator.type === VariableDeclaratorType.CallExpression) {
                const argument = variableDeclarator.arguments[0]
                const propsDeclaration = argument.params[0]
                return propsDeclaration
            }
            // memo() 되지 않은 코드
            else if (variableDeclarator.type === VariableDeclaratorType.ArrowFunctionExpression) {
                const propsDeclaration = variableDeclarator.params[0]

                return propsDeclaration
            }
        }
        // function(){}
        else if (componentDeclaration.type === ReactComponentDeclarationType.FunctionDeclaration) {
            const propsDeclaration = componentDeclaration.params[0]

            return propsDeclaration
        }
    }
    const propsDeclaration = getPropsDeclaration()

    const typeReference = getTypeAnnotation(propsDeclaration)

    if (
        typeReference &&
        (typeReference.type !== 'TSTypeReference' || typeReference.typeName?.name !== 'SVGStyleProps')
    ) {
        return [fixer.replaceText(typeReference, 'SVGStyleProps')]
    }

    return []
}
