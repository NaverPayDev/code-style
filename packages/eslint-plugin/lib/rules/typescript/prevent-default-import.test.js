const {RuleTester} = require('@typescript-eslint/rule-tester')

const parser = require.resolve('@typescript-eslint/parser')
const rule = require('./prevent-default-import')

const ruleTester = new RuleTester({
    parser,
})

describe('typescript/prevent-default-import', () => {
    ruleTester.run('typescript/prevent-default-import', rule, {
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
                // [1]
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
                // [2]
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
                // [3]
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
                // [4]
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
