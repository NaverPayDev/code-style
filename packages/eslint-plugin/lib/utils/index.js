import {isEmptyObject} from './object.js'
import {isEmptyString} from './string.js'

export const isEmpty = (value) => isEmptyString(value) || isEmptyObject(value) || !value
