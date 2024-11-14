import {isEmptyObject} from './object'
import {isEmptyString} from './string'

export const isEmpty = (value) => isEmptyString(value) || isEmptyObject(value) || !value
