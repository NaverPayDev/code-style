---
'@naverpay/oxlint-config': patch
---

oxlint-config README에 `extends` 상속 한계 및 소비자 필수 항목 안내 추가

`card-apply-web`에서 카나리(`0.1.0-canary.260701-d925f10`) react 프리셋을 검증한 결과, oxlint의 `extends`는 `rules`/`plugins`/`jsPlugins`만 병합하고 `env`/`globals`/`categories`는 **상속하지 않는다**는 것을 확인했습니다 (oxlint 1.71.0/1.72.0, [oxc#20087](https://github.com/oxc-project/oxc/issues/20087)).

- `categories`가 상속되지 않아 oxlint 기본 `correctness`가 켜져 `unicorn/*` 룰이 의도치 않게 발화
- `env`가 상속되지 않아 `no-undef`가 `require`/`module`/`process`/`__dirname` 등을 false positive로 잡음
- 프리셋에 `globals`를 직접 추가해도 extends로 상속되지 않아 해결 불가 (검증 완료)

따라서 소비자는 최상위 config에 `env`/`categories`(필요시 `globals`)를 직접 작성해야 합니다. README의 Node.js/React 예시에 해당 항목을 포함하고, 한계를 명시하는 Note를 추가했습니다.
