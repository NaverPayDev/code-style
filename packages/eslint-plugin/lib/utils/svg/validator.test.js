import {extractComponentProps, parseToAST, getImportDeclarations} from '@naverpay/ast-parser'
import {describe, test, expect} from 'vitest'

import {isEmpty} from '..'
import {SVG_OPTIMIZED_COMMENT_CONTENT} from '../../constants'
import {findSpecificImportDeclaration} from '../astParser'

function parseCode(code) {
    const ast = parseToAST(code)

    return {
        block: ast,
        comments: ast.comments,
    }
}

/**
 * @typedef AST
 * @property {import("@pie/ast-parser").ComponentAST} block
 * @property {import("@pie/ast-parser").ComponentAST['comments']} comments
 */

/**
 *
 * @param {AST} globalScope
 * @returns
 */
const svgValidator = (globalScope) => {
    const importDeclarations = getImportDeclarations(globalScope.block)
    const hasClassNames =
        findSpecificImportDeclaration(importDeclarations, {
            from: 'classnames/bind',
        }) ||
        findSpecificImportDeclaration(importDeclarations, {
            from: 'styled-components',
        })
    const props = hasClassNames ? null : extractComponentProps(globalScope.block)

    const comments = globalScope.comments

    const isOptimizedAlready = comments.some(({value}) => value.includes(SVG_OPTIMIZED_COMMENT_CONTENT))

    return !isEmpty(props) && !hasClassNames && !isOptimizedAlready
}

describe('svgValidator', () => {
    test('svgValidator 통과?', () => {
        const code = `
        import {memo} from 'react';
        import {SvgUniqueID} from '@naverpay/svg-manager';

        import type {SVGStyleProps} from '@naverpay/svg-manager';

        function IconCreditBenefit3({
            width = '100%',
            height = '100%',
            viewBox = '0 0 24 24', id,
            style = {},
        }: SVGStyleProps) {
          return (
            <SvgUniqueID id={id}>
                <svg width={width} height={height} viewBox={viewBox} style={style}>
                    <mask id="path-1-inside-1_25_36440" fill="white">
                        <path fillRule="evenodd" clipRule="evenodd" d="M21.9998 11.9306C22.0381 17.4533 17.5921 21.9615 12.0694 21.9998C6.54666 22.0381 2.03869 17.592 2.00025 12.0694C1.96195 6.54655 6.40807 2.03854 11.9307 2.00025C17.4533 1.96195 21.9615 6.40795 21.9998 11.9306Z"/>
                    </mask>
                    <path d="M12.0694 21.9998L12.0847 24.1997H12.0847L12.0694 21.9998ZM2.00025 12.0694L-0.199702 12.0846L-0.199701 12.0847L2.00025 12.0694ZM19.7998 11.9459C19.8297 16.2536 16.3618 19.7699 12.0542 19.7998L12.0847 24.1997C18.8224 24.153 24.2464 18.653 24.1997 11.9154L19.7998 11.9459ZM12.0542 19.7998C7.74643 19.8297 4.23018 16.3618 4.20019 12.0541L-0.199701 12.0847C-0.152802 18.8223 5.34688 24.2464 12.0847 24.1997L12.0542 19.7998ZM4.20019 12.0541C4.17032 7.74632 7.63829 4.23007 11.946 4.20019L11.9154 -0.199702C5.17785 -0.152978 -0.246424 5.34677 -0.199702 12.0846L4.20019 12.0541ZM11.946 4.20019C16.2536 4.17032 19.7699 7.63821 19.7998 11.9459L24.1997 11.9154C24.153 5.1777 18.6531 -0.246425 11.9154 -0.199702L11.946 4.20019Z" fill="url(#paint0_linear_25_36440)" mask="url(#path-1-inside-1_25_36440)"/>
                    <path d="M9.68747 14.5115L8.68166 9.45793C8.6544 9.338 8.67893 9.23169 8.75525 9.13901C8.83703 9.04634 8.93788 9 9.05782 9H9.5321C9.66294 9 9.78015 9.04361 9.88373 9.13084C9.98731 9.21806 10.0473 9.32709 10.0636 9.45793L10.6197 13.5466C10.6197 13.5521 10.6224 13.5548 10.6279 13.5548C10.6333 13.5548 10.636 13.5521 10.636 13.5466L11.143 9.45793C11.1594 9.32709 11.2166 9.21806 11.3148 9.13084C11.4129 9.04361 11.5274 9 11.6582 9H12.4269C12.5577 9 12.6722 9.04361 12.7703 9.13084C12.8685 9.21806 12.9257 9.32709 12.9421 9.45793L13.449 13.5466C13.449 13.5521 13.4518 13.5548 13.4572 13.5548C13.4627 13.5548 13.4654 13.5521 13.4654 13.5466L14.0215 9.45793C14.0378 9.32709 14.0978 9.21806 14.2014 9.13084C14.3049 9.04361 14.4221 9 14.553 9H14.9946C15.1145 9 15.2126 9.04634 15.2889 9.13901C15.3653 9.23169 15.3925 9.338 15.3707 9.45793L14.3649 14.5115C14.3376 14.6424 14.2722 14.7514 14.1687 14.8386C14.0651 14.9258 13.9451 14.9695 13.8088 14.9695H13.1138C12.9829 14.9695 12.8657 14.9258 12.7621 14.8386C12.664 14.7514 12.6068 14.6424 12.5904 14.5115L12.0344 10.4229C12.0344 10.4174 12.0316 10.4147 12.0262 10.4147C12.0207 10.4147 12.018 10.4174 12.018 10.4229L11.462 14.5115C11.4456 14.6424 11.3856 14.7514 11.2821 14.8386C11.1839 14.9258 11.0694 14.9695 10.9386 14.9695H10.2435C10.1072 14.9695 9.98458 14.9258 9.87555 14.8386C9.77197 14.7514 9.70928 14.6424 9.68747 14.5115Z" fill="#1E1E23"/>
                    <rect x="7.5" y="11.3359" width="2.72578" height="1.18117" rx="0.414545" fill="#1E1E23"/>
                    <rect x="13.8232" y="11.3359" width="2.72578" height="1.18117" rx="0.414545" fill="#1E1E23"/>
                    <defs>
                        <linearGradient id="paint0_linear_25_36440" x1="2.35821" y1="2.73733" x2="25.9344" y2="12.4388" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#0DC56C"/>
                            <stop offset="1" stopColor="#09AA9E"/>
                        </linearGradient>
                    </defs>
                </svg>
            </SvgUniqueID>
          );
        }

        export default memo(IconCreditBenefit3);
        `
        const scope = parseCode(code)

        const isValid = svgValidator(scope)

        expect(isValid).toEqual(true)
    })
})
