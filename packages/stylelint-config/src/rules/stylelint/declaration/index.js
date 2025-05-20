export const declaration = {
    'declaration-block-no-duplicate-custom-properties': true,
    'declaration-block-no-duplicate-properties': [
        true,
        {
            ignore: ['consecutive-duplicates-with-different-values'],
        },
    ],
    'declaration-block-no-redundant-longhand-properties': [
        true,
        {
            ignoreShorthands: ['font'],
        },
    ],
    'declaration-block-single-line-max-declarations': 1,
    'declaration-bang-space-after': 'never',
    'declaration-bang-space-before': 'always',
    'declaration-colon-newline-after': 'always-multi-line',
    'declaration-colon-space-after': 'always-single-line',
    'declaration-colon-space-before': 'never',
    'declaration-block-semicolon-newline-after': 'always',
    'declaration-block-semicolon-newline-before': 'never-multi-line',
    'declaration-block-semicolon-space-after': 'always-single-line',
    'declaration-block-semicolon-space-before': 'never',
    'declaration-block-trailing-semicolon': 'always',
    'declaration-empty-line-before': [
        'always',
        {
            except: ['after-declaration', 'first-nested'],
            ignore: ['after-comment', 'inside-single-line-block'],
        },
    ],
}
