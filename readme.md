# actionComment
Matipulate files, text or scripts, enabling the modification of pre-defined blocks with intelligent comments.

### Reason
Need a handler to modify scripts according to need, before running the build


```javascript
actionComment(content || String, handlers || Object{Function}, commentTag = '#!')
```

## Use
#### myFile.txt
```yml
#!addName:start
My name is #name,
your name
is #name too.
#!addName:end

My name is Jack,
your name
is #!insertName too.
```

#### example.js
```javascript
actionComment(
    fs.readFileSync('myFile.txt').toString(), 
    {
      insertName(){
          return `Jack`
      },
      addName(line){
          return line.replace('#name', 'Martin')
      }
    }, 
    '#!'
)
```

#### Result
```text
My name is Martin,
your name
is Martin too.

My name is Jack,
your name
is Jack too.
```

## Create handles
Handlers receive the following parameters:
 - content: `String`
 - line: `Int` line number
 - position: `array`: [init position, end position] 

They may return a promise

#### Handler example
```javascript
function handler(content, line, position){
    return line
}

async function handlerPromise(content, line, position){
    return line
}
```

## CLI
```bash
action-comment [target: path] --handler [path] --output [path] --tag [string] 
```
 - target: Target file
 - output: File that will be created, if nothing happens, exit stdout.
 - handler: Nodejs module with handlers
 - tag: Comment tag
