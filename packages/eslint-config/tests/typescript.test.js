import {describe, test, expect} from 'vitest'

import config from '../typescript/index.js'
import {checkErrorRule, createLinter} from './utils/index.js'

describe('typescript', () => {
    describe('import/order', function () {
        const ruleId = 'import/order'
        const {lintText} = createLinter({ruleId, config})

        test('right', async () => {
            const result = await lintText(`
                // builtin
                import fs from 'fs'
                import path from 'path'

                // framework
                import {GetServerSideProps} from 'next'
                import Router, {RouterEvent} from 'next/router'
                import react from 'react'
                import reactDOM from 'react-dom'

                // external
                import utils from '@scope/utils'
                import nextThirdParty from 'next-third-party'
                import {isMobileSafari} from 'react-third-party'

                // alias
                import config from '$config'
                import {WEB_VIEW_CLOSE_URL} from '$constants/common'

                // relative path(parent,sibling)
                import parentA from '../parentA'
                import parentB from '../parentB'
                import sibling from './sibling'

                // relative path(index)
                import index from './'

                // type
                import type {AxiosHeaders} from 'axios'
                import type {GetServerSideProps} from 'next'
                import type {RouterEvent} from 'next/router'
                import type {SyntheticEvent} from 'react'
            `)

            expect(result).toHaveLength(0)
        })
        test('wrong', async () => {
            const result = await lintText(`
                // external
                import config from '$config'
                import nextThirdParty from 'next-third-party'
                import {isMobileSafari} from 'react-third-party'

                // type
                import type {AxiosHeaders} from 'axios'
                import type {GetServerSideProps} from 'next'
                import type {RouterEvent} from 'next/router'
                import type {SyntheticEvent} from 'react'

                // alias
                import utils from '@scope/utils'
                import {WEB_VIEW_CLOSE_URL} from '$constants/common'
                // ⚠️ Error: '$config' import should occur before import of 'axios'

                // relative path(parent,sibling)
                import parentA from '../parentA'
                import parentB from '../parentB'
                import sibling from './sibling'
                // ⚠️ Error: '../parentA' import should occur before import of 'axios'

                // relative path(index)
                import index from './'
                // ⚠️ Error: './' import should occur before import of 'axios'

                // framework
                import {GetServerSideProps} from 'next'
                import Router, {RouterEvent} from 'next/router'
                import react from 'react'
                import reactDOM from 'react-dom'
                // ⚠️ Error: 'next' import should occur before import of 'axios'

                // builtin
                import fs from 'fs'
                import path from 'path'
                // ⚠️ Error: 'fs' import should occur before import of 'axios'
            `)

            expect(checkErrorRule(result, ruleId)).toBe(true)
        })
    })
    describe('@typescript-eslint/no-unused-vars', function () {
        const ruleId = '@typescript-eslint/no-unused-vars'
        const {lintText} = createLinter({ruleId, config})

        test('right', async () => {
            const result = await lintText(`
                import react from 'react'
                console.log(react)

                const foo = 'foo'
                console.log(foo)

                const bar = () => {}
                bar()

                // argsIgnorePattern: _
                const baz = (_) => {}
                baz('')

                // 'a' was ignored because they have a rest property sibling.
                const data = {a: 'a', b: 'b'};
                const { a, ...rests } = data;
                console.log(rests)
            `)

            expect(result).toHaveLength(0)
        })
        test('wrong', async () => {
            const result = await lintText(`
                const foo = 'foo'

                const bar = () => {}

                const {a, b} = {a: 'a', b: 'b'}
            `)

            expect(checkErrorRule(result, ruleId)).toBe(true)
        })
    })
    describe('no-undef', function () {
        const ruleId = 'no-undef'
        const {lintText} = createLinter({ruleId, config})

        test('right', async () => {
            const result = await lintText(`
                import react from 'react'
                console.log(react)
            `)

            expect(result).toHaveLength(0)
        })
        test('wrong', async () => {
            const result = await lintText(`
                console.log(react)
            `)

            expect(checkErrorRule(result, ruleId)).toBe(true)
        })
    })
    describe('@naverpay/prevent-default-import', function () {
        const ruleId = '@naverpay/prevent-default-import'
        const {lintText} = createLinter({ruleId, config})

        test('right', async () => {
            const result = await lintText(`
                import {useEffect, ReactNode} from 'react'

                const node: ReactNode | null = null

                useEffect(() => {

                }, [])
            `)

            expect(result).toHaveLength(0)
        })
        test('wrong', async () => {
            const result = await lintText(`
                import React from 'react'

                const node: React.ReactNode | null = null

                React.useEffect(() => {

                }, [])
            `)

            expect(checkErrorRule(result, ruleId)).toBe(true)
        })
    })
    describe('@typescript-eslint/consistent-type-imports', function () {
        const ruleId = '@typescript-eslint/consistent-type-imports'
        const {lintText} = createLinter({ruleId, config})

        test('right', async () => {
            const result = await lintText(`
                import type {ReactNode} from 'react'

                const node: ReactNode | null = null
            `)

            expect(result).toHaveLength(0)
        })
        test('wrong', async () => {
            const result = await lintText(`
                import {ReactNode} from 'react'

                const node: ReactNode | null = null
            `)

            expect(checkErrorRule(result, ruleId)).toBe(true)
        })
    })
})
