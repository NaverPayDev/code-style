import {commonBaseRules, commonExcludes} from './typescript/naming-convention.js'

export const importOrder = ({ruleSeverities = 'error', pathGroups = []} = {}) => [
    ruleSeverities,
    {
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index', 'type'], //  그룹간 require/import 순서
        alphabetize: {
            order: 'asc', // 그룹 내에 알파벳 순 정렬
            caseInsensitive: true, // 대소문자 구분없음
        },
        pathGroups: [
            {
                pattern: '{next,next/**,react,react-dom}', // framework 경로 처리
                group: 'external',
                position: 'before',
            },
            {
                pattern: '{$*,$*/**}', // $로 시작하는 alias 경로 처리
                group: 'internal',
                position: 'before',
            },
            ...pathGroups,
        ],
        pathGroupsExcludedImportTypes: ['builtin', 'object', 'type'], // pathGroups에서 제외할 group 타입
        'newlines-between': 'always', // 그룹 간에 개행 강제
    },
]

export const typescriptNamingConvention = ({
    ruleSeverities = 'warn',
    customRules = [],
    baseRules = commonBaseRules,
    excludes = commonExcludes,
} = {}) => {
    const customRulesKey = customRules.map(({selector}) => selector)
    const baseRulesExcludeCustomRules = baseRules.filter(({selector}) => !customRulesKey.includes(selector))

    const rules = [...baseRulesExcludeCustomRules, ...customRules]

    const excludedWords = excludes.join('|')
    if (excludedWords) {
        return [
            ruleSeverities,
            ...rules.map((item) => ({
                ...item,
                filter: {
                    regex: `^(${excludedWords})$`,
                    match: false,
                },
            })),
        ]
    }

    return [ruleSeverities, ...rules]
}
