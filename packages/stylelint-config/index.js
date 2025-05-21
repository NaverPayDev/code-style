import postcss from 'postcss'
import postcssScss from 'postcss-scss'

import {stylelintRule} from './src/rules/stylelint/index.js'
import {stylelintRuleOrder} from './src/rules/stylelint-order/index.js'
import {stylelintRuleSCSS} from './src/rules/stylelint-scss/index.js'

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
        ...stylelintRuleOrder,
        ...stylelintRuleSCSS,
    },
    defaultSeverity: 'warning',
}
