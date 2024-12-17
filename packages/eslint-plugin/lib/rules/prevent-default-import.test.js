import {RuleTester} from 'eslint'
import {describe, it} from 'vitest'
import rule from './prevent-default-import'

import typescriptParser from '@typescript-eslint/parser'
import babelParser from '@babel/eslint-parser'

describe('prevent-default-import', () => {
    it('validates javascript imports', () => {
        const tester = new RuleTester({
            languageOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        })

        tester.run('javascript/prevent-default-import', rule, {
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

    it('validates typescript imports', () => {
        const tester = new RuleTester({
            languageOptions: {
                parser: typescriptParser,
            },
        })

        tester.run('typescript/prevent-default-import', rule, {
            valid: [
                `
                import {ReactNode} from 'react'
                interface ComponentProps {
                    children: ReactNode
                }
                const Component = (props: ComponentProps) => {}
                `,
            ],
            invalid: [
                {
                    code: `
                        import React, {FC} from 'react'

                        interface Props {
                            children: React.ReactNode
                        }

                        const Component: FC = () => {}
                        `,
                    options: [{packages: ['react']}],
                    errors: [
                        {
                            message: "'React.ReactNode' should be used as 'ReactNode'",
                        },
                    ],
                    output: `
                        import {FC, ReactNode} from 'react'

                        interface Props {
                            children: ReactNode
                        }

                        const Component: FC = () => {}
                        `,
                },
                {
                    code: `
                        import React from 'react'

                        interface Props {
                            children: React.ReactNode
                        }

                        const Component: React.FC = () => {}
                        `,
                    options: [{packages: ['react']}],
                    errors: [
                        {
                            message: "'React.ReactNode' should be used as 'ReactNode'",
                        },
                        {
                            message: "'React.FC' should be used as 'FC'",
                        },
                    ],
                    output: `
                        import React, {ReactNode} from 'react'

                        interface Props {
                            children: ReactNode
                        }

                        const Component: React.FC = () => {}
                        `,
                },
                {
                    code: `
                        import React from 'react'

                        interface Props {
                            children: React.ReactNode
                        }
                        `,
                    options: [{packages: ['react']}],
                    errors: [
                        {
                            message: "'React.ReactNode' should be used as 'ReactNode'",
                        },
                    ],
                    output: `
                        import {ReactNode} from 'react'

                        interface Props {
                            children: ReactNode
                        }
                        `,
                },
                {
                    code: `
                        import React, {ReactNode} from 'react'

                        interface Props {
                            child1: React.ReactNode
                            child2: ReactNode
                        }
                        `,
                    options: [{packages: ['react']}],
                    errors: [
                        {
                            message: "'React.ReactNode' should be used as 'ReactNode'",
                        },
                    ],
                    output: `
                        import {ReactNode} from 'react'

                        interface Props {
                            child1: ReactNode
                            child2: ReactNode
                        }
                        `,
                },
                {
                    code: `
                        import React, {ReactNode} from 'react'

                        interface Props {
                            child1: React.ReactNode
                            child2: React.ReactNode
                            child3: ReactNode
                        }
                        `,
                    options: [{packages: ['react']}],
                    errors: [
                        {
                            message: "'React.ReactNode' should be used as 'ReactNode'",
                        },
                        {
                            message: "'React.ReactNode' should be used as 'ReactNode'",
                        },
                    ],
                    output: `
                        import React, {ReactNode} from 'react'

                        interface Props {
                            child1: ReactNode
                            child2: ReactNode
                            child3: ReactNode
                        }
                        `,
                },
                {
                    code: `
                        import React, {ReactNode, FC} from 'react'

                        interface Props {
                            child1: React.ReactNode
                            child2: React.FC
                            child3: ReactNode
                            child4: FC
                        }
                        `,
                    options: [{packages: ['react']}],
                    errors: [
                        {
                            message: "'React.ReactNode' should be used as 'ReactNode'",
                        },
                        {
                            message: "'React.FC' should be used as 'FC'",
                        },
                    ],
                    output: `
                        import React, {ReactNode, FC} from 'react'

                        interface Props {
                            child1: ReactNode
                            child2: FC
                            child3: ReactNode
                            child4: FC
                        }
                        `,
                },
            ],
        })
    })

    it('validates JSX imports', () => {
        const tester = new RuleTester({
            languageOptions: {
                parser: babelParser,
                parserOptions: {
                    requireConfigFile: false,
                    babelOptions: {
                        presets: ['@babel/preset-react'],
                    },
                    ecmaFeatures: {
                        jsx: true,
                    },
                    ecmaVersion: 'latest',
                    sourceType: 'module',
                },
            },
        })

        tester.run('jsx/prevent-default-import', rule, {
            valid: [
                {
                    code: `
                        import {StrictMode} from 'react'

                        const Component = () => {
                            return <StrictMode></StrictMode>
                        }
                    `,
                    options: [{packages: ['react']}],
                },
                {
                    code: `
                        import {StrictMode} from 'react'

                        const Component = () => {
                            return <StrictMode />
                        }
                    `,
                    options: [{packages: ['react']}],
                },
            ],
            invalid: [
                {
                    code: `
                        import React from 'react'

                        const Component = () => {
                            return <React.StrictMode></React.StrictMode>
                        }
                    `,
                    options: [{packages: ['react']}],
                    errors: [
                        {
                            message: "'React.StrictMode' should be used as 'StrictMode'",
                        },
                    ],
                    output: `
                        import {StrictMode} from 'react'

                        const Component = () => {
                            return <StrictMode></StrictMode>
                        }
                    `,
                },
                {
                    code: `
                            import React from 'react'

                            const Component = () => {
                                return <React.StrictMode />
                            }
                        `,
                    options: [{packages: ['react']}],
                    errors: [
                        {
                            message: "'React.StrictMode' should be used as 'StrictMode'",
                        },
                    ],
                    output: `
                            import {StrictMode} from 'react'

                            const Component = () => {
                                return <StrictMode />
                            }
                        `,
                },
                {
                    code: `
                            import React, {useEffect} from 'react'

                            const Component = () => {
                                useEffect(() => {
                                    console.log()
                                }, [])

                                return <React.StrictMode />
                            }
                        `,
                    options: [{packages: ['react']}],
                    errors: [
                        {
                            message: "'React.StrictMode' should be used as 'StrictMode'",
                        },
                    ],
                    output: `
                            import {useEffect, StrictMode} from 'react'

                            const Component = () => {
                                useEffect(() => {
                                    console.log()
                                }, [])

                                return <StrictMode />
                            }
                        `,
                },
                {
                    code: `
                        import React from 'react'

                        const Component = () => {
                            return (
                                <React.Fragment>
                                    <React.StrictMode />
                                </React.Fragment>
                            )
                        }
                        `,
                    options: [{packages: ['react']}],
                    errors: [
                        {
                            message: "'React.Fragment' should be used as 'Fragment'",
                        },
                        {
                            message: "'React.StrictMode' should be used as 'StrictMode'",
                        },
                    ],
                    output: `
                        import React, {StrictMode} from 'react'

                        const Component = () => {
                            return (
                                <React.Fragment>
                                    <StrictMode />
                                </React.Fragment>
                            )
                        }
                        `,
                },
                {
                    code: `
                        import React, {StrictMode} from 'react'

                        const Component = () => {
                            return (
                                <React.Fragment>
                                    <StrictMode />
                                </React.Fragment>
                            )
                        }
                        `,
                    options: [{packages: ['react']}],
                    errors: [
                        {
                            message: "'React.Fragment' should be used as 'Fragment'",
                        },
                    ],
                    output: `
                        import {StrictMode, Fragment} from 'react'

                        const Component = () => {
                            return (
                                <Fragment>
                                    <StrictMode />
                                </Fragment>
                            )
                        }
                        `,
                },
                {
                    code: `
                        import React from 'react'
                        import ReactBeta from 'react-beta'

                        const Component = () => {
                            return (
                                <React.Fragment>
                                    <ReactBeta.StrictMode />
                                </React.Fragment>
                            )
                        }
                        `,
                    options: [{packages: ['react', 'react-beta']}],
                    errors: [
                        {
                            message: "'React.Fragment' should be used as 'Fragment'",
                        },
                        {
                            message: "'ReactBeta.StrictMode' should be used as 'StrictMode'",
                        },
                    ],
                    output: `
                        import {Fragment} from 'react'
                        import ReactBeta from 'react-beta'

                        const Component = () => {
                            return (
                                <Fragment>
                                    <ReactBeta.StrictMode />
                                </Fragment>
                            )
                        }
                        `,
                },
                {
                    code: `
                        import {Fragment} from 'react'
                        import ReactBeta from 'react-beta'

                        const Component = () => {
                            return (
                                <Fragment>
                                    <ReactBeta.StrictMode />
                                </Fragment>
                            )
                        }
                        `,
                    options: [{packages: ['react', 'react-beta']}],
                    errors: [
                        {
                            message: "'ReactBeta.StrictMode' should be used as 'StrictMode'",
                        },
                    ],
                    output: `
                        import {Fragment} from 'react'
                        import {StrictMode} from 'react-beta'

                        const Component = () => {
                            return (
                                <Fragment>
                                    <StrictMode />
                                </Fragment>
                            )
                        }
                        `,
                },
                {
                    code: `
                        import React, {Fragment} from 'react'

                        const Component = () => {
                            return (
                                <Fragment>
                                    <React.Fragment />
                                </Fragment>
                            )
                        }
                        `,
                    options: [{packages: ['react', 'react-beta']}],
                    errors: [
                        {
                            message: "'React.Fragment' should be used as 'Fragment'",
                        },
                    ],
                    output: `
                        import {Fragment} from 'react'

                        const Component = () => {
                            return (
                                <Fragment>
                                    <Fragment />
                                </Fragment>
                            )
                        }
                        `,
                },
            ],
        })
    })

    it('validates combined cases', () => {
        const tester = new RuleTester({
            languageOptions: {
                parser: typescriptParser,
                parserOptions: {
                    requireConfigFile: false,
                    babelOptions: {
                        presets: ['@babel/preset-react'],
                    },
                    ecmaFeatures: {
                        jsx: true,
                    },
                    ecmaVersion: 'latest',
                    sourceType: 'module',
                },
            },
        })

        tester.run('combined-case/prevent-default-import', rule, {
            valid: [
                {
                    code: `
                        import {FC, StrictMode, useEffect} from 'react'

                        const Component: FC = () => {
                            useEffect(() => {
                                console.log()
                            }, [])

                            return <StrictMode />
                        }
                    `,
                    options: [{packages: ['react']}],
                },
            ],
            invalid: [
                {
                    code: `
                        import React from 'react'

                        const Component: React.FC = () => {
                            React.useEffect(() => {
                                console.log()
                            }, [])

                            return <React.StrictMode></React.StrictMode>
                        }
                    `,
                    options: [{packages: ['react']}],
                    errors: [
                        {
                            message: "'React.FC' should be used as 'FC'",
                        },
                        {
                            message: "'React.useEffect' should be used as 'useEffect'",
                        },
                        {
                            message: "'React.StrictMode' should be used as 'StrictMode'",
                        },
                    ],
                    output: `
                        import React, {FC} from 'react'

                        const Component: FC = () => {
                            React.useEffect(() => {
                                console.log()
                            }, [])

                            return <React.StrictMode></React.StrictMode>
                        }
                    `,
                },
                {
                    code: `
                            import React, {FC} from 'react'

                            const Component: FC = () => {
                                React.useEffect(() => {
                                    console.log()
                                }, [])

                                return <React.StrictMode></React.StrictMode>
                            }
                        `,
                    options: [{packages: ['react']}],
                    errors: [
                        {
                            message: "'React.useEffect' should be used as 'useEffect'",
                        },
                        {
                            message: "'React.StrictMode' should be used as 'StrictMode'",
                        },
                    ],
                    output: `
                            import React, {FC, useEffect} from 'react'

                            const Component: FC = () => {
                                useEffect(() => {
                                    console.log()
                                }, [])

                                return <React.StrictMode></React.StrictMode>
                            }
                        `,
                },
                {
                    code: `
                            import React, {FC, useEffect} from 'react'

                            const Component: FC = () => {
                                useEffect(() => {
                                    console.log()
                                }, [])
                                return <React.StrictMode></React.StrictMode>
                            }
                        `,
                    options: [{packages: ['react']}],
                    errors: [
                        {
                            message: "'React.StrictMode' should be used as 'StrictMode'",
                        },
                    ],
                    output: `
                            import {FC, useEffect, StrictMode} from 'react'

                            const Component: FC = () => {
                                useEffect(() => {
                                    console.log()
                                }, [])
                                return <StrictMode></StrictMode>
                            }
                        `,
                },
            ],
        })
    })
})
