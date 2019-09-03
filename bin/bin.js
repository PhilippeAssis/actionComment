#!/usr/bin/env node
const actionComment = require('../src/actionComment')
const fs = require('fs')
const path = require('path')
const flags = require('simple-flags')
const helperView = require('simple-flags/lib/helperView')

async function main () {
  const params = {
    args: ['target'],
    target: {
      default: null,
      description: 'Target file'
    },
    handler: {
      default: null,
      description: 'Handler file'
    },
    output: {
      default: null,
      description: 'Output file'
    },
    tag: {
      default: undefined,
      description: 'Tag type, default: #!'
    }
  }

  const { handler, target, output, tag } = flags(params)

  if (target === undefined || handler === null || output === null) {
    return helperView(params)
  }

  const handlerModule = require(path.resolve(process.cwd(), handler))

  const targetContent = fs.readFileSync(path.resolve(process.cwd(), target)).toString()

  const out = await actionComment(targetContent, handlerModule, tag)

  if (output) {
    fs.writeFileSync(path.resolve(process.cwd(), output), out)
    console.log(`${out} created.`)
  } else {
    console.log(out)
  }
}

main()
