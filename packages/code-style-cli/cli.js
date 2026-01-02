#!/usr/bin/env node
/* eslint-disable no-console */

import fs from 'fs'

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

// TODO: 패키지 선택 UI
// TODO: 패키지 설치
// TODO: 설정 파일 생성
