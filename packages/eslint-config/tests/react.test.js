import {describe, test, expect} from 'vitest'

import config from '../react/index.js'
import {checkErrorRule, createLinter} from './utils/index.js'

describe('front', () => {
    describe('jsx-a11y/alt-text', function () {
        const ruleId = 'jsx-a11y/alt-text'
        const {lintText} = createLinter({ruleId, config})

        test('right', async () => {
            const result = await lintText(`
                const Component = () => <img src="foo.jpg" alt="foo" />
            `)

            expect(result).toHaveLength(0)
        })
        test('wrong', async () => {
            const result = await lintText(`
                const Component = () => <img src="foo.jpg" />
                // ⚠️ Error: img elements must have an alt prop, either with meaningful text,
                // or an empty string for decorative images.
            `)

            expect(checkErrorRule(result, ruleId)).toBe(true)
        })
    })
    describe('jsx-a11y/click-events-have-key-events', function () {
        const ruleId = 'jsx-a11y/click-events-have-key-events'
        const {lintText} = createLinter({ruleId, config})

        test('right', async () => {
            const result = await lintText(`
                const Component = () => <div onClick={() => {}} />
            `)

            expect(result).toHaveLength(0)
        })
    })
    describe('jsx-a11y/label-has-associated-control', function () {
        const ruleId = 'jsx-a11y/label-has-associated-control'
        const {lintText} = createLinter({ruleId, config})

        test('right', async () => {
            const result = await lintText(`
                const Component = () => (
                    <>
                        <label>
                            Surname
                            <input type="text" />
                        </label>

                        <label htmlFor={domId}>Surname</label>
                        <input type="text" id={domId} />
                    </>
                )
            `)

            expect(result).toHaveLength(0)
        })
        test('wrong', async () => {
            const result = await lintText(`
                const Component = () => (
                    <>
                        {/* ⚠️ Error: A form label must be associated with a control */}
                        <label>Surname</label>
                        <input type="text" />
                    </>
                )
            `)

            expect(checkErrorRule(result, ruleId)).toBe(true)
        })
    })
    describe('jsx-a11y/no-noninteractive-element-interactions', function () {
        const ruleId = 'jsx-a11y/no-noninteractive-element-interactions'
        const {lintText} = createLinter({ruleId, config})

        test('right', async () => {
            const result = await lintText(`
                export default function Foo() {
                    // Non-interactive elements assigned mouse or keyboard event listeners
                    return <div onClick={() => undefined} role="listitem" />
                }
            `)

            expect(result).toHaveLength(0)
        })
    })
    describe('jsx-a11y/no-static-element-interactions', function () {
        const ruleId = 'jsx-a11y/no-static-element-interactions'
        const {lintText} = createLinter({ruleId, config})

        test('right', async () => {
            const result = await lintText(`
                export default function Foo() {
                    // Static HTML elements with event handlers without role
                    return <div onClick={() => {}} />
                }
            `)

            expect(result).toHaveLength(0)
        })
    })
    describe('react/jsx-handler-names', function () {
        const ruleId = 'react/jsx-handler-names'
        const {lintText} = createLinter({ruleId, config})

        test('right', async () => {
            const result = await lintText(`
                // handler name
                const Component1 = (onClick) => <div onClick={onClick} />
                const Component2 = (handleClick) => <div onClick={handleClick} />
                // props key
                const Component3 = (onClick) => <div handleClick={onClick} />
                const Component4 = (onClick) => <div handleClick={onClick} />

                // noCheckInlineFunction
                const Component5 = () => <div onClick={(event) => window.alert(event.target.value)}></div>
            `)

            expect(result).toHaveLength(0)
        })
        test('wrong', async () => {
            const result = await lintText(`
                const ChildComponent = () => {}
                const handleClick = () => {}

                const Component1 = (justClick) => <div onClick={justClick} />
                const Component2 = () => <ChildComponent justClick={handleClick} />
            `)

            expect(checkErrorRule(result, ruleId)).toBe(true)
        })
    })
    describe('react/display-name', function () {
        const ruleId = 'react/display-name'
        const {lintText} = createLinter({ruleId, config})

        test('right', async () => {
            const result = await lintText(`
                import {createReactClass} from 'react'
                createReactClass({
                    // displayName: 'Hello',
                    render: function () {
                        return <div>Hello {this.props.name}</div>
                    },
                })
            `)

            expect(result).toHaveLength(0)
        })
    })
    describe('react/jsx-sort-props', function () {
        const ruleId = 'react/jsx-sort-props'
        const {lintText} = createLinter({ruleId, config})

        test('right', async () => {
            const result = await lintText(`
                const Component = () => (
                    <div
                        // reservedFirst
                        ref={ref}
                        key="key"
                        // noSortAlphabetically
                        c={c}
                        b={b}
                        a={a}
                        showPrevButton={page > 1}
                        onClickPrevButton={() => handlePage(page - 1)}
                        showNextButton={page < totalPage}
                        onClickNextButton={() => handlePage(page + 1)}
                    />
                )
            `)

            expect(result).toHaveLength(0)
        })
        test('wrong', async () => {
            const result = await lintText(`
                const Component = () => (
                    <div
                        // noSortAlphabetically
                        c={c}
                        b={b}
                        a={a}
                        // reservedFirst
                        ref={ref}
                        key="key"
                        // ⚠️ Error: Reserved props must be listed before all other props
                        showPrevButton={page > 1}
                        onClickPrevButton={() => handlePage(page - 1)}
                        showNextButton={page < totalPage}
                        onClickNextButton={() => handlePage(page + 1)}
                    />
                )
            `)

            expect(checkErrorRule(result, ruleId)).toBe(true)
        })
    })
    describe('react/no-array-index-key', function () {
        const ruleId = 'react/no-array-index-key'
        const {lintText} = createLinter({ruleId, config})

        test('right', async () => {
            const result = await lintText(`
                const Component = () => (
                    <>
                        {[1, 2, 3].map((item, index) => (
                            <div key={index}>{item}</div>
                        ))}
                    </>
                )
            `)

            expect(result).toHaveLength(0)
        })
    })
    describe('react/prop-types', function () {
        const ruleId = 'react/prop-types'
        const {lintText} = createLinter({ruleId, config})

        test('right', async () => {
            const result = await lintText(`
                createReactClass({
                    propTypes: {
                        firstname: PropTypes.string.isRequired,
                    },
                    render: function () {
                        return (
                            <div>
                                Hello {this.props.firstname} {this.props.lastname}
                            </div>
                        )
                        // 'lastname' type is missing in props validation
                    },
                })
            `)

            expect(result).toHaveLength(0)
        })
    })
    describe('react/state-in-constructor', function () {
        const ruleId = 'react/state-in-constructor'
        const {lintText} = createLinter({ruleId, config})

        test('right', async () => {
            const result = await lintText(`
                class Foo extends React.Component {
                    // state not in constructor
                    state = {bar: 0}

                    render() {
                        return <div>Foo</div>
                    }
                }
            `)

            expect(result).toHaveLength(0)
        })
    })
    describe('react/static-property-placement', function () {
        const ruleId = 'react/static-property-placement'
        const {lintText} = createLinter({ruleId, config})

        test('right', async () => {
            const result = await lintText(`
                import React from 'react'

                class Foo extends React.Component {
                    static get staticProperty() {
                        return 'Foo'
                    }
                }

                // declaring any of the above properties outside of the class
                Foo.staticProperty = 'Foo'
            `)

            expect(result).toHaveLength(0)
        })
    })
    describe('react-hooks/exhaustive-deps', function () {
        const ruleId = 'react-hooks/exhaustive-deps'
        const {lintText} = createLinter({ruleId, config})

        test('right', async () => {
            const result = await lintText(`
                import {useCallback} from 'react'

                export function Component(props) {
                    useCallback(() => {
                        console.log(props.foo)
                        console.log(props.bar)
                    }, [props.foo, props.bar])
                }
            `)

            expect(result).toHaveLength(0)
        })
        test('wrong', async () => {
            const result = await lintText(`
                import {useCallback} from 'react'

                export function Component(props) {
                    useCallback(() => {
                        console.log(props.foo)
                        console.log(props.bar)
                        // React Hook useCallback has missing dependencies:
                        // 'props.bar' and 'props.foo'. Either include them or remove the dependency array.
                    }, [])
                }
            `)

            expect(checkErrorRule(result, ruleId)).toBe(true)
        })
    })
    describe('curly', function () {
        const ruleId = 'curly'
        const {lintText} = createLinter({ruleId, config})

        test('right', async () => {
            const result = await lintText(`
                if (foo) {
                    foo++
                }

                while (bar) {
                    baz()
                }

                if (foo) {
                    baz()
                } else {
                    qux()
                }
            `)

            expect(result).toHaveLength(0)
        })
        test('wrong', async () => {
            const result = await lintText(`
                if (foo) foo++

                while (bar)
                    baz()

                if (foo) {
                    baz()
                } else qux()
            `)

            expect(checkErrorRule(result, ruleId)).toBe(true)
        })
    })
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
            `)

            expect(result).toHaveLength(0)
        })
        test('wrong', async () => {
            const result = await lintText(`
                // builtin
                import fs from 'fs'
                import path from 'path'

                // external
                import utils from '@scope/utils'
                import nextThirdParty from 'next-third-party'
                import {isMobileSafari} from 'react-third-party'

                // framework
                import {GetServerSideProps} from 'next'
                import Router, {RouterEvent} from 'next/router'
                import react from 'react'
                import reactDOM from 'react-dom'

                // relative path(index)
                import index from './'
                // ⚠️ Error: './' import should occur after import of '$constants/common'

                // relative path(parent,sibling)
                import parentB from '../parentB'
                import parentA from '../parentA'
                // ⚠️ Error: '../parentA' import should occur before import of '../parentB'

                // alias
                import config from '$config'
                import {WEB_VIEW_CLOSE_URL} from '$constants/common'
                // ⚠️ Error:  './' import should occur after import of '$constants/common'
            `)

            expect(checkErrorRule(result, ruleId)).toBe(true)
        })
    })
    describe('no-restricted-imports', function () {
        const ruleId = 'no-restricted-imports'
        const {lintText} = createLinter({ruleId, config})

        test('right', async () => {
            const result = await lintText(`
               import lodash from 'lodash/fp'
            `)

            expect(result).toHaveLength(0)
        })
        test('wrong', async () => {
            const result = await lintText(`
                import lodash from 'lodash'
            `)

            expect(checkErrorRule(result, ruleId)).toBe(true)
        })
    })
    describe('consistent-return', function () {
        const ruleId = 'consistent-return'
        const {lintText} = createLinter({ruleId, config})

        test('right', async () => {
            const result = await lintText(`
                function doSomething(condition) {
                    if (condition) {
                        return true
                    }
                }
            `)

            expect(result).toHaveLength(0)
        })
    })
    describe('import/prefer-default-export', function () {
        const ruleId = 'import/prefer-default-export'
        const {lintText} = createLinter({ruleId, config})

        test('right', async () => {
            const result = await lintText(`
                // single export
                export const foo = 'foo'
            `)

            expect(result).toHaveLength(0)
        })
    })
    describe('node/no-callback-literal', function () {
        const ruleId = 'node/no-callback-literal'
        const {lintText} = createLinter({ruleId, config})

        test('right', async () => {
            const result = await lintText(`
                cb('this is an error string')
                cb({a: 1})
                callback(0)
            `)

            expect(result).toHaveLength(0)
        })
    })
    describe('no-lonely-if', function () {
        const ruleId = 'no-lonely-if'
        const {lintText} = createLinter({ruleId, config})

        test('right', async () => {
            const result = await lintText(`
                if (condition) {
                    // ...
                } else {
                    if (anotherCondition) {
                        // ...
                    }
                }
            `)

            expect(result).toHaveLength(0)
        })
    })
    describe('no-unused-expressions', function () {
        const ruleId = 'no-unused-expressions'
        const {lintText} = createLinter({ruleId, config})

        test('wrong', async () => {
            const result = await lintText(`
                0

                if(0) 0

                {0}

                f(0), {}

                a && b()

                a, b()

                c = a, b;

                a() && function namedFunctionInExpressionContext () {f();}

                (function anIncompleteIIFE () {});

                injectGlobal\`body{ color: red; }\`
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
    describe('camelcase', function () {
        const ruleId = 'camelcase'
        const {lintText} = createLinter({ruleId, config})

        test('right', async () => {
            const result = await lintText(`
                const hello_world = 'hello_world'
                console.log(hello_world)
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

                const baz = (_) => {}
                baz()
            `)

            expect(result).toHaveLength(0)
        })
        test('wrong', async () => {
            const result = await lintText(`
                import any from 'any'

                const foo = 'foo'


                const bar = () => {}

                const baz = (props) => {}
                baz()
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
