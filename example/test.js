const actionComment = require("../src/actionComment")()
const fs = require("fs")

var file = fs.readFileSync("./fileTest.js").toString()

var fileTest = actionComment.string(file).handles({
    custom(line, index){
        return `//${line}`
    },
    changeComment(line, index){
        return line.replace("/*","****").replace("*/","****").trim()
    }
}).exec()

console.log(fileTest)

//!changeComment
/* Isso foi importado! */
//!changeComment:end