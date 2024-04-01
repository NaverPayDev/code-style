const path = require('path')

const {parse} = require('jsonc-parser')
const markdownlint = require('markdownlint')

describe('markdown lint', () => {
    const config = markdownlint.readConfigSync(path.join(__dirname, '.markdownlint.jsonc'), [parse])

    test('heading-style', () => {
        const errors = markdownlint.sync({
            config,
            strings: {
                'heading-style.good': `# 제목은 atx 스타일로 작성합니다.\n`,
                'heading-style.bad': `# 제한되는 스타일 #\n\n제한되는 스타일\n---------------\n`,
            },
        })

        expect(errors['heading-style.good'].length).toBeLessThanOrEqual(0)
        expect(errors['heading-style.bad'].length).toBeGreaterThan(0)
        expect(errors['heading-style.bad'].every((error) => error.ruleNames.includes('heading-style'))).toBe(true)
    })

    test('ul-style', () => {
        const errors = markdownlint.sync({
            config,
            strings: {
                'ul-style.good': `- ul item은 dash로 작성합니다.\n`,
                'ul-style.bad': `* ul item은 dash로 작성합니다.\n`,
            },
        })

        expect(errors['ul-style.good'].length).toBeLessThanOrEqual(0)
        expect(errors['ul-style.bad'].length).toBeGreaterThan(0)
        expect(errors['ul-style.bad'].every((error) => error.ruleNames.includes('ul-style'))).toBe(true)
    })

    test('commands-show-output', () => {
        const errors = markdownlint.sync({
            config,
            strings: {
                'commands-show-output.good': `\`\`\`$ git stash\`\`\`\n`,
            },
        })

        expect(errors['commands-show-output.good'].length).toBeLessThanOrEqual(0)
    })

    test('no-duplicate-heading', () => {
        const errors = markdownlint.sync({
            config,
            strings: {
                'no-duplicate-heading.good': `# 안건1\n\n## 요약\n\n# 안건2\n\n## 요약\n`,
                'no-duplicate-heading.bad': `# 안건1\n\n## 요약\n\n## 요약\n`,
            },
        })

        expect(errors['no-duplicate-heading.good'].length).toBeLessThanOrEqual(0)
        expect(errors['no-duplicate-heading.bad'].length).toBeGreaterThan(0)
        expect(
            errors['no-duplicate-heading.bad'].every((error) => error.ruleNames.includes('no-duplicate-heading')),
        ).toBe(true)
    })

    test('no-duplicate-heading', () => {
        const errors = markdownlint.sync({
            config,
            strings: {
                'no-duplicate-heading.good': `# 안건1\n\n## 요약\n\n# 안건2\n\n## 요약\n`,
                'no-duplicate-heading.bad': `# 안건1\n\n## 요약\n\n## 요약\n`,
            },
        })

        expect(errors['no-duplicate-heading.good'].length).toBeLessThanOrEqual(0)
        expect(errors['no-duplicate-heading.bad'].length).toBeGreaterThan(0)
        expect(
            errors['no-duplicate-heading.bad'].every((error) => error.ruleNames.includes('no-duplicate-heading')),
        ).toBe(true)
    })

    test('single-h1', () => {
        const errors = markdownlint.sync({
            config,
            strings: {
                'single-h1.good': `# 여러개의 h1을\n\n# 허용 합니다.\n`,
            },
        })

        expect(errors['single-h1.good'].length).toBeLessThanOrEqual(0)
    })

    test('no-trailing-punctuation', () => {
        const errors = markdownlint.sync({
            config,
            strings: {
                'no-trailing-punctuation.good': `# 제목의 구두점을 허용합니다.\n\n# 구두점 없어도 ok\n`,
            },
        })

        expect(errors['no-trailing-punctuation.good'].length).toBeLessThanOrEqual(0)
    })

    test('list-marker-space', () => {
        const errors = markdownlint.sync({
            config,
            strings: {
                'list-marker-space.good': `- 리스트 아이템\n`,
                'list-marker-space.bad': `-   리스트 아이템\n`,
            },
        })

        expect(errors['list-marker-space.good'].length).toBeLessThanOrEqual(0)
        expect(errors['list-marker-space.bad'].length).toBeGreaterThan(0)
        expect(errors['list-marker-space.bad'].every((error) => error.ruleNames.includes('list-marker-space'))).toBe(
            true,
        )
    })

    test('no-inline-html', () => {
        const errors = markdownlint.sync({
            config,
            strings: {
                'no-inline-html.good': `inline html도<br>허용됩니다\n`,
            },
        })

        expect(errors['no-inline-html.good'].length).toBeLessThanOrEqual(0)
    })

    test('no-emphasis-as-heading', () => {
        const errors = markdownlint.sync({
            config,
            strings: {
                'no-emphasis-as-heading.good': `안녕하세요\n\n**강조합니다**\n\n안녕히계세요\n`,
            },
        })

        expect(errors['no-emphasis-as-heading.good'].length).toBeLessThanOrEqual(0)
    })

    test('fenced-code-language', () => {
        const errors = markdownlint.sync({
            config,
            strings: {
                'fenced-code-language.good': '```코드블록의 언어를 지정해주지 않아도 됩니다.```\n',
            },
        })

        expect(errors['fenced-code-language.good'].length).toBeLessThanOrEqual(0)
    })

    test('first-line-h1', () => {
        const errors = markdownlint.sync({
            config,
            strings: {
                'first-line-h1.good': `파일의 첫번째 줄이 h1일 필요는 없습니다.\n`,
            },
        })

        expect(errors['first-line-h1.good'].length).toBeLessThanOrEqual(0)
    })

    test('code-block-style', () => {
        const errors = markdownlint.sync({
            config,
            strings: {
                'code-block-style.good': '```코드블록은 fence로만 가능합니다```\n',
                'code-block-style.bad': '    indent로는 불가능\n',
            },
        })

        expect(errors['code-block-style.good'].length).toBeLessThanOrEqual(0)
        expect(errors['code-block-style.bad'].length).toBeGreaterThan(0)
        expect(errors['code-block-style.bad'].every((error) => error.ruleNames.includes('code-block-style'))).toBe(true)
    })

    test('code-fence-style', () => {
        const errors = markdownlint.sync({
            config,
            strings: {
                'code-fence-style.good': '```코드블록은 백틱으로만 가능합니다```\n',
                'code-fence-style.bad': '~~~틸드로는 불가능~~~\n',
            },
        })

        expect(errors['code-fence-style.good'].length).toBeLessThanOrEqual(0)
        expect(errors['code-fence-style.bad'].length).toBeGreaterThan(0)
        expect(errors['code-fence-style.bad'].every((error) => error.ruleNames.includes('code-fence-style'))).toBe(true)
    })

    test('emphasis-style', () => {
        // FIXME: asterisk가 불가능해야 하는데 가능
        const errors = markdownlint.sync({
            config,
            strings: {
                'emphasis-style.good': '_기울임 스타일은 underscore로 제한_\n',
            },
        })

        expect(errors['emphasis-style.good'].length).toBeLessThanOrEqual(0)
    })

    test('strong-style', () => {
        const errors = markdownlint.sync({
            config,
            strings: {
                'strong-style.good': '**bold는 asterisk로 제한**\n',
                'strong-style.bad': '__underscore로는 불가능__\n',
            },
        })

        expect(errors['strong-style.good'].length).toBeLessThanOrEqual(0)
        expect(errors['strong-style.bad'].length).toBeGreaterThan(0)
        expect(errors['strong-style.bad'].every((error) => error.ruleNames.includes('strong-style'))).toBe(true)
    })
})
