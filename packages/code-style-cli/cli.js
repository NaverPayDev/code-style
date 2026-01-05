#!/usr/bin/env node
/* eslint-disable no-console */

import {execSync} from 'child_process'
import fs from 'fs'

import {checkbox} from '@inquirer/prompts'

import {INSTALL_CMD, TOOLS, TOOLS_MAP} from './configs.js'

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
    choices: TOOLS,
    pageSize: TOOLS.length,
})

if (selected.length === 0) {
    console.log('선택된 패키지가 없습니다.')
    process.exit(0)
}

const selectedTools = selected.map((value) => TOOLS_MAP[value])
console.log('선택된 패키지:', selected)

// 4. 패키지 설치
const packagesToInstall = selectedTools.flatMap((tool) => tool.packages)

if (packagesToInstall.length > 0) {
    console.log('\n패키지 설치 중...')
    execSync(`${INSTALL_CMD[pm]} ${packagesToInstall.join(' ')}`, {stdio: 'inherit'})
    console.log('패키지 설치 완료!')
}

// 5. 설정 파일 생성
for (const tool of selectedTools) {
    if (!tool.configFile) continue

    if (fs.existsSync(tool.configFile)) {
        console.log(`${tool.configFile} 이미 존재합니다. 스킵합니다.`)
        continue
    }

    if (tool.copyFrom) {
        const content = fs.readFileSync(tool.copyFrom, 'utf-8')
        fs.writeFileSync(tool.configFile, content)
    } else if (tool.configContent) {
        fs.writeFileSync(tool.configFile, tool.configContent)
    }
    console.log(`${tool.configFile} 생성 완료`)
}

console.log('\n완료!')
