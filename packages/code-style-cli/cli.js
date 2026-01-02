#!/usr/bin/env node
/* eslint-disable no-console */

import {execSync} from 'child_process'
import fs from 'fs'

import {checkbox} from '@inquirer/prompts'

// 1. package.json 존재 확인
if (!fs.existsSync('package.json')) {
    console.error('package.json이 없습니다. 프로젝트 루트에서 실행해주세요.')
    process.exit(1)
}

// 2. 패키지 매니저 감지
function detectPackageManager() {
    if (fs.existsSync('pnpm-lock.yaml')) return 'pnpm'
    if (fs.existsSync('yarn.lock')) return 'yarn'
    return 'npm'
}

const pm = detectPackageManager()
console.log(`패키지 매니저: ${pm}`)

// 3. 패키지 선택 UI
const selected = await checkbox({
    message: '설치할 패키지를 선택하세요',
    choices: [
        {name: '@naverpay/eslint-config', value: 'eslint-config'},
        {name: '@naverpay/prettier-config', value: 'prettier-config'},
        {name: '@naverpay/stylelint-config', value: 'stylelint-config'},
        {name: '@naverpay/markdown-lint', value: 'markdown-lint'},
        {name: '@naverpay/editorconfig', value: 'editorconfig'},
        {name: '@naverpay/oxlint-config', value: 'oxlint-config'},
        {name: '@naverpay/biome-config', value: 'biome-config'},
    ],
})

console.log('선택된 패키지:', selected)

// 4. 패키지 설치
if (selected.length > 0) {
    const packages = selected.map((pkg) => `@naverpay/${pkg}`).join(' ')
    const installCmd = {
        npm: `npm install -D ${packages}`,
        yarn: `yarn add -D ${packages}`,
        pnpm: `pnpm add -D ${packages}`,
    }

    console.log('\n패키지 설치 중...')
    execSync(installCmd[pm], {stdio: 'inherit'})
    console.log('패키지 설치 완료!')
} else {
    console.log('선택된 패키지가 없습니다.')
}

// TODO: 설정 파일 생성
