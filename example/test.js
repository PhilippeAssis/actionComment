const actionComment = require("../src/actionComment")()
const fs = require("fs")
const flags = require("simple-flags")


var handlesIos = {
        onlyIos(line, index) {
            return `${line.replace(/!/g,"?")}`
        }
    },
    handlesAndroid = {
        onlyAndroid(line, index) {
            return parseInt(line) + 3
        }
    }

console.log(flags)



var fileTest = actionComment.path("./fileTest.js").handles().exec()

console.log(fileTest)
