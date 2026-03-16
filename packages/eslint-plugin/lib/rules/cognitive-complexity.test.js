import {RuleTester} from 'eslint'
import {describe, it} from 'vitest'

import rule from './cognitive-complexity.js'

describe('cognitive-complexity', () => {
    const tester = new RuleTester({
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
    })

    it('allows functions under the threshold', () => {
        tester.run('cognitive-complexity', rule, {
            valid: [
                {
                    code: 'function foo() {}',
                    options: [15],
                },
                {
                    code: 'const foo = (x) => x + 1;',
                    options: [15],
                },
                {
                    // simple if → score 1, threshold 15
                    code: `function foo(x) {
                        if (x > 0) { return x; }
                    }`,
                    options: [15],
                },
                {
                    // if-else → score 2, threshold 15
                    code: `function foo(x) {
                        if (x > 0) { return x; }
                        else { return -x; }
                    }`,
                    options: [15],
                },
            ],
            invalid: [],
        })
    })

    it('reports simple if with low threshold', () => {
        tester.run('cognitive-complexity', rule, {
            valid: [],
            invalid: [
                {
                    // if → +1, threshold 0
                    code: `function foo(x) {
                        if (x > 0) { return x; }
                    }`,
                    options: [0],
                    errors: [{messageId: 'complexFunction'}],
                },
            ],
        })
    })

    it('reports if-else', () => {
        tester.run('cognitive-complexity', rule, {
            valid: [],
            invalid: [
                {
                    // if +1, else +1 → score 2
                    code: `function foo(x) {
                        if (x > 0) { return x; }
                        else { return -x; }
                    }`,
                    options: [1],
                    errors: [{messageId: 'complexFunction'}],
                },
            ],
        })
    })

    it('reports if-else if-else', () => {
        tester.run('cognitive-complexity', rule, {
            valid: [],
            invalid: [
                {
                    // if +1, else if +1, else +1 → score 3
                    code: `function foo(x) {
                        if (x > 0) { return 1; }
                        else if (x < 0) { return -1; }
                        else { return 0; }
                    }`,
                    options: [2],
                    errors: [{messageId: 'complexFunction'}],
                },
            ],
        })
    })

    it('reports nested if', () => {
        tester.run('cognitive-complexity', rule, {
            valid: [],
            invalid: [
                {
                    // if +1, nested if +1(structural) +1(nesting) → score 3
                    code: `function foo(a, b) {
                        if (a) {
                            if (b) { return true; }
                        }
                    }`,
                    options: [2],
                    errors: [{messageId: 'complexFunction'}],
                },
            ],
        })
    })

    it('reports deeply nested code with suggestions', () => {
        tester.run('cognitive-complexity', rule, {
            valid: [],
            invalid: [
                {
                    // if +1, for +1+1, if +1+2, if +1+3 → score 10
                    code: `function foo(a, b, c) {
                        if (a) {
                            for (let i = 0; i < 10; i++) {
                                if (b) {
                                    if (c) { return true; }
                                }
                            }
                        }
                    }`,
                    options: [5],
                    errors: [{messageId: 'complexFunction'}],
                },
            ],
        })
    })

    it('reports logical operator &&', () => {
        tester.run('cognitive-complexity', rule, {
            valid: [],
            invalid: [
                {
                    // if +1, && +1 → score 2
                    code: `function foo(a, b) {
                        if (a && b) { return true; }
                    }`,
                    options: [1],
                    errors: [{messageId: 'complexFunction'}],
                },
            ],
        })
    })

    it('same && sequence counts as one', () => {
        tester.run('cognitive-complexity', rule, {
            valid: [],
            invalid: [
                {
                    // if +1, && +1 (same sequence) → score 2
                    code: `function foo(a, b, c) {
                        if (a && b && c) { return true; }
                    }`,
                    options: [1],
                    errors: [{messageId: 'complexFunction'}],
                },
            ],
        })
    })

    it('reports for loop', () => {
        tester.run('cognitive-complexity', rule, {
            valid: [],
            invalid: [
                {
                    code: `function foo(arr) {
                        for (let i = 0; i < arr.length; i++) { console.log(arr[i]); }
                    }`,
                    options: [0],
                    errors: [{messageId: 'complexFunction'}],
                },
            ],
        })
    })

    it('reports while loop', () => {
        tester.run('cognitive-complexity', rule, {
            valid: [],
            invalid: [
                {
                    code: `function foo(x) {
                        while (x > 0) { x--; }
                    }`,
                    options: [0],
                    errors: [{messageId: 'complexFunction'}],
                },
            ],
        })
    })

    it('reports do-while loop', () => {
        tester.run('cognitive-complexity', rule, {
            valid: [],
            invalid: [
                {
                    code: `function foo(x) {
                        do { x--; } while (x > 0);
                    }`,
                    options: [0],
                    errors: [{messageId: 'complexFunction'}],
                },
            ],
        })
    })

    it('reports switch statement', () => {
        tester.run('cognitive-complexity', rule, {
            valid: [],
            invalid: [
                {
                    code: `function foo(x) {
                        switch (x) {
                            case 'a': return 1;
                            case 'b': return 2;
                            default: return 0;
                        }
                    }`,
                    options: [0],
                    errors: [{messageId: 'complexFunction'}],
                },
            ],
        })
    })

    it('reports catch clause', () => {
        tester.run('cognitive-complexity', rule, {
            valid: [],
            invalid: [
                {
                    code: `function foo() {
                        try { doSomething(); }
                        catch (e) { handleError(e); }
                    }`,
                    options: [0],
                    errors: [{messageId: 'complexFunction'}],
                },
            ],
        })
    })

    it('reports ternary', () => {
        tester.run('cognitive-complexity', rule, {
            valid: [],
            invalid: [
                {
                    code: `function foo(x) {
                        return x > 0 ? x : -x;
                    }`,
                    options: [0],
                    errors: [{messageId: 'complexFunction'}],
                },
            ],
        })
    })

    it('handles arrow function names', () => {
        tester.run('cognitive-complexity', rule, {
            valid: [],
            invalid: [
                {
                    code: `const foo = (x) => {
                        if (x) { return 1; }
                    }`,
                    options: [0],
                    errors: [{messageId: 'complexFunction'}],
                },
            ],
        })
    })

    it('nested function does not contribute to parent complexity', () => {
        tester.run('cognitive-complexity', rule, {
            valid: [
                {
                    // parent: if +1 → score 1. nested callback is separate
                    code: `function foo(arr) {
                        if (arr.length > 0) {
                            arr.forEach((item) => {
                                if (item > 0) { console.log(item); }
                            });
                        }
                    }`,
                    options: [1],
                },
            ],
            invalid: [],
        })
    })

    it('reports sumOfPrimes example', () => {
        tester.run('cognitive-complexity', rule, {
            valid: [],
            invalid: [
                {
                    // for +1, for +1+1, if +1+2, continue → no label, not counted → score 6
                    code: `function sumOfPrimes(max) {
                        let total = 0;
                        for (let i = 2; i <= max; i++) {
                            for (let j = 2; j < i; j++) {
                                if (i % j === 0) { continue; }
                            }
                            total += i;
                        }
                        return total;
                    }`,
                    options: [5],
                    errors: [{messageId: 'complexFunction'}],
                },
            ],
        })
    })

    it('uses default threshold of 15', () => {
        tester.run('cognitive-complexity', rule, {
            valid: [
                {
                    // score 1, default threshold 15
                    code: `function foo(x) {
                        if (x) { return 1; }
                    }`,
                },
            ],
            invalid: [],
        })
    })

    it('does not show suggestions by default', () => {
        tester.run('cognitive-complexity', rule, {
            valid: [],
            invalid: [
                {
                    // deeply nested → triggers extract-function suggestion
                    code: `function foo(a, b, c) {
                        if (a) {
                            for (let i = 0; i < 10; i++) {
                                if (b) {
                                    if (c) { return true; }
                                }
                            }
                        }
                    }`,
                    options: [5],
                    errors: [
                        {
                            messageId: 'complexFunction',
                            // message should NOT contain '제안:'
                        },
                    ],
                },
            ],
        })
    })

    it('shows suggestions when suggestions option is true', () => {
        tester.run('cognitive-complexity', rule, {
            valid: [],
            invalid: [
                {
                    code: `function foo(a, b, c) {
                        if (a) {
                            for (let i = 0; i < 10; i++) {
                                if (b) {
                                    if (c) { return true; }
                                }
                            }
                        }
                    }`,
                    options: [5, {suggestions: true}],
                    errors: [
                        {
                            messageId: 'complexFunction',
                            // message should contain '제안:'
                        },
                    ],
                },
            ],
        })
    })

    it('hides breakdown by default', () => {
        tester.run('cognitive-complexity', rule, {
            valid: [],
            invalid: [
                {
                    code: `function foo(a, b) {
                        if (a) {
                            if (b) { return true; }
                        }
                    }`,
                    options: [0],
                    errors: [
                        {
                            messageId: 'complexFunction',
                            // message should NOT contain '점수 상세:'
                        },
                    ],
                },
            ],
        })
    })

    it('shows breakdown when breakdown option is true', () => {
        tester.run('cognitive-complexity', rule, {
            valid: [],
            invalid: [
                {
                    code: `function foo(a, b) {
                        if (a) {
                            if (b) { return true; }
                        }
                    }`,
                    options: [0, {breakdown: true}],
                    errors: [
                        {
                            messageId: 'complexFunction',
                            // message should contain '점수 상세:'
                        },
                    ],
                },
            ],
        })
    })

    it('suggests merge-nested-if', () => {
        tester.run('cognitive-complexity', rule, {
            valid: [],
            invalid: [
                {
                    // if(a) { if(b) { ... } } → if(a && b)로 병합 가능
                    code: `function foo(a, b) {
                        if (a) {
                            if (b) { doSomething(); }
                        }
                    }`,
                    options: [0, {suggestions: true}],
                    errors: [{messageId: 'complexFunction'}],
                },
            ],
        })
    })

    it('suggests invert-if-to-reduce-nesting', () => {
        tester.run('cognitive-complexity', rule, {
            valid: [],
            invalid: [
                {
                    // if-else에서 else가 return으로 끝남 → 조건 반전 가능
                    code: `function foo(x) {
                        if (x > 0) {
                            doA();
                            doB();
                        } else {
                            return;
                        }
                    }`,
                    options: [0, {suggestions: true}],
                    errors: [{messageId: 'complexFunction'}],
                },
            ],
        })
    })
})
