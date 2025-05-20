export const atRule = {
    'at-rule-no-unknown': null,
    'at-rule-empty-line-before': [
        'always',
        {
            except: ['after-same-name', 'inside-block'],
            ignore: ['after-comment'],
            ignoreAtRules: ['if', 'else'],
        },
    ],
}
