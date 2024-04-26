const {getReactComponentDeclaration, getImportDeclarations} = require('@naverpay/ast-parser')

const ReactComponentDeclarationType = {
    VariableDeclaration: 'VariableDeclaration',
    FunctionDeclaration: 'FunctionDeclaration',
}

const VariableDeclaratorType = {
    CallExpression: 'CallExpression',
    ArrowFunctionExpression: 'ArrowFunctionExpression',
}

/**
 * @see import('estree').ExpressionMap
 */
const CallExpressionArgumentType = {
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
function getRangesOfObjectExpressionAttrs(jsxElement) {
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
function findSpecificImportDeclaration(importDeclarations, {name, from} = {}) {
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
function hasSpecificReturnStatement(functionDeclaration, returnType) {
    return functionDeclaration.body.body.some(
        (item) => item.type === 'ReturnStatement' && item.argument.type === returnType,
    )
}

/**
 *
 * @param {import('eslint').Rule.RuleContext} context
 */
const getCommentsBeforeImportDeclaration = (context, {name, from}) => {
    const globalScope = context.getScope()
    const importDeclarations = getImportDeclarations(globalScope.block)
    const styleImportDeclaration = findSpecificImportDeclaration(importDeclarations, {
        name,
        from,
    })

    const sourceCode = context.getSourceCode()

    if (styleImportDeclaration) {
        return sourceCode.getCommentsBefore(styleImportDeclaration)
    } else {
        sourceCode.getAllComments()
    }
}

/**
 *
 * @param {import('eslint').Rule.RuleContext} context
 */
const getAllComments = (context) => {
    const sourceCode = context.getSourceCode()
    return sourceCode.getAllComments()
}

/**
 *
 * @param {import('@babel/types').Node | undefined} node
 * @returns {import('@babel/types').TSTypeReference | import('@babel/types').TSTypeLiteral | undefined}
 */
const getTypeAnnotation = (node) => {
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
const getJSXReturnStatement = (globalScope) => {
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

module.exports = {
    ReactComponentDeclarationType,
    VariableDeclaratorType,
    CallExpressionArgumentType,
    findSpecificImportDeclaration,
    hasSpecificReturnStatement,
    getCommentsBeforeImportDeclaration,
    getTypeAnnotation,
    getRangesOfObjectExpressionAttrs,
    getJSXReturnStatement,
    getAllComments,
}
