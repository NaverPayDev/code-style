import {getReactComponentDeclaration} from '@naverpay/ast-parser'

import {ReactComponentDeclarationType, VariableDeclaratorType} from '../astParser.js'
import {isStringObject} from '../string.js'

/**
 * @description svgCode에서 React props를 default value로 대체
 * @returns {string}
 */
export const replacePropsWithValue = (code, [propName, propValue]) => {
    // id는 url(#id) || {id} 를 대체
    if (propName === 'id') {
        return code
            .replace(/\{`url\(#\$\{id([0-9]+)?\}([-_A-Za-z0-9]*)\)`\}/gi, `"url(#${propName}$1$2)"`)
            .replace(/\{`\$\{id([0-9]+)?\}([-_a-zA-Z0-9]*)`\}/g, `"${propName}$1$2"`)
            .replace(/\{id([0-9]+)?\}/gi, `"${propName}$1"`)
    }
    // string value는 '{props}'를 대체
    if (typeof propValue === 'string') {
        const propsToReplace = `{(props.)?${propName}([ |]+[a-zA-Z0-9|'"#-_%\` ]+)?}`
        const replacer = new RegExp(propsToReplace, 'gi')
        return code.replace(replacer, `"${propName}"`)
    }
    // string이 아닌 value는 '{props}'를 "props"로 임시 대체
    const propsToReplace = `{(props.)?${propName}([a-zA-Z0-9|'"#-_%{} ]*)}`
    const replacer = new RegExp(propsToReplace, 'gi')
    return code.replace(replacer, `"${propName}"`)
}

const removeExpandProps = (code) => code.replace('{...props}', '')

export const replacePropsWithValueInSvgCode = (props, svgCode) => {
    return removeExpandProps(Object.entries(props).reduce(replacePropsWithValue, svgCode))
}

/**
 * @param {string} svgCode
 * @description props 가 ObjectExpression이 아닌 props 변수명일 때는 svgCode에서 props value를 추출
 * @returns {Record<string, null | string | number | {[key in string]: any}>}
 */
export const extractPropsFromLiteralCode = (svgCode) => {
    const propsToReplace = /(\{props\.?([A-Za-z0-9]+)( \|\| ['"]?([a-zA-Z0-9|#\-_%{};() ]*)['"]?)?\})+/g

    let matches
    const propsMap = new Map()

    while ((matches = propsToReplace.exec(svgCode))) {
        propsMap.set(matches[2], isStringObject(matches[4]) ? JSON.parse(matches[4]) : matches[4])
    }
    const propsFromSvgCode = Object.fromEntries([...propsMap.entries()])

    return propsFromSvgCode
}

const getPropsRange = (propsDeclaration, {defaultPosition}) => {
    if (!propsDeclaration) {
        return defaultPosition
    }

    // ({id = generateRandomString(), width = '100%', style = {stroke: '2px'}}: SVGStyleProps
    if (propsDeclaration.type === 'ObjectPattern') {
        const properties = propsDeclaration.properties

        return properties.pop().range
    }
}

/**
 * @description props의 가장 마지막 property의 range 조회
 * @param {import('eslint').Scope.Scope} globalScope
 * @returns {import('eslint').AST.Range | []}
 */
export const getLatestRangeOfProps = (globalScope) => {
    const componentDeclaration = getReactComponentDeclaration(globalScope.block)

    // const Icon = () => {} or const Icon = memo(() => {})
    if (componentDeclaration.type === ReactComponentDeclarationType.VariableDeclaration) {
        const variableDeclarator = componentDeclaration.declarations[0].init

        // memo() 된 코드
        if (variableDeclarator.type === VariableDeclaratorType.CallExpression) {
            const argument = variableDeclarator.arguments[0]
            const propsDeclaration = argument.params[0]

            return getPropsRange(propsDeclaration, {
                defaultPosition: [], // props가 없는 경우
            })
        }
        // memo() 되지 않은 코드
        else if (variableDeclarator.type === VariableDeclaratorType.ArrowFunctionExpression) {
            const propsDeclaration = variableDeclarator.params[0]

            return getPropsRange(propsDeclaration, {
                defaultPosition: [],
            })
        }
    }
    // function(){}
    else if (componentDeclaration.type === ReactComponentDeclarationType.FunctionDeclaration) {
        const propsDeclaration = componentDeclaration.params[0]

        return getPropsRange(propsDeclaration, {
            defaultPosition: [],
        })
    }

    return null
}
