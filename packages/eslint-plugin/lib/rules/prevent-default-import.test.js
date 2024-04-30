const {RuleTester} = require('eslint')
RuleTester.setDefaultConfig({
    parserOptions: {
        ecmaVersion: 2023,
        sourceType: 'module',
    },
})

const rule = require('./prevent-default-import')
const ruleTester = new RuleTester()

describe('remove-default-import', () => {
    ruleTester.run('remove-default-import', rule, {
        valid: [
            {
                code: `
                        import {useEffect} from 'react'
                        import {eq} from 'lodash'
                      `,
                options: [{packages: ['react', 'lodash']}],
            },
        ],
        invalid: [
            {
                // DefaultSpecifier 사용처가 없고
                // ImportSpecifier가 없는 경우
                code: `import React from 'react'`,
                options: [{packages: ['react']}],
                errors: [
                    {
                        message: "'react' should use named import instead of default import.",
                    },
                ],
                output: ``,
            },
            {
                // DefaultSpecifier 사용처가 없고
                // ImportSpecifier는 있는 경우
                code: `
                import React, {useEffect, useCallback} from 'react'

                useEffect(() => {}, [])
                useCallback(() => {}, [])
                `,
                options: [{packages: ['react']}],
                errors: [
                    {
                        message: "'React' is not being used.",
                    },
                ],
                output: `
                import {useEffect, useCallback} from 'react'

                useEffect(() => {}, [])
                useCallback(() => {}, [])
                `,
            },
            {
                // DefaultSpecifier를 현재 MemberExpression 외에서 사용하고 있을 경우
                // 이미 ImportSpecifier가 있다면 안에 추가
                code: `
                import React, {memo} from 'react'

                React.useEffect
                React.useCallback
                memo
                `,
                options: [{packages: ['react']}],
                errors: [
                    {
                        message: "'React.useEffect' should be used as 'useEffect'",
                    },
                    {
                        message: "'React.useCallback' should be used as 'useCallback'",
                    },
                ],
                output: `
                import React, {memo, useEffect} from 'react'

                useEffect
                React.useCallback
                memo
                `,
            },
            {
                // DefaultSpecifier를 현재 MemberExpression 외에서 사용하고 있을 경우
                // 이전에 ImportSpecifier가 없었다면
                code: `
                import React from 'react'

                React.useEffect
                React.useCallback
                `,
                options: [{packages: ['react']}],
                errors: [
                    {
                        message: "'React.useEffect' should be used as 'useEffect'",
                    },
                    {
                        message: "'React.useCallback' should be used as 'useCallback'",
                    },
                ],
                output: `
                import React, {useEffect} from 'react'

                useEffect
                React.useCallback
                `,
            },
            {
                // DefaultSpecifier를 현재 MemberExpression 외에서 사용하지 않는 경우
                // 이미 ImportSpecifier가 있다면 안에 추가
                code: `
                import React, {memo} from 'react'

                React.useEffect
                memo
                `,
                options: [{packages: ['react']}],
                errors: [
                    {
                        message: "'React.useEffect' should be used as 'useEffect'",
                    },
                ],
                output: `
                import {memo, useEffect} from 'react'

                useEffect
                memo
                `,
            },
            {
                // DefaultSpecifier를 현재 MemberExpression 외에서 사용하지 않는 경우
                // ImportSpecifier가 없으면 새로 추가
                code: `
                import React from 'react'

                React.useEffect
                `,
                options: [{packages: ['react']}],
                errors: [
                    {
                        message: "'React.useEffect' should be used as 'useEffect'",
                    },
                ],
                output: `
                import {useEffect} from 'react'

                useEffect
                `,
            },
            {
                code: `
                import React from 'react'

                React.useEffect(() => {
                    console.log(data)
                }, [data])
                `,
                options: [{packages: ['react']}],
                errors: [
                    {
                        message: "'React.useEffect' should be used as 'useEffect'",
                    },
                ],
                output: `
                import {useEffect} from 'react'

                useEffect(() => {
                    console.log(data)
                }, [data])
                `,
            },
            {
                code: `
                import React from 'react'
                import lodash from 'lodash'

                React.useCallback(() => {}, [])
                lodash.eq()
                `,
                options: [{packages: ['react', 'lodash']}],
                errors: [
                    {
                        message: "'React.useCallback' should be used as 'useCallback'",
                    },
                    {
                        message: "'lodash.eq' should be used as 'eq'",
                    },
                ],
                output: `
                import {useCallback} from 'react'
                import lodash from 'lodash'

                useCallback(() => {}, [])
                lodash.eq()
                `,
            },
            {
                code: `
                import React, {useEffect} from 'react'

                React.useEffect(() => {}, [])
                useEffect(() => {}, [])
                `,
                options: [{packages: ['react', 'lodash']}],
                errors: [
                    {
                        message: "'React.useEffect' should be used as 'useEffect'",
                    },
                ],
                output: `
                import {useEffect} from 'react'

                useEffect(() => {}, [])
                useEffect(() => {}, [])
                `,
            },
            {
                code: `
                import React, {useEffect} from 'react'

                React.useEffect(() => {}, [])
                React.useEffect(() => {}, [])
                useEffect(() => {}, [])
                `,
                options: [{packages: ['react', 'lodash']}],
                errors: [
                    {
                        message: "'React.useEffect' should be used as 'useEffect'",
                    },
                    {
                        message: "'React.useEffect' should be used as 'useEffect'",
                    },
                ],
                output: `
                import React, {useEffect} from 'react'

                useEffect(() => {}, [])
                useEffect(() => {}, [])
                useEffect(() => {}, [])
                `,
            },
        ],
    })
})
