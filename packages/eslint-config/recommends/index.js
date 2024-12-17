import {FlatCompat} from '@eslint/eslintrc'
import path from 'path'
import {fileURLToPath} from 'url'
import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
    baseDirectory: __dirname,
})

export default [js.configs.recommended, ...compat.extends('eslint-config-standard'), eslintConfigPrettier]
