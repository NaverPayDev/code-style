const general = require('./general')
const color = require('./color')
const font = require('./font')
const number = require('./number')
const length = require('./length')
const unit = require('./unit')
const string = require('./string')
const declaration = require('./declaration')
const property = require('./property')
const value = require('./value')
const functionRules = require('./function')
const selector = require('./selector')
const atRule = require('./at-rule')
const block = require('./block')
const comment = require('./comment')
const rule = require('./rule')
const mediaFeature = require('./media-feature')

module.exports = {
    ...general,
    ...color,
    ...font,
    ...number,
    ...length,
    ...unit,
    ...string,
    ...declaration,
    ...property,
    ...value,
    ...functionRules,
    ...selector,
    ...atRule,
    ...block,
    ...comment,
    ...rule,
    ...mediaFeature,
}
