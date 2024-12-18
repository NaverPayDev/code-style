'use strict'

// import all rules in lib/rules
module.exports.rules = {
    'memo-react-components': require('./rules/memo-react-components'),
    'optimize-svg-components': require('./rules/optimize-svg-components'),
    'prevent-default-import': require('./rules/prevent-default-import'),
    /** @deprecated */
    'typescript/prevent-default-import': require('./rules/typescript/prevent-default-import'),
    'sort-exports': require('./rules/sort-exports'),
    'svg-unique-id': require('./rules/svg-unique-id'),
    'import-server-only': require('./rules/import-server-only'),
}
