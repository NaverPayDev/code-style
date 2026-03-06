/**
 * @fileoverview Cognitive Complexity 분석 + 리팩토링 제안을 포함하는 ESLint 룰.
 *
 * SonarSource Cognitive Complexity 스펙 기반.
 * eslint-plugin-sonarjs 호환 모드 (&&만 계산, ||/??/재귀 미계산).
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STRUCTURAL_NODES = new Set([
    'IfStatement',
    'ForStatement',
    'ForInStatement',
    'ForOfStatement',
    'WhileStatement',
    'DoWhileStatement',
    'SwitchStatement',
    'CatchClause',
    'ConditionalExpression',
])

const NESTING_NODES = new Set(STRUCTURAL_NODES)

const INCREASES_NESTING_NODES = new Set(STRUCTURAL_NODES)

const FUNCTION_NODES = new Set(['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression'])

const isFunctionNode = (node) => FUNCTION_NODES.has(node.type)

const isElseIf = (node) =>
    node.type === 'IfStatement' && node.parent?.type === 'IfStatement' && node.parent.alternate === node

const getKindDescription = (node) => {
    switch (node.type) {
        case 'IfStatement':
            return isElseIf(node) ? 'else if' : 'if'
        case 'ForStatement':
            return 'for'
        case 'ForInStatement':
            return 'for-in'
        case 'ForOfStatement':
            return 'for-of'
        case 'WhileStatement':
            return 'while'
        case 'DoWhileStatement':
            return 'do-while'
        case 'SwitchStatement':
            return 'switch'
        case 'CatchClause':
            return 'catch'
        case 'ConditionalExpression':
            return 'ternary'
        default:
            return node.type
    }
}

const toKorean = (description) => {
    switch (description) {
        case 'if':
            return 'if문'
        case 'else if':
            return 'else if문'
        case 'else':
            return 'else문'
        case 'for':
            return 'for문'
        case 'for-in':
            return 'for-in문'
        case 'for-of':
            return 'for-of문'
        case 'while':
            return 'while문'
        case 'do-while':
            return 'do-while문'
        case 'switch':
            return 'switch문'
        case 'catch':
            return 'catch문'
        case 'ternary':
            return '삼항 연산자'
        case 'break to label':
            return '라벨 break문'
        case 'continue to label':
            return '라벨 continue문'
        default:
            if (description.startsWith('logical: ')) return description.slice(9) + ' 연산자'
            return description
    }
}

// ---------------------------------------------------------------------------
// Complexity calculation (ESTree walker)
// ---------------------------------------------------------------------------

/**
 * 주어진 함수 본문의 cognitive complexity를 계산한다.
 * @returns {{ score: number, increments: Array, maxNestingDepth: number }}
 */
const calculateComplexity = (bodyNode) => {
    const increments = []
    let maxNestingDepth = 0

    const walk = (node, nestingLevel) => {
        if (!node || typeof node !== 'object') return
        if (nestingLevel > maxNestingDepth) maxNestingDepth = nestingLevel

        // 중첩 함수는 부모 함수의 복잡도에 기여하지 않음
        if (isFunctionNode(node)) return

        // 논리 연산자 시퀀스 처리
        if (node.type === 'LogicalExpression' && node.operator === '&&') {
            handleLogicalExpression(node, nestingLevel)
            return
        }

        // labeled break/continue
        if ((node.type === 'BreakStatement' || node.type === 'ContinueStatement') && node.label) {
            increments.push({
                line: node.loc.start.line,
                type: 'structural',
                value: 1,
                nestingLevel,
                description: `${node.type === 'BreakStatement' ? 'break' : 'continue'} to label`,
            })
            return
        }

        // 구조적/중첩 증분 노드
        if (STRUCTURAL_NODES.has(node.type)) {
            handleStructuralNode(node, nestingLevel)
            return
        }

        // 그 외 자식 노드 탐색
        walkChildren(node, nestingLevel)
    }

    const walkChildren = (node, nestingLevel) => {
        for (const key of Object.keys(node)) {
            if (key === 'parent') continue
            const child = node[key]
            if (Array.isArray(child)) {
                for (const item of child) {
                    if (item && typeof item.type === 'string') {
                        walk(item, nestingLevel)
                    }
                }
            } else if (child && typeof child === 'object' && typeof child.type === 'string') {
                walk(child, nestingLevel)
            }
        }
    }

    const handleStructuralNode = (node, nestingLevel) => {
        const line = node.loc.start.line

        // else if: structural +1만, nesting 증가 없음
        if (isElseIf(node)) {
            increments.push({line, type: 'structural', value: 1, nestingLevel, description: 'else if'})

            // else if의 else 분기
            if (node.alternate && node.alternate.type !== 'IfStatement') {
                increments.push({
                    line: node.alternate.loc.start.line,
                    type: 'structural',
                    value: 1,
                    nestingLevel,
                    description: 'else',
                })
            }

            // else if의 자식 탐색 (nesting 유지)
            walkIfChildren(node, nestingLevel, true)
            return
        }

        // 일반 structural 노드
        if (nestingLevel > 0 && NESTING_NODES.has(node.type)) {
            increments.push({line, type: 'structural', value: 1, nestingLevel, description: getKindDescription(node)})
            increments.push({
                line,
                type: 'nesting',
                value: nestingLevel,
                nestingLevel,
                description: `${getKindDescription(node)} (nesting: ${nestingLevel})`,
            })
        } else {
            increments.push({line, type: 'structural', value: 1, nestingLevel, description: getKindDescription(node)})
        }

        // else 처리
        if (node.type === 'IfStatement' && node.alternate && node.alternate.type !== 'IfStatement') {
            increments.push({
                line: node.alternate.loc.start.line,
                type: 'structural',
                value: 1,
                nestingLevel,
                description: 'else',
            })
        }

        const nextNesting = INCREASES_NESTING_NODES.has(node.type) ? nestingLevel + 1 : nestingLevel

        if (node.type === 'IfStatement') {
            walkIfChildren(node, nextNesting, false)
        } else {
            walkChildren(node, nextNesting)
        }
    }

    const walkIfChildren = (node, childNesting, isElseIfBranch) => {
        // then 분기
        walk(node.consequent, childNesting)

        // else 분기
        if (node.alternate) {
            if (node.alternate.type === 'IfStatement') {
                // else if 체인: nesting을 올리지 않음
                walk(node.alternate, isElseIfBranch ? childNesting : childNesting - 1)
            } else {
                walk(node.alternate, childNesting)
            }
        }

        // 조건식 (논리 연산자 포함 가능)
        walk(node.test, isElseIfBranch ? childNesting : childNesting - 1)
    }

    /**
     * 논리 연산자 시퀀스 처리.
     * sonarjs 호환: && 만 계산. 같은 연산자 연속은 +1, 다른 연산자로 전환되면 새 +1.
     */
    const handleLogicalExpression = (node, nestingLevel) => {
        const sequences = flattenLogicalExpression(node)

        let lastOperator = null
        for (const seq of sequences) {
            if (seq.operator !== lastOperator) {
                increments.push({
                    line: seq.line,
                    type: 'logical-operator',
                    value: 1,
                    nestingLevel,
                    description: `logical: ${seq.operator}`,
                })
                lastOperator = seq.operator
            }
        }

        // 논리식의 리프 노드들 탐색
        const leaves = collectLogicalLeaves(node)
        for (const leaf of leaves) {
            walk(leaf, nestingLevel)
        }
    }

    const flattenLogicalExpression = (node) => {
        const result = []
        const inner = (n) => {
            if (n.type === 'LogicalExpression' && n.operator === '&&') {
                inner(n.left)
                result.push({operator: n.operator, line: n.loc.start.line})
            } else {
                // 왼쪽이 && 가 아니면 멈춤 — 현재 노드의 연산자만 추가
            }
        }
        inner(node.left)
        result.push({operator: node.operator, line: node.loc.start.line})
        return result
    }

    const collectLogicalLeaves = (node) => {
        const leaves = []
        const inner = (n) => {
            if (n.type === 'LogicalExpression' && n.operator === '&&') {
                inner(n.left)
                inner(n.right)
            } else {
                leaves.push(n)
            }
        }
        inner(node)
        return leaves
    }

    if (bodyNode) {
        if (bodyNode.type === 'BlockStatement') {
            for (const stmt of bodyNode.body) {
                walk(stmt, 0)
            }
        } else {
            // arrow function with expression body
            walk(bodyNode, 0)
        }
    }

    const score = increments.reduce((sum, inc) => sum + inc.value, 0)
    return {score, increments, maxNestingDepth}
}

// ---------------------------------------------------------------------------
// Breakdown (라인별 점수 상세)
// ---------------------------------------------------------------------------

const getBreakdown = (increments) => {
    if (increments.length === 0) return ''

    const byLine = new Map()
    for (const inc of increments) {
        if (!byLine.has(inc.line)) byLine.set(inc.line, [])
        byLine.get(inc.line).push(inc)
    }

    const parts = []
    for (const [line, incs] of [...byLine].sort((a, b) => a[0] - b[0])) {
        const total = incs.reduce((s, i) => s + i.value, 0)
        const nesting = incs.find((i) => i.type === 'nesting')
        const mains = incs.filter((i) => i.type !== 'nesting')
        const kind = mains.map((m) => toKorean(m.description)).join(', ')

        if (nesting) {
            parts.push(`+${total} (L${line}) ${kind} (중첩 ${nesting.value}단계에서 +${nesting.value})`)
        } else {
            parts.push(`+${total} (L${line}) ${kind}`)
        }
    }

    return '\n  점수 상세:\n' + parts.map((p) => `  ${p}`).join('\n')
}

// ---------------------------------------------------------------------------
// Suggestions (6종)
// ---------------------------------------------------------------------------

const TERMINATING_TYPES = new Set(['ReturnStatement', 'ThrowStatement', 'ContinueStatement', 'BreakStatement'])

const endsWithTerminating = (node) => {
    if (!node) return false
    if (TERMINATING_TYPES.has(node.type)) return true
    if (node.type === 'BlockStatement' && node.body.length > 0) {
        return TERMINATING_TYPES.has(node.body[node.body.length - 1].type)
    }
    return false
}

const findMergeableNestedIfs = (bodyNode) => {
    const results = []

    const visit = (node) => {
        if (!node || typeof node !== 'object') return
        if (isFunctionNode(node)) return

        if (
            node.type === 'IfStatement' &&
            !node.alternate &&
            node.consequent?.type === 'BlockStatement' &&
            node.consequent.body.length === 1 &&
            node.consequent.body[0].type === 'IfStatement' &&
            !node.consequent.body[0].alternate
        ) {
            results.push(node.loc.start.line)
        }

        for (const key of Object.keys(node)) {
            if (key === 'parent') continue
            const child = node[key]
            if (Array.isArray(child)) {
                for (const item of child) {
                    if (item && typeof item.type === 'string') visit(item)
                }
            } else if (child && typeof child === 'object' && typeof child.type === 'string') {
                visit(child)
            }
        }
    }

    if (bodyNode) visit(bodyNode)
    return results
}

const findInvertibleIfs = (bodyNode) => {
    const results = []

    const visit = (node) => {
        if (!node || typeof node !== 'object') return
        if (isFunctionNode(node)) return

        if (node.type === 'IfStatement' && node.alternate) {
            if (endsWithTerminating(node.consequent) || endsWithTerminating(node.alternate)) {
                const isElseIfNode = node.parent?.type === 'IfStatement' && node.parent.alternate === node
                if (!isElseIfNode) {
                    results.push(node.loc.start.line)
                }
            }
        }

        for (const key of Object.keys(node)) {
            if (key === 'parent') continue
            const child = node[key]
            if (Array.isArray(child)) {
                for (const item of child) {
                    if (item && typeof item.type === 'string') visit(item)
                }
            } else if (child && typeof child === 'object' && typeof child.type === 'string') {
                visit(child)
            }
        }
    }

    if (bodyNode) visit(bodyNode)
    return results
}

const getSuggestions = (increments, maxNestingDepth, score, lineCount, threshold, bodyNode) => {
    const suggestions = []

    // 1. guard-clause
    if (increments.length >= 2 && increments[0]?.description === 'if') {
        const afterFirst = increments.slice(1)
        const nestedCount = afterFirst.filter((i) => i.nestingLevel >= 1).length
        if (nestedCount > 0 && nestedCount >= afterFirst.length * 0.6) {
            suggestions.push(`L${increments[0].line}의 초기 조건을 반전시키고 조기 반환(guard clause)하세요`)
        }
    }

    // 2. extract-function (deep nesting)
    if (maxNestingDepth >= 3) {
        const deepIncrements = increments.filter((i) => i.nestingLevel >= 3)
        const deepLines = [...new Set(deepIncrements.map((i) => i.line))].sort((a, b) => a - b)
        const lineRef = deepLines.length > 0 ? deepLines.map((l) => `L${l}`).join(', ') : ''
        const prefix = lineRef ? `${lineRef}에서 ` : ''
        suggestions.push(`${prefix}중첩 깊이 ${maxNestingDepth}단계. 이 블록을 별도 함수로 추출하세요`)
    }

    // 3. extract-boolean
    const logicalOps = increments.filter((i) => i.type === 'logical-operator')
    if (logicalOps.length >= 2) {
        const logicalLines = [...new Set(logicalOps.map((i) => i.line))].sort((a, b) => a - b)
        const lineRef = logicalLines.map((l) => `L${l}`).join(', ')
        suggestions.push(`${lineRef}에 논리 연산자 ${logicalOps.length}개. 복잡한 조건을 이름 있는 변수로 추출하세요`)
    }

    // 4. split-function
    if (lineCount >= 30 && score >= threshold) {
        suggestions.push(`함수가 ${lineCount}줄이며 복잡도가 ${score}입니다. 더 작은 함수로 분리하세요`)
    }

    // 5. merge-nested-if
    const mergeableLines = findMergeableNestedIfs(bodyNode)
    if (mergeableLines.length > 0) {
        const lineRef = mergeableLines.map((l) => `L${l}`).join(', ')
        suggestions.push(`${lineRef}의 중첩 if문을 && 조건으로 병합하여 중첩을 줄이세요`)
    }

    // 6. invert-if-to-reduce-nesting
    const invertibleLines = findInvertibleIfs(bodyNode)
    if (invertibleLines.length > 0) {
        const lineRef = invertibleLines.map((l) => `L${l}`).join(', ')
        suggestions.push(
            `${lineRef}의 if-else에서 한 분기가 return/throw로 끝납니다. 조건을 반전시키고 else를 제거하여 중첩을 줄이세요`,
        )
    }

    return suggestions
}

// ---------------------------------------------------------------------------
// Function name extraction
// ---------------------------------------------------------------------------

const getFunctionName = (node) => {
    // function foo() {}
    if (node.id) return node.id.name

    const {parent} = node
    if (!parent) return '<anonymous>'

    // const foo = () => {} / const foo = function() {}
    if (parent.type === 'VariableDeclarator' && parent.id) {
        return parent.id.name
    }

    // { foo: () => {} }
    if (parent.type === 'Property' && parent.key) {
        return parent.key.name || parent.key.value || '<anonymous>'
    }

    // class method: MethodDefinition
    if (parent.type === 'MethodDefinition' && parent.key) {
        const methodName = parent.key.name || parent.key.value || 'anonymous'
        const classNode = parent.parent?.parent
        const className =
            classNode && (classNode.type === 'ClassDeclaration' || classNode.type === 'ClassExpression') && classNode.id
                ? classNode.id.name
                : null
        return className ? `${className}.${methodName}` : methodName
    }

    // class property: PropertyDefinition
    if (parent.type === 'PropertyDefinition' && parent.key) {
        const propName = parent.key.name || parent.key.value || 'anonymous'
        const classNode = parent.parent?.parent
        const className =
            classNode && (classNode.type === 'ClassDeclaration' || classNode.type === 'ClassExpression') && classNode.id
                ? classNode.id.name
                : null
        return className ? `${className}.${propName}` : propName
    }

    return '<anonymous>'
}

// ---------------------------------------------------------------------------
// Rule
// ---------------------------------------------------------------------------

/**
 * @type {import('eslint').Rule.RuleModule}
 */
export default {
    meta: {
        type: 'suggestion',
        docs: {
            description: '함수의 Cognitive Complexity가 임계값을 초과하면 리팩토링 제안을 포함하여 보고합니다.',
            recommended: false,
        },
        schema: [
            {
                type: 'integer',
                minimum: 0,
                default: 15,
            },
            {
                type: 'object',
                properties: {
                    suggestions: {
                        type: 'boolean',
                        default: false,
                    },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            complexFunction:
                "'{{name}}'의 Cognitive Complexity가 {{score}}입니다 (허용: {{threshold}}).{{breakdown}}{{suggestions}}",
        },
    },
    create(context) {
        const threshold = context.options[0] ?? 15
        const showSuggestions = context.options[1]?.suggestions ?? false

        const checkFunction = (node) => {
            const name = getFunctionName(node)
            const body = node.body
            const {score, increments, maxNestingDepth} = calculateComplexity(body)

            if (score > threshold) {
                const startLine = node.loc.start.line
                const endLine = node.loc.end.line
                const lineCount = endLine - startLine + 1

                const breakdownText = getBreakdown(increments)
                let suggestionsText = ''
                if (showSuggestions) {
                    const suggestions = getSuggestions(increments, maxNestingDepth, score, lineCount, threshold, body)
                    suggestionsText =
                        suggestions.length > 0 ? '\n  제안:\n' + suggestions.map((s) => `  - ${s}`).join('\n') : ''
                }

                context.report({
                    node,
                    messageId: 'complexFunction',
                    data: {
                        name,
                        score: String(score),
                        threshold: String(threshold),
                        breakdown: breakdownText,
                        suggestions: suggestionsText,
                    },
                })
            }
        }

        return {
            FunctionDeclaration: checkFunction,
            FunctionExpression: checkFunction,
            ArrowFunctionExpression: checkFunction,
        }
    },
}
