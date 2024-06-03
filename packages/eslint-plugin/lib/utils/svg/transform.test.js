const {
    MULTIPLE_FILLES_CASE,
    COMPLEX_HTML_CASE,
    DIFF_PROPS_NAME_CASE,
    ID_CASE,
    STYLE_OBJECT_CASE,
    PROPS_VARIABLE_CASE,
    ID_CASE_FUNCTION,
} = require('../../constants/test-data')
const {trimAll} = require('../string')
const {svgoOptimize} = require('./transform')

describe('transform', () => {
    test.each([
        [
            'MULTIPLE_FILLES_CASE',
            MULTIPLE_FILLES_CASE.PROPS_없는_SVG_코드,
            MULTIPLE_FILLES_CASE.PROPS,
            MULTIPLE_FILLES_CASE.완료된_SVG_코드,
            undefined,
        ],
        [
            'COMPLEX_HTML_CASE',
            COMPLEX_HTML_CASE.PROPS_없는_SVG_코드,
            COMPLEX_HTML_CASE.PROPS,
            COMPLEX_HTML_CASE.완료된_SVG_코드,
            undefined,
        ],
        [
            'DIFF_PROPS_NAME_CASE',
            DIFF_PROPS_NAME_CASE.PROPS_없는_SVG_코드,
            DIFF_PROPS_NAME_CASE.PROPS,
            DIFF_PROPS_NAME_CASE.완료된_SVG_코드,
            undefined,
        ],
        ['ID_CASE', ID_CASE.PROPS_없는_SVG_코드, ID_CASE.PROPS, ID_CASE.완료된_SVG_코드, undefined],
        [
            'STYLE_OBJECT_CASE',
            STYLE_OBJECT_CASE.PROPS_없는_SVG_코드,
            STYLE_OBJECT_CASE.PROPS,
            STYLE_OBJECT_CASE.완료된_SVG_코드,
            {
                style0: {
                    from: '0000000000000000000000000000000',
                    to: 'style="style0"',
                    restored: "style={{maskType: 'luminance'}}",
                },
                style1: {
                    from: '1111111111111111111111111111111',
                    to: 'style="style1"',
                    restored: "style={{maskType: 'luminance'}}",
                },
                style2: {
                    from: '2222222222222222222222222222222',
                    to: 'style="style2"',
                    restored: "style={{maskType: 'luminance'}}",
                },
                style3: {
                    from: '3333333333333333333333333333333',
                    to: 'style="style3"',
                    restored: "style={{maskType: 'luminance'}}",
                },
            },
        ],
        [
            'PROPS_VARIABLE_CASE',
            PROPS_VARIABLE_CASE.PROPS_없는_SVG_코드,
            PROPS_VARIABLE_CASE.PROPS,
            PROPS_VARIABLE_CASE.완료된_SVG_코드,
            undefined,
        ],
        [
            'ID_CASE_FUNCTION',
            ID_CASE_FUNCTION.PROPS_없는_SVG_코드,
            ID_CASE_FUNCTION.PROPS,
            ID_CASE_FUNCTION.완료된_SVG_코드,
            undefined,
        ],
    ])('[%s] 정상적으로 svg transformation을 수행한다.', (_, svgCode, props, result, exceptAttr) => {
        const data = svgoOptimize({svgCode, props, exceptAttr})

        expect(trimAll(data)).toEqual(trimAll(result))
    })
})
