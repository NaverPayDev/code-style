import {getReactComponentDeclaration} from '@naverpay/ast-parser'

export const ReactComponentDeclarationType = {
    VariableDeclaration: 'VariableDeclaration',
    FunctionDeclaration: 'FunctionDeclaration',
}

export const VariableDeclaratorType = {
    CallExpression: 'CallExpression',
    ArrowFunctionExpression: 'ArrowFunctionExpression',
}

/**
 * @see import('estree').ExpressionMap
 */
export const CallExpressionArgumentType = {
    ArrayExpression: 'ArrayExpression',
    ArrowFunctionExpression: 'ArrowFunctionExpression',
    AssignmentExpression: 'AssignmentExpression',
    AwaitExpression: 'AwaitExpression',
    BinaryExpression: 'BinaryExpression',
    CallExpression: 'CallExpression',
    ChainExpression: 'ChainExpression',
    ClassExpression: 'ClassExpression',
    ConditionalExpression: 'ConditionalExpression',
    FunctionExpression: 'FunctionExpression',
    Identifier: 'Identifier',
    ImportExpression: 'ImportExpression',
    Literal: 'Literal',
    LogicalExpression: 'LogicalExpression',
    MemberExpression: 'MemberExpression',
    MetaProperty: 'MetaProperty',
    NewExpression: 'NewExpression',
    ObjectExpression: 'ObjectExpression',
    SequenceExpression: 'SequenceExpression',
    TaggedTemplateExpression: 'TaggedTemplateExpression',
    TemplateLiteral: 'TemplateLiteral',
    ThisExpression: 'ThisExpression',
    UnaryExpression: 'UnaryExpression',
    UpdateExpression: 'UpdateExpression',
    YieldExpression: 'YieldExpression',
}

/**
 * @typedef CallExpressionType
 * @property {import('estree').CallExpression}
 */

/**
 *
 * @param {import('estree-jsx').JSXAttribute[]} attributes
 */
function getObjectExpressionAttrs(attributes) {
    return attributes
        .filter(({value}) => value.type === 'JSXExpressionContainer' && value.expression.type === 'ObjectExpression')
        .map(({name, range}) => [name.name, {range}])
}

/**
 * @param {import('estree-jsx').JSXElement} jsxElement
 * @returns {[string, {range: [number, number]}][]}
 */
export function getRangesOfObjectExpressionAttrs(jsxElement) {
    const {children} = jsxElement

    if (children.length === 0) {
        return []
    }

    /** @constant
    @type {import('estree-jsx').JSXElement[]}
    */
    const jsxChildren = children.filter(({type}) => type === 'JSXElement')

    return jsxChildren
        .map((jsxChild) => [
            ...getObjectExpressionAttrs(jsxChild.openingElement.attributes),
            ...getRangesOfObjectExpressionAttrs(jsxChild),
        ])
        .flat()
}

/**
 *
 * @description from 혹은 import한 모듈명으로 importDeclaration 찾기
 * @param {import('estree').ImportDeclaration[]} importDeclarations
 * @param {{name?: string; from?: string}} param1
 */
export function findSpecificImportDeclaration(importDeclarations, {name, from} = {}) {
    const findName = (specifiers) =>
        specifiers.some(
            ({type, local}) => (type === 'ImportSpecifier' || type === 'ImportDefaultSpecifier') && local.name === name,
        )
    const findFrom = (source) => source.value === from

    return importDeclarations.find(({specifiers, source}) => {
        if (from && name) {
            return findFrom(source) && findName(specifiers)
        } else {
            return (from && findFrom(source)) || (name && findName(specifiers))
        }
    })
}

/**
 *
 * @param {import('estree').FunctionDeclaration} functionDeclaration
 * @param {import('estree').Expression['type']} returnType
 */
export function hasSpecificReturnStatement(functionDeclaration, returnType) {
    return functionDeclaration.body.body.some(
        (item) => item.type === 'ReturnStatement' && item.argument.type === returnType,
    )
}

/**
 *
 * @param {import('eslint').Rule.RuleContext} context
 */
export const getAllComments = (context) => {
    const sourceCode = context.sourceCode ?? context.getSourceCode()
    return sourceCode.getAllComments()
}

/**
 *
 * @param {import('@babel/types').Node | undefined} node
 * @returns {import('@babel/types').TSTypeReference | import('@babel/types').TSTypeLiteral | undefined}
 */
export const getTypeAnnotation = (node) => {
    return node?.typeAnnotation?.typeAnnotation
}

/**
 *
 * @param {import('estree').FunctionExpression | import('estree').FunctionDeclaration | import('estree').ArrowFunctionExpression} functionExpression
 * @returns {import('estree-jsx').JSXElement | undefined}
 */
function getReturnTypeOfFunctionExpression(functionExpression) {
    if (functionExpression.body.type === 'BlockStatement') {
        const argument = functionExpression.body.body.find(
            (statement) => statement.type === 'ReturnStatement' && statement?.argument?.type === 'JSXElement',
        )?.argument

        return argument
    }
}

/**
 *
 * @param {import('estree').ArrowFunctionExpression} arrowFunction
 * @returns {import('estree-jsx').JSXElement | undefined}
 */
function getReturnTypeOfArrowFunction(arrowFunction) {
    const body = arrowFunction.body

    // () => JSX.Element
    if (body.type === 'JSXElement') {
        return body
    }
    // () => { return JSX.Element }
    else if (body.type === 'BlockStatement') {
        return getReturnTypeOfFunctionExpression(arrowFunction)
    }
}

/**
 *
 * @param {import('eslint').Scope.Scope} globalScope
 * @returns {import('estree-jsx').JSXElement | undefined}
 */
export const getJSXReturnStatement = (globalScope) => {
    const componentDeclaration = getReactComponentDeclaration(globalScope.block)

    if (componentDeclaration.type === ReactComponentDeclarationType.FunctionDeclaration) {
        return getReturnTypeOfFunctionExpression(componentDeclaration)
    } else if (componentDeclaration.type === ReactComponentDeclarationType.VariableDeclaration) {
        const variableDeclarator = componentDeclaration.declarations[0].init

        // memo() 된 코드
        if (variableDeclarator.type === VariableDeclaratorType.CallExpression) {
            const callExpressionArgument = variableDeclarator.arguments.find(
                ({type}) =>
                    type === CallExpressionArgumentType.ArrowFunctionExpression ||
                    type === CallExpressionArgumentType.FunctionExpression,
            )
            if (callExpressionArgument) {
                if (callExpressionArgument.type === CallExpressionArgumentType.ArrowFunctionExpression) {
                    return getReturnTypeOfArrowFunction(callExpressionArgument)
                } else if (callExpressionArgument.type === CallExpressionArgumentType.FunctionExpression) {
                    return getReturnTypeOfFunctionExpression(callExpressionArgument)
                }
            }
        }
        // memo() 되지 않은 코드
        else if (variableDeclarator.type === VariableDeclaratorType.ArrowFunctionExpression) {
            return getReturnTypeOfArrowFunction(variableDeclarator)
        }
    }
}

/** node를 순회해서 examine */
export const traverseNode = (node, examine, results) => {
    // 조사할 필요 없는 노드
    if (!node || typeof node !== 'object' || !node.type) {
        return
    }

    // 노드를 조사하는 callback 실행
    const result = examine?.(node)
    if (result) {
        results?.push(result)
    }

    Object.keys(node).forEach((key) => {
        // 부모는 순회하지 않음
        if (key === 'parent') {
            return
        }
        const child = node[key]
        if (Array.isArray(child)) {
            child.forEach((childNode) => traverseNode(childNode, examine, results))
        } else {
            traverseNode(child, examine, results)
        }
    })
}

/** ast의 모든 node를 순회해서 examine */
export const traverseAllNodes = (allNodes, examine) => {
    const results = []

    allNodes.forEach((node) => {
        traverseNode(node, examine, results)
    })

    return results
}
