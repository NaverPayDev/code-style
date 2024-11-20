import {describe, test, expect} from 'vitest'
import {
    다수_FILL_PROPS가_존재하는_컴포넌트,
    복잡한_HTML_컴포넌트,
    STROKE에_FILL이_쓰인_컴포넌트,
    ID_PROPS_있는_컴포넌트,
    STYLE_OBJECT를_포함한_컴포넌트,
    PROPS_변수_컴포넌트,
    함수형_컴포넌트,
    EXPORT_DEFAULT_함수형_컴포넌트,
} from '../../constants/test-data'
import {trimAll} from '../string'
import {svgoOptimize} from './transform'

describe('transform', () => {
    test.each([
        [
            '다수_FILL_PROPS가_존재하는_컴포넌트',
            다수_FILL_PROPS가_존재하는_컴포넌트.PROPS_없는_SVG_코드,
            다수_FILL_PROPS가_존재하는_컴포넌트.PROPS,
            다수_FILL_PROPS가_존재하는_컴포넌트.완료된_SVG_코드,
            undefined,
        ],
        [
            '복잡한_HTML_컴포넌트',
            복잡한_HTML_컴포넌트.PROPS_없는_SVG_코드,
            복잡한_HTML_컴포넌트.PROPS,
            복잡한_HTML_컴포넌트.완료된_SVG_코드,
            undefined,
        ],
        [
            'STROKE에_FILL이_쓰인_컴포넌트',
            STROKE에_FILL이_쓰인_컴포넌트.PROPS_없는_SVG_코드,
            STROKE에_FILL이_쓰인_컴포넌트.PROPS,
            STROKE에_FILL이_쓰인_컴포넌트.완료된_SVG_코드,
            undefined,
        ],
        [
            'ID_PROPS_있는_컴포넌트',
            ID_PROPS_있는_컴포넌트.PROPS_없는_SVG_코드,
            ID_PROPS_있는_컴포넌트.PROPS,
            ID_PROPS_있는_컴포넌트.완료된_SVG_코드,
            undefined,
        ],
        [
            'STYLE_OBJECT를_포함한_컴포넌트',
            STYLE_OBJECT를_포함한_컴포넌트.PROPS_없는_SVG_코드,
            STYLE_OBJECT를_포함한_컴포넌트.PROPS,
            STYLE_OBJECT를_포함한_컴포넌트.완료된_SVG_코드,
            /**
             * style 객체 변경 용도로 추가된 임시 객체
             */
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
            'PROPS_변수_컴포넌트',
            PROPS_변수_컴포넌트.PROPS_없는_SVG_코드,
            PROPS_변수_컴포넌트.PROPS,
            PROPS_변수_컴포넌트.완료된_SVG_코드,
            undefined,
        ],
        [
            '함수형_컴포넌트',
            함수형_컴포넌트.PROPS_없는_SVG_코드,
            함수형_컴포넌트.PROPS,
            함수형_컴포넌트.완료된_SVG_코드,
            undefined,
        ],
        [
            'EXPORT_DEFAULT_함수형_컴포넌트',
            EXPORT_DEFAULT_함수형_컴포넌트.PROPS_없는_SVG_코드,
            EXPORT_DEFAULT_함수형_컴포넌트.PROPS,
            EXPORT_DEFAULT_함수형_컴포넌트.완료된_SVG_코드,
            undefined,
        ],
    ])('[%s] 정상적으로 svg transformation을 수행한다.', (_, svgCode, props, result, exceptAttr) => {
        const data = svgoOptimize({svgCode, props, exceptAttr})

        expect(trimAll(data)).toEqual(trimAll(result))
    })
})
