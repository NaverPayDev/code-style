# `@naverpay/cognitive-complexity`

> **이 규칙은** 함수의 [Cognitive Complexity](https://www.sonarsource.com/docs/CognitiveComplexity.pdf)가 임계값을 초과하면 **라인별 점수 상세**와 함께 보고합니다.

## 설명

기존 `eslint-plugin-sonarjs`의 `cognitive-complexity` 규칙은 총점만 알려줄 뿐, **왜 높은지** 알 수 없습니다.

이 규칙은 SonarSource Cognitive Complexity 스펙 기반으로 점수를 계산하고, **어떤 라인의 어떤 구문이 몇 점을 기여했는지** 상세하게 안내합니다. 옵션을 통해 6종의 리팩토링 제안도 함께 받을 수 있습니다.

### This will be reported

```js
// threshold 5 초과 → 에러
function processOrder(order, user) {
    if (order.items.length > 0) {                    // +1 if문
        for (const item of order.items) {            // +2 for-of문 (중첩 1단계에서 +1)
            if (item.quantity > 0 && item.price) {   // +4 if문 (중첩 2단계에서 +2), && 연산자
                if (user.isVip) {                    // +4 if문 (중첩 3단계에서 +3)
                    applyDiscount(item)
                }
            }
        }
    }
}
// Cognitive Complexity: 11 (허용: 5)
```

### This will not be reported

```js
// threshold 15 이하 → 통과
function greet(name) {
    if (!name) {
        return 'Hello, stranger!'
    }
    return `Hello, ${name}!`
}
// Cognitive Complexity: 1
```

## 출력 예시

### 기본 (점수 상세)

```
'processOrder'의 Cognitive Complexity가 11입니다 (허용: 5).
  점수 상세:
  +1 (L3) if문
  +2 (L4) for-of문 (중첩 1단계에서 +1)
  +4 (L5) if문, && 연산자 (중첩 2단계에서 +2)
  +4 (L6) if문 (중첩 3단계에서 +3)
```

### `suggestions: true` 옵션 사용 시

```
'processOrder'의 Cognitive Complexity가 11입니다 (허용: 5).
  점수 상세:
  +1 (L3) if문
  +2 (L4) for-of문 (중첩 1단계에서 +1)
  +4 (L5) if문, && 연산자 (중첩 2단계에서 +2)
  +4 (L6) if문 (중첩 3단계에서 +3)
  제안:
  - L3의 초기 조건을 반전시키고 조기 반환(guard clause)하세요
  - L6에서 중첩 깊이 3단계. 이 블록을 별도 함수로 추출하세요
```

## 점수 계산 방식

| 항목 | 증분 | 예시 |
| :--- | :--- | :--- |
| 구조적 구문 | +1 | `if`, `else if`, `else`, `for`, `while`, `do-while`, `switch`, `catch`, 삼항 연산자 |
| 중첩 | +중첩 단계 | 위 구문이 다른 구문 안에 있을 때 추가 |
| 논리 연산자 `&&` | +1 (시퀀스당) | `a && b && c` → +1, `a && b \|\| c` → && +1 |
| 라벨 break/continue | +1 | `break outerLoop` |
| 중첩 함수 | 별도 계산 | 부모 함수의 복잡도에 기여하지 않음 |

## 제안 종류 (6종)

`suggestions: true` 옵션을 사용하면 다음 제안이 조건에 따라 포함됩니다:

| 제안 | 조건 | 설명 |
| :--- | :--- | :--- |
| guard-clause | 첫 if 이후 60%+ 증분이 중첩 | 초기 조건을 반전시키고 조기 반환하세요 |
| extract-function | 중첩 깊이 >= 3 | 깊은 블록을 별도 함수로 추출하세요 |
| extract-boolean | 논리 연산자 >= 2개 | 복잡한 조건을 이름 있는 변수로 추출하세요 |
| split-function | 30줄 이상 + threshold 초과 | 더 작은 함수로 분리하세요 |
| merge-nested-if | `if(a) { if(b) {...} }` (양쪽 else 없음) | 중첩 if문을 `&&` 조건으로 병합하세요 |
| invert-if | if-else에서 한 분기가 return/throw로 끝남 | 조건을 반전시키고 else를 제거하세요 |

## 옵션

### 첫 번째 인자: `threshold` (integer, 기본값: 15)

허용할 최대 Cognitive Complexity 점수입니다.

### 두 번째 인자: `options` (object, 선택)

| 속성 | 타입 | 기본값 | 설명 |
| :--- | :--- | :--- | :--- |
| `breakdown` | `boolean` | `false` | 라인별 점수 상세를 에러 메시지에 포함할지 여부 |
| `suggestions` | `boolean` | `false` | 리팩토링 제안을 에러 메시지에 포함할지 여부 |

## 설정

```js
// eslint.config.js
import naverpayPlugin from '@naverpay/eslint-plugin'

export default [
    {
        plugins: {'@naverpay': naverpayPlugin},
        rules: {
            // 기본: threshold 15, 점수 상세만 표시
            '@naverpay/cognitive-complexity': ['error', 15],
        },
    },
]
```

### 제안 포함

```js
export default [
    {
        plugins: {'@naverpay': naverpayPlugin},
        rules: {
            '@naverpay/cognitive-complexity': ['error', 15, {suggestions: true}],
        },
    },
]
```

### 점수 상세 비활성화

```js
export default [
    {
        plugins: {'@naverpay': naverpayPlugin},
        rules: {
            // 점수 상세 없이 총점만 표시
            '@naverpay/cognitive-complexity': ['error', 15, {breakdown: false}],
        },
    },
]
```

### threshold 변경

```js
export default [
    {
        plugins: {'@naverpay': naverpayPlugin},
        rules: {
            // 더 엄격하게 10으로 설정 + 제안 포함
            '@naverpay/cognitive-complexity': ['error', 10, {suggestions: true}],
        },
    },
]
```
