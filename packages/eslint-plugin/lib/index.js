'use strict'

// import all rules in lib/rules
module.exports.rules = {
    'memo-react-components': require('./rules/memo-react-components'),
    'prevent-default-import': require('./rules/prevent-default-import'),
    'typescript/prevent-default-import': require('./rules/typescript/prevent-default-import'),
    'sort-exports': require('./rules/sort-exports'),
}
