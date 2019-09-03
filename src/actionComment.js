async function actionComment (content, handlers, commentTag = '#!') {
  let curHandler = null

  const mapping = content
    .split('\n')
    .map(async (line, index) => {
      const regTag = RegExp(`${commentTag}([a-zA-Z])+((:run)||(:start)||(:end))+`, 'g')
      const command = line.match(regTag)

      if (command === null) {
        if (curHandler) {
          if (handlers[curHandler]) {
            return await handlers[curHandler].call(this, line, index, this.position)
          } else {
            throw new Error(`${curHandler} handler not defined.`)
          }
        }

        return line
      }

      const commandSplit = command[0].split(':')
      const commandName = commandSplit[0].replace(commentTag, '')
      const commandAction = commandSplit[1] || 'run'

      if (commandAction === 'end') {
        if (curHandler === commandName) {
          curHandler = null
          this.position = null
        } else {
          throw new Error(`Command ${commandName} can not be terminated because it has not been started.`)
        }
      } else if (commandAction === 'start') {
        curHandler = commandName
      } else if (commandAction === 'run') {
        const resolve = await handlers[commandName].call(this, line, index, this.position)
        return line.replace(command[0], resolve)
      }

      // Delete a command line by default
      return `${commentTag}removeLine:run`
    })

  const resolve = await Promise.all(mapping)

  const result = resolve.filter((line) => {
    return !(line && line.indexOf(`${commentTag}removeLine:run`) === 0)
  })

  return result.join('\n')
}

module.exports = actionComment
