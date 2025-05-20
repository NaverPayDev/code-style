import postcss from 'postcss'
import postcssScss from 'postcss-scss'

import stylelintRule from './src/rules/stylelint'
import stylelintRuleOrder from './src/rules/stylelint-order'
import stylelintRuleSCSS from './src/rules/stylelint-scss'

export default {
    overrides: [
        {
            files: ['**/*.css'],
            customSyntax: {
                parse: postcss.parse,
                stringify: postcss.stringify,
            },
        },
        {
            files: ['**/*.{sass,scss}'],
            customSyntax: postcssScss,
        },
    ],
    plugins: ['stylelint-scss', 'stylelint-order'],
    rules: {
        ...stylelintRule,
        ...stylelintRuleSCSS,
        ...stylelintRuleOrder,
    },
    defaultSeverity: 'warning',
}
