import importPlugin from 'eslint-plugin-import'
import unusedImports from 'eslint-plugin-unused-imports'

import {importOrder} from '../../custom/index.js'

export default {
    plugins: {import: importPlugin, 'unused-imports': unusedImports},
    rules: {
        /**
         * Enforce a convention in the order of require() / import statements
         * @see https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md
         */
        'import/order': importOrder(),

        /**
         * Disallow unused imports
         * @see https://github.com/sweepline/eslint-plugin-unused-imports/blob/master/docs/rules/no-unused-imports.md
         */
        'unused-imports/no-unused-imports': 'error',
    },
}
