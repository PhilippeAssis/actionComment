const actionComment = require("../src/actionComment")()

var fileTest = actionComment.file("./fileTest.js").handles({
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