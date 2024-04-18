# stylelint-order

## 규칙

블록 내 스타일 선언은 아래 순서를 따릅니다.

1. `--custom-properties`
1. `$dollar-variables`
1. `@extend`
1. `@include`
1. `@content`
    - Scss 믹스인 내 `@content`를 의미
    - 기본 순서는 [네이버 코딩 컨벤션(Sass)#13-린트](http://viewoss.navercorp.com/UIT/markup-convention/blob/master/sass.html#__lint) 가이드 내 `sass-lint.yml` 참고
      - 네이버페이 마크업 저장소(FE 저장소 포함) 내 `*.scss` 파일 참고해 순서 일부 상이
1. 스타일 선언 `display:...`
1. 하위 선택자 블록 선언 `ex) .foo { ... }`
1. `@media {}`

### 스타일 선언 순서

```SCSS
.order {
    content: $value;

    overflow: $value;
    overflow-x: $value;
    overflow-y: $value;

    float: $value;

    position: $value;
    top: $value;
    right: $value;
    bottom: $value;
    left: $value;
    z-index: $value;

    display: $value;
    table-layout: $value;

    clear: $value;

    flex: $value;
    flex-basis: $value;
    flex-direction: $value;
    flex-flow: $value;
    flex-grow: $value;
    flex-shrink: $value;
    flex-wrap: $value;
    align-content: $value;
    align-items: $value;
    align-self: $value;
    justify-content: $value;
    order: $value;

    width: $value;
    min-width: $value;
    max-width: $value;

    height: $value;
    min-height: $value;
    max-height: $value;

    margin: $value;
    margin-top: $value;
    margin-right: $value;
    margin-bottom: $value;
    margin-left: $value;

    padding: $value;
    padding-top: $value;
    padding-right: $value;
    padding-bottom: $value;
    padding-left: $value;

    border: $value;
    border-top: $value;
    border-right: $value;
    border-bottom: $value;
    border-left: $value;

    border-width: $value;
    border-top-width: $value;
    border-right-width: $value;
    border-bottom-width: $value;
    border-left-width: $value;

    border-style: $value;
    border-top-style: $value;
    border-right-style: $value;
    border-bottom-style: $value;
    border-left-style: $value;

    border-color: $value;
    border-top-color: $value;
    border-right-color: $value;
    border-bottom-color: $value;
    border-left-color: $value;

    border-radius: $value;
    border-top-left-radius: $value;
    border-top-right-radius: $value;
    border-bottom-right-radius: $value;
    border-bottom-left-radius: $value;

    outline: $value;
    outline-offset: $value;
    outline-width: $value;
    outline-style: $value;
    outline-color: $value;

    box-sizing: $value;
    box-shadow: $value;

    background: $value;
    background-attachment: $value;
    background-clip: $value;
    background-color: $value;
    background-image: $value;
    background-repeat: $value;
    background-position: $value;
    background-size: $value;

    font: $value;
    font-family: $value;
    font-size: $value;
    font-smooth: $value;
    font-style: $value;
    font-variant: $value;
    font-weight: $value;

    line-height: $value;
    letter-spacing: $value;

    text-align: $value;
    text-decoration: $value;
    text-indent: $value;
    text-overflow: $value;
    text-rendering: $value;
    text-shadow: $value;
    text-transform: $value;
    text-wrap: $value;

    white-space: $value;
    word-spacing: $value;
    word-break: $value;
    word-wrap: $value;
    vertical-align: $value;

    color: $value;

    transform: $value;
    transform-box: $value;
    transform-origin: $value;
    transform-style: $value;

    transition: $value;
    transition-delay: $value;
    transition-duration: $value;
    transition-property: $value;
    transition-timing-function: $value;

    animation: $value;
    animation-name: $value;
    animation-duration: $value;
    animation-timing-function: $value;
    animation-delay: $value;
    animation-iteration-count: $value;
    animation-direction: $value;
    animation-fill-mode: $value;
    animation-play-state: $value;

    list-style: $value;
    border-collapse: $value;
    border-spacing: $value;
    caption-side: $value;
    cursor: $value;
    empty-cells: $value;
    quotes: $value;
    speak: $value;
    visibility: $value;

    opacity: $value;
}
```
