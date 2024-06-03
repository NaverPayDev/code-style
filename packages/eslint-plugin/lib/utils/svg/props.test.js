const {extractComponentProps, parseToAST} = require('@naverpay/ast-parser')

const {
    DEFAULT_CASE,
    MULTIPLE_FILLES_CASE,
    PROPS_VARIABLE_CASE,
    COMPLEX_HTML_CASE,
    DIFF_PROPS_NAME_CASE,
    ID_CASE,
    STYLE_OBJECT_CASE,
    ID_CASE_FUNCTION,
} = require('../../constants/test-data')
const {trimAll} = require('../string')
const {extractPropsFromLiteralCode} = require('./props')
const {parseSvgComponent} = require('./transform')

function parseCode(code) {
    const ast = parseToAST(code)

    return {
        block: ast,
    }
}

describe('extractComponentProps', () => {
    test.each([
        [DEFAULT_CASE.컴포넌트_코드, DEFAULT_CASE.PROPS],
        [MULTIPLE_FILLES_CASE.컴포넌트_코드, MULTIPLE_FILLES_CASE.PROPS],
        [PROPS_VARIABLE_CASE.컴포넌트_코드, 'props'],
        [COMPLEX_HTML_CASE.컴포넌트_코드, COMPLEX_HTML_CASE.PROPS],
        [DIFF_PROPS_NAME_CASE.컴포넌트_코드, DIFF_PROPS_NAME_CASE.PROPS],
        [ID_CASE.컴포넌트_코드, ID_CASE.PROPS],
        [STYLE_OBJECT_CASE.컴포넌트_코드, STYLE_OBJECT_CASE.PROPS],
        [ID_CASE_FUNCTION.컴포넌트_코드, ID_CASE_FUNCTION.PROPS],
    ])('ast tree에서 props를 추출한다.', (code, expectedProps) => {
        const scope = parseCode(code)

        const props = extractComponentProps(scope.block)

        expect(props).toEqual(expectedProps)
    })
})

describe('extractPropsFromLiteralCode', () => {
    test.each([[PROPS_VARIABLE_CASE.컴포넌트_코드, PROPS_VARIABLE_CASE.PROPS]])(
        'svg code에서 props를 추출한다.',
        (code, expectedProps) => {
            const props = extractPropsFromLiteralCode(code)

            expect(props).toEqual(expectedProps)
        },
    )
})

describe('replacePropsWithValueInSvgCode', () => {
    test.each([
        [DEFAULT_CASE.컴포넌트_코드, DEFAULT_CASE.PROPS_없는_SVG_코드, DEFAULT_CASE.PROPS],
        [MULTIPLE_FILLES_CASE.컴포넌트_코드, MULTIPLE_FILLES_CASE.PROPS_없는_SVG_코드, MULTIPLE_FILLES_CASE.PROPS],
        [COMPLEX_HTML_CASE.컴포넌트_코드, COMPLEX_HTML_CASE.PROPS_없는_SVG_코드, COMPLEX_HTML_CASE.PROPS],
        [DIFF_PROPS_NAME_CASE.컴포넌트_코드, DIFF_PROPS_NAME_CASE.PROPS_없는_SVG_코드, DIFF_PROPS_NAME_CASE.PROPS],
        [ID_CASE.컴포넌트_코드, ID_CASE.PROPS_없는_SVG_코드, ID_CASE.PROPS],
        [STYLE_OBJECT_CASE.컴포넌트_코드, STYLE_OBJECT_CASE.PROPS_없는_SVG_코드, STYLE_OBJECT_CASE.PROPS],
        [PROPS_VARIABLE_CASE.컴포넌트_코드, PROPS_VARIABLE_CASE.PROPS_없는_SVG_코드, PROPS_VARIABLE_CASE.PROPS],
        [ID_CASE_FUNCTION.컴포넌트_코드, ID_CASE_FUNCTION.PROPS_없는_SVG_코드, ID_CASE_FUNCTION.PROPS],
    ])('react svg code 중 props를 default value로 대체한다.', (contents, expectedSvgCode, expectedProps) => {
        const scope = parseCode(contents)
        const {svgCode, props} = parseSvgComponent({contents, globalScope: scope}, '')

        expect(trimAll(svgCode)).toEqual(trimAll(expectedSvgCode))
        expect(props).toEqual(expectedProps)
    })
})
