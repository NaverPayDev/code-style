# rule

## 규칙

- `{ 블록 }` 이전에 **빈 줄**을 사용하지 않는다.
  - 단 여러 줄 주석 다음에 위치한 `{ 블록 }` 이전에는 **빈 줄**을 사용한다.

### ❗️실제 규칙

`{ 블록 }` 이전에 항상 **빈 줄**이 오도록 규칙을 설정한다. 단, 아래 항목들에 대해서는 **빈 줄**을 사용하지 않도록 예외로 적용한다.

- `{ 블록 }` 다음에 위치하는 `{ 블록 }`
- 한 줄 주석 다음에 위치하는 `{ 블록 }`
- 2 Depth 이상에서의 `{ 블록 }`
