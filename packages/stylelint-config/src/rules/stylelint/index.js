const atRule = require('./at-rule')
const block = require('./block')
const color = require('./color')
const comment = require('./comment')
const declaration = require('./declaration')
const font = require('./font')
const functionRules = require('./function')
const general = require('./general')
const length = require('./length')
const mediaFeature = require('./media-feature')
const number = require('./number')
const property = require('./property')
const rule = require('./rule')
const selector = require('./selector')
const string = require('./string')
const unit = require('./unit')
const value = require('./value')

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
