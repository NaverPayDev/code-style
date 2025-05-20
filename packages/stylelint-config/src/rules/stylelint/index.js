import {atRule} from './at-rule/index.js'
import {block} from './block/index.js'
import {color} from './color/index.js'
import {comment} from './comment/index.js'
import {declaration} from './declaration/index.js'
import {font} from './font/index.js'
import {functionRules} from './function/index.js'
import {general} from './general/index.js'
import {length} from './length/index.js'
import {mediaFeature} from './media-feature/index.js'
import {property} from './property/index.js'
import {rule} from './rule/index.js'
import {selector} from './selector/index.js'
import {string} from './string/index.js'
import {unit} from './unit/index.js'
import {value} from './value/index.js'

export const stylelintRule = {
    ...general,
    ...color,
    ...font,
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
