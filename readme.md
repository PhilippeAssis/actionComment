# actionComment
Matipulate files, text or scripts, enabling the modification of pre-defined blocks with intelligent comments.

### Reason
Need a handler to modify scripts according to need, before running the build

## Use
#### test.js
```javascript
actionComment.file("./fileTest.js").handles({
    custom(line, index){
        return `//${line}`
    },
    changeComment(line, index){
        return line.replace("/*","****").replace("*/","****").trim()
    }
}).exec()
```

#### fileTest.js
```javascript
//!clear
This line will be cleaned
//!clear:end

//!remove
These lines will be removed
These lines will be removed
These lines will be removed
These lines will be removed
These lines will be removed
//!remove:end

//!includeNodeModule
// var async = require("./test.js")
//!includeNodeModule:end

//!custom
It's 
custom
!!!
//!custom:end
```

#### Result
Execute `node test.js`
```javascript
var const actionComment = require("../src/actionComment")()

var fileTest = actionComment.file("./fileTest.js").handles({
    custom(line, index){
        return `//${line}`
    },
    changeComment(line, index){
        return line.replace("/*","****").replace("*/","****").trim()
    }
}).exec()

console.log(fileTest)

**** Isso foi importado! ****;

//It's 
//custom
//!!!
```


## Handles included
 - includeNodeModule : Import a nodejs module by instantiating it into a variable.
 - clear: Clean a block 
 - remove: Remove a block 

## Create handles

To create a handler, pass an object with your desired `.handles(OBJECT)`
