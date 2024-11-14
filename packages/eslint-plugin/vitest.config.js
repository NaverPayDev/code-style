import {defineProject} from 'vitest/config'

/**
 * @see https://vitest.dev/config/
 */
export default defineProject({
    test: {
        environment: 'node',
        bail: true,
    },
})
