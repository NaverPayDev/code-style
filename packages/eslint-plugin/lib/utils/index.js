const {isEmptyObject} = require('./object')
const {isEmptyString} = require('./string')

const isEmpty = (value) => isEmptyString(value) || isEmptyObject(value) || !value

module.exports = {
    isEmpty,
}
