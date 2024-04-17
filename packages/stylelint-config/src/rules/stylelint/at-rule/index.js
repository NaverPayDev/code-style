module.exports = {
    'at-rule-no-unknown': null,
    'at-rule-empty-line-before': [
        'always',
        {
            except: ['after-same-name', 'inside-block'],
            ignore: ['after-comment'],
            ignoreAtRules: ['if', 'else'],
        },
    ],
    'at-rule-name-case': 'lower',
    'at-rule-name-space-after': 'always',
    'at-rule-semicolon-space-before': 'never',
}
