import {extractComponentProps, parseToAST} from '@naverpay/ast-parser'
import {describe, test, expect} from 'vitest'

import {
    메모이제이션_컴포넌트,
    다수_FILL_PROPS가_존재하는_컴포넌트,
    PROPS_변수_컴포넌트,
    복잡한_HTML_컴포넌트,
    STROKE에_FILL이_쓰인_컴포넌트,
    ID_PROPS_있는_컴포넌트,
    STYLE_OBJECT를_포함한_컴포넌트,
    함수형_컴포넌트,
    EXPORT_DEFAULT_함수형_컴포넌트,
    EMPTY_PROPS_COMPONENT,
} from '../../constants/test-data'
import {trimAll} from '../string'
import {extractPropsFromLiteralCode} from './props'
import {parseSvgComponent} from './transform'

function parseCode(code) {
    const ast = parseToAST(code)

    return {
        block: ast,
    }
}

describe('extractComponentProps', () => {
    test.each([
        [메모이제이션_컴포넌트.컴포넌트_코드, 메모이제이션_컴포넌트.PROPS],
        [다수_FILL_PROPS가_존재하는_컴포넌트.컴포넌트_코드, 다수_FILL_PROPS가_존재하는_컴포넌트.PROPS],
        [PROPS_변수_컴포넌트.컴포넌트_코드, 'props'],
        [복잡한_HTML_컴포넌트.컴포넌트_코드, 복잡한_HTML_컴포넌트.PROPS],
        [STROKE에_FILL이_쓰인_컴포넌트.컴포넌트_코드, STROKE에_FILL이_쓰인_컴포넌트.PROPS],
        [ID_PROPS_있는_컴포넌트.컴포넌트_코드, ID_PROPS_있는_컴포넌트.PROPS],
        [STYLE_OBJECT를_포함한_컴포넌트.컴포넌트_코드, STYLE_OBJECT를_포함한_컴포넌트.PROPS],
        [함수형_컴포넌트.컴포넌트_코드, 함수형_컴포넌트.PROPS],
        [EXPORT_DEFAULT_함수형_컴포넌트.컴포넌트_코드, EXPORT_DEFAULT_함수형_컴포넌트.PROPS],
        [EMPTY_PROPS_COMPONENT.컴포넌트_코드, EMPTY_PROPS_COMPONENT.PROPS],
    ])('ast tree에서 props를 추출한다.', (code, expectedProps) => {
        const scope = parseCode(code)

        const props = extractComponentProps(scope.block)

        expect(props).toEqual(expectedProps)
    })
})

describe('extractPropsFromLiteralCode', () => {
    test.each([[PROPS_변수_컴포넌트.컴포넌트_코드, PROPS_변수_컴포넌트.PROPS]])(
        'svg code에서 props를 추출한다.',
        (code, expectedProps) => {
            const props = extractPropsFromLiteralCode(code)

            expect(props).toEqual(expectedProps)
        },
    )
})

describe('replacePropsWithValueInSvgCode', () => {
    test.each([
        [메모이제이션_컴포넌트.컴포넌트_코드, 메모이제이션_컴포넌트.PROPS_없는_SVG_코드, 메모이제이션_컴포넌트.PROPS],
        [
            다수_FILL_PROPS가_존재하는_컴포넌트.컴포넌트_코드,
            다수_FILL_PROPS가_존재하는_컴포넌트.PROPS_없는_SVG_코드,
            다수_FILL_PROPS가_존재하는_컴포넌트.PROPS,
        ],
        [복잡한_HTML_컴포넌트.컴포넌트_코드, 복잡한_HTML_컴포넌트.PROPS_없는_SVG_코드, 복잡한_HTML_컴포넌트.PROPS],
        [
            STROKE에_FILL이_쓰인_컴포넌트.컴포넌트_코드,
            STROKE에_FILL이_쓰인_컴포넌트.PROPS_없는_SVG_코드,
            STROKE에_FILL이_쓰인_컴포넌트.PROPS,
        ],
        [
            ID_PROPS_있는_컴포넌트.컴포넌트_코드,
            ID_PROPS_있는_컴포넌트.PROPS_없는_SVG_코드,
            ID_PROPS_있는_컴포넌트.PROPS,
        ],
        [
            STYLE_OBJECT를_포함한_컴포넌트.컴포넌트_코드,
            STYLE_OBJECT를_포함한_컴포넌트.PROPS_없는_SVG_코드,
            STYLE_OBJECT를_포함한_컴포넌트.PROPS,
        ],
        [PROPS_변수_컴포넌트.컴포넌트_코드, PROPS_변수_컴포넌트.PROPS_없는_SVG_코드, PROPS_변수_컴포넌트.PROPS],
        [함수형_컴포넌트.컴포넌트_코드, 함수형_컴포넌트.PROPS_없는_SVG_코드, 함수형_컴포넌트.PROPS],
        [
            EXPORT_DEFAULT_함수형_컴포넌트.컴포넌트_코드,
            EXPORT_DEFAULT_함수형_컴포넌트.PROPS_없는_SVG_코드,
            EXPORT_DEFAULT_함수형_컴포넌트.PROPS,
        ],
    ])('react svg code 중 props를 default value로 대체한다.', (contents, expectedSvgCode, expectedProps) => {
        const scope = parseCode(contents)
        const {svgCode, props} = parseSvgComponent({contents, globalScope: scope}, '')

        expect(trimAll(svgCode)).toEqual(trimAll(expectedSvgCode))
        expect(props).toEqual(expectedProps)
    })
})
