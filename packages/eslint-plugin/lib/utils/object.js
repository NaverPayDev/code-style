export const isEmptyObject = (value) => typeof value === 'object' && !!value && Object.keys(value).length === 0

/**
 *
 * @param {Object} object
 * @param {string} object
 * @returns
 */
export const has = (object, prop) => {
    const hasOwnProperty = Object.prototype.hasOwnProperty

    return object != null && hasOwnProperty.call(object, prop)
}
