# declaration

## 규칙

- 중복된 `Custom Variables`를 선언하지 않는다.
  - 선언된 **Depth** 가 다른 경우 오류로 평가하지 않는 것으로 보입니다.
- 중복된 속성을 선언하지 않는다.
  - 값이 다른 경우 오류로 평가하지 않는다.
- 축약이 가능한 속성은 축약 속성을 사용한다.
  - `font` 관련 속성은 축약 속성은 규칙을 적용하지 않는다.
  - `*-top-*`, `*-right-*`, `*-bottom-*`, `*-left-*` 가 모두 선언된 경우만 오류로 평가한다.
  - [stylelint가 적용되는 축약 속성](https://stylelint.io/user-guide/rules/list/declaration-block-no-redundant-longhand-properties)
- 한 줄에 하나의 속성만 선언한다.
