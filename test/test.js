const actionComment = require('../src/actionComment')
const handlers = require('./handlers')
const exec = require('child_process').execSync
const path = require('path')
const fs = require('fs')

describe('Action Comment', function () {
  const compare = 'My name is Martin,\nyour name\nis Martin too.\nFinish!'

  it('Start and End', async function () {
    const content = '#!printName:start\nMy name is #name,\nyour name\nis #name too.\n#!printName:end\nFinish!'

    const response = await actionComment(content, handlers)

    if (compare === response) {
      return true
    } else {
      throw new Error('No match')
    }
  })

  it('Run', async function () {
    const content = 'My name is Martin,#!insertName:run.\nFinish!'
    const response = await actionComment(content, handlers)

    if (compare === response) {
      return true
    } else {
      throw new Error('No match')
    }
  })

  it('Bin', function () {
    const filename = 'test-file.tmp'
    const output = 'myNewFile.tmp'
    fs.writeFileSync(filename, compare)

    exec(`node ${path.resolve(__dirname, '..', 'bin/bin.js')} ${filename} --handler ${path.resolve(__dirname, 'handlers.js')} --output ${output}`).toString()
    const outputFile = fs.readFileSync(output).toString()

    fs.unlinkSync(filename)
    fs.unlinkSync(output)

    if (compare === outputFile) {
      return true
    } else {
      throw new Error('No match')
    }
  })
})
