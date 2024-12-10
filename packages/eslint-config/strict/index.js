import unicorn from 'eslint-plugin-unicorn'
import sonarjs from 'eslint-plugin-sonarjs'

export default [sonarjs.configs.recommended, unicorn.configs['flat/recommended']]
