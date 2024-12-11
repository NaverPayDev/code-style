import {describe, test, expect} from 'vitest'
import config from '../node/index.js'
import {checkErrorRule, createLinter} from './utils/index.js'

describe('node', () => {
    describe('object-curly-spacing', function () {
        const ruleId = 'object-curly-spacing'
        const {lintText} = createLinter({ruleId, config})

        test('right', async () => {
            const result = await lintText(`
                const foo = {foo: 'bar'}
            `)

            expect(result).toHaveLength(0)
        })
        test('wrong', async () => {
            const result = await lintText(`
                // disallows spacing inside of braces
                const foo = { foo: 'bar' }
            `)

            expect(checkErrorRule(result, ruleId)).toBe(true)
        })
    })
    describe('quote-props', function () {
        const ruleId = 'quote-props'
        const {lintText} = createLinter({ruleId, config})

        test('right', async () => {
            const result = await lintText(`
                const object = {
                    foo: 'foo',
                    'foo-bar': 'foo-bar',
                }
            `)

            expect(result).toHaveLength(0)
        })
        test('wrong', async () => {
            const result = await lintText(`
                const object = {
                    // ⚠️ Error: Unnecessarily quoted property 'foo' found
                    "foo": 'foo',
                }
            `)

            expect(checkErrorRule(result, ruleId)).toBe(true)
        })
    })
    describe('require-atomic-updates', function () {
        const ruleId = 'require-atomic-updates'
        const {lintText} = createLinter({ruleId, config})

        test('right', async () => {
            const result = await lintText(`
                function* bar() {
                    result += yield
                    result = result + (yield somethingElse)
                    result = result + doSomething(yield somethingElse)
                }
            `)

            expect(result).toHaveLength(0)
        })
    })
    describe('no-unused-vars', function () {
        const ruleId = 'no-unused-vars'
        const {lintText} = createLinter({ruleId, config})

        test('right', async () => {
            const result = await lintText(`
                import any from 'any'
                console.log(any)

                const foo = 'foo'
                console.log(foo)

                const bar = () => {}
                bar()

                // argsIgnorePattern: _
                const baz = (_, _ctx) => {}
                baz()
            `)

            expect(result).toHaveLength(0)
        })
        test('wrong', async () => {
            const result = await lintText(`
                import any from 'any'

                const foo = 'foo'

                const bar = () => {}
            `)

            expect(checkErrorRule(result, ruleId)).toBe(true)
        })
    })
    describe('@naverpay/prevent-default-import', function () {
        const ruleId = '@naverpay/prevent-default-import'
        const {lintText} = createLinter({ruleId, config})

        test('right', async () => {
            const result = await lintText(`
                import {useEffect} from 'react'

                useEffect(() => {

                }, [])
            `)

            expect(result).toHaveLength(0)
        })
        test('wrong', async () => {
            const result = await lintText(`
                import React from 'react'

                React.useEffect(() => {

                }, [])
            `)

            expect(checkErrorRule(result, ruleId)).toBe(true)
        })
    })

    describe('unused-imports/no-unused-importst', function () {
        const ruleId = 'unused-imports/no-unused-importst'
        const {lintText} = createLinter({ruleId, config})

        test('right', async () => {
            const result = await lintText(`
                import {useEffect} from 'react'

                useEffect(() => {

                }, [])
            `)

            expect(result).toHaveLength(0)
        })
        test('wrong', async () => {
            const result = await lintText(`
                import {useEffect} from 'react'
            `)

            expect(checkErrorRule(result, ruleId)).toBe(true)
        })
    })
})
