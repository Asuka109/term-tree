#!/usr/bin/env node
const { createProgram } = require('./dist/cli');

const program = createProgram();
program.parse(process.argv);
