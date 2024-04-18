module.exports = {
    'comment-no-empty': true,
    'comment-empty-line-before': [
        'always',
        {
            except: ['first-nested'],
            ignore: ['after-comment', 'stylelint-commands'],
        },
    ],
    'comment-whitespace-inside': 'always',
}
