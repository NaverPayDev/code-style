import {parseToAST} from '@naverpay/ast-parser'
import {getJSXReturnStatement} from './astParser'
import {describe, test, expect} from 'vitest'

function parseCode(code) {
    const ast = parseToAST(code)

    return {
        block: ast,
    }
}

const code = `
import React, {memo} from 'react'

const AnySvg = memo(
    ({width = '100%', height = '100%', viewBox = '0 0 27 18', style = {}}) => (
        <svg width={width} height={height} viewBox={viewBox} style={style} />
    ),
)

export default AnySvg
`

describe('extractComponentProps', () => {
    test.concurrent.each([[code, 'svg']])('ast tree에서 props를 추출한다.', (reactCode, expected) => {
        const scope = parseCode(reactCode)

        const props = getJSXReturnStatement(scope)

        expect(props.openingElement.name.name).toEqual(expected)
    })
})
