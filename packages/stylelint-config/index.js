const postcss = require('postcss')
const postcssScss = require('postcss-scss')

const stylelintRule = require('./src/rules/stylelint')
const stylelintRuleSCSS = require('./src/rules/stylelint-scss')
const stylelintRuleOrder = require('./src/rules/stylelint-order')

module.exports = {
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
