import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import neostandard from 'neostandard'

export default [js.configs.recommended, ...neostandard({noStyle: true}), eslintConfigPrettier]
