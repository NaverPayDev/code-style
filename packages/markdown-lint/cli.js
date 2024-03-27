#!/usr/bin/env node

const {run} = require('markdownlint-cli2')
run({}, [...process.argv.slice(2), '#**/node_modules'])
