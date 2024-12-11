import importPlugin from 'eslint-plugin-import'
import {describe, test, expect} from 'vitest'

import {importOrder} from '../custom/index.js'
import {checkErrorRule, createLinter} from './utils/index.js'

describe('custom', () => {
    describe('import/order', function () {
        const ruleId = 'import/order'
        const config = {
            plugins: {
                import: importPlugin,
            },
            rules: {
                'import/order': importOrder({
                    ruleSeverities: 'warn',
                    pathGroups: [
                        {
                            pattern: '{@scope1/**,@scope2/**}',
                            group: 'external',
                            position: 'after',
                        },
                    ],
                }),
            },
        }
        const {lintText} = createLinter({ruleId, config})

        test('right', async () => {
            const result = await lintText(`
                import React, {QuoteHTMLAttributes} from 'react'

                import {B} from '@scope/utils'
                import A from 'query-string'

                import utils1 from '@scope1/utils'
                import utils2 from '@scope2/utils'

                import alias from '$libs/utils'

                import any from './any'
            `)

            expect(result).toHaveLength(0)
        })

        test('wrong', async () => {
            const result = await lintText(`
                import React, {QuoteHTMLAttributes} from 'react'

                import utils1 from '@scope1/utils'
                import utils2 from '@scope2/utils'
                import {B} from '@scope/utils'
                import A from 'query-string'

                import alias from '$libs/utilss'

                import any from './any'
            `)

            expect(checkErrorRule(result, ruleId)).toBe(true)
        })
    })
})
