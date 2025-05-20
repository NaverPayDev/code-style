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
            ignoreShorthands: ['font', 'inset', 'background', 'overflow'],
        },
    ],
    'declaration-block-single-line-max-declarations': 1,
    'declaration-empty-line-before': [
        'always',
        {
            except: ['after-declaration', 'first-nested'],
            ignore: ['after-comment', 'inside-single-line-block'],
        },
    ],
}
