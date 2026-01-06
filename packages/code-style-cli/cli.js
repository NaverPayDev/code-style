#!/usr/bin/env node
/* eslint-disable no-console */

import {execSync} from 'child_process'
import fs from 'fs'

import {checkbox, confirm} from '@inquirer/prompts'

import {PACKAGE_MANAGERS, TOOLS, TOOLS_MAP} from './configs.js'

// 1. package.json 존재 확인
if (!fs.existsSync('package.json')) {
    console.error('❌ package.json이 없습니다. 프로젝트 루트에서 실행해주세요.')
    process.exit(1)
}

// 2. 패키지 매니저 감지
function detectPackageManager() {
    for (const [name, {lockFile}] of Object.entries(PACKAGE_MANAGERS)) {
        if (fs.existsSync(lockFile)) return name
    }
    return 'npm'
}

const pm = detectPackageManager()
console.log(`📦 패키지 매니저: ${pm}`)

// 3. 설치된 패키지 확인
const pkgJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
const installedPkgs = {...pkgJson.dependencies, ...pkgJson.devDependencies}

// 4. 패키지 선택 UI
const choices = TOOLS.map((tool) => {
    const isInstalled = tool.packages.some((pkg) => installedPkgs[pkg])
    return {
        ...tool,
        name: isInstalled ? `${tool.value} (설치됨)` : tool.value,
    }
})

const selected = await checkbox({
    message: '설치할 패키지를 선택하세요 (이미 설치된 패키지 선택 시 업데이트)',
    choices,
    pageSize: choices.length,
})

if (selected.length === 0) {
    console.log('⚠️ 선택된 패키지가 없습니다.')
    process.exit(0)
}

const selectedTools = selected.map((value) => TOOLS_MAP[value])
console.log('✅ 선택된 패키지:', selected)

// 5. 패키지 설치
const packagesToInstall = selectedTools.flatMap((tool) => tool.packages)

if (packagesToInstall.length > 0) {
    console.log('\n📥 패키지 설치 중...')
    try {
        execSync(`${PACKAGE_MANAGERS[pm].installCmd} ${packagesToInstall.join(' ')}`, {stdio: 'inherit'})
        console.log('✅ 패키지 설치 완료!')
    } catch {
        console.error('❌ 패키지 설치 실패. 네트워크 연결을 확인하거나 수동으로 설치해주세요.')
        process.exit(1)
    }
}

// 6. 설정 파일 생성
for (const tool of selectedTools) {
    if (!tool.configFile) continue

    if (fs.existsSync(tool.configFile)) {
        const overwrite = await confirm({
            message: `${tool.configFile} 이미 존재합니다. 덮어쓰시겠습니까?`,
            default: false,
        })
        if (!overwrite) {
            console.log(`⏭️ ${tool.configFile} 스킵`)
            continue
        }
    }

    if (tool.copyFrom) {
        if (!fs.existsSync(tool.copyFrom)) {
            console.error(`❌ ${tool.copyFrom} 파일을 찾을 수 없습니다.`)
            continue
        }
        const content = fs.readFileSync(tool.copyFrom, 'utf-8')
        fs.writeFileSync(tool.configFile, content)
    } else if (tool.getContent) {
        const content = tool.getContent()
        if (!content) {
            console.error(`❌ ${tool.configFile} 생성에 필요한 정보를 찾을 수 없습니다.`)
            continue
        }
        fs.writeFileSync(tool.configFile, content)
    } else if (tool.configContent) {
        fs.writeFileSync(tool.configFile, tool.configContent)
    }
    console.log(`✅ ${tool.configFile} 생성 완료`)
}

console.log('\n🎉 완료!')
