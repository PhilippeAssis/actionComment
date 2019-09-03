const actionComment = require('../src/actionComment')
const fs = require('fs')
const path = require('path')
const flags = require('simple-flags')

async function main () {
  const { handler, target, output, tag } = flags({
    args: ['target'],
    handler: null,
    output: null,
    tag: undefined
  })

  if (target === undefined || handler === null || output === null) {
    throw new Error('You need to pass target, handler file and output path.')
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
