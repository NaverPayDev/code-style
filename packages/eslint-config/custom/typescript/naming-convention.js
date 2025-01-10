export const commonExcludes = ['_*', '__html', 'Component']

export const commonBaseRules = [
    {
        selector: 'default',
        format: ['camelCase'],
    },
    {
        selector: 'import',
        format: ['camelCase', 'PascalCase'],
    },
    {
        selector: 'enumMember',
        format: ['UPPER_CASE', 'PascalCase'],
    },
    {
        selector: 'method',
        format: ['camelCase'],
    },
    {
        selector: 'typeLike',
        format: ['PascalCase'],
    },
    {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
    },
    {
        selector: 'parameter',
        format: ['camelCase', 'PascalCase'],
        leadingUnderscore: 'allow',
    },
    {
        selector: 'classProperty',
        format: ['camelCase'],
    },
    {
        selector: 'classProperty',
        modifiers: ['private'],
        format: ['camelCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow',
    },
    {
        selector: 'objectLiteralProperty',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
    },
    {
        selector: 'typeProperty',
        format: ['camelCase'],
    },
    {
        selector: 'function',
        format: ['camelCase', 'PascalCase'],
    },
    {
        selector: [
            'classProperty',
            'objectLiteralProperty',
            'typeProperty',
            'classMethod',
            'objectLiteralMethod',
            'typeMethod',
            'accessor',
            'enumMember',
        ],
        format: null,
        modifiers: ['requiresQuotes'],
    },
]
