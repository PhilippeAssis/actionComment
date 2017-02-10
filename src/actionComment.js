var fs = require("fs"),
    path = require("path")

var actionComment = function(config = {}) {

    var commentTag = config.tag || "//!",
        curHandle;

    this._localHandles = {
        "includeNodeModule": (line, index) => {
            if (line.indexOf("require") > -1) {
                var importHandles = this._localHandles
                var include = /\(([^)]+)\)/.exec(line)[1].replace('./', '').replace(/'/g, "").replace(/"/g, "")
                include = path.resolve(process.cwd(), include)
                
                return `var ${actionComment(config).file(include)._importHandles(importHandles).exec()};`
            }
        },
        "clear": (line, index) => {
            return ""
        },
        "remove": (line, index) => {
            return `${commentTag}removeThisLine`
        }
    }
    
    this._importHandles = (handles) => {
        this._localHandles = handles;
        return this;
    }

    this.filePath = config.file || null

    this.handles = (handles) => {
        for (let key in handles) {
            this._localHandles[key] = handles[key];
        }

        return this;
    }

    this.file = (filePath) => {
        this.filePath = filePath
        return this;
    }

    this.exec = () => {
        if (!this.filePath) {
            console.error("actionComment:", "File path not defined.")
            return
        }
        
        var _this = this;

        return fs.readFileSync(this.filePath)
            .toString()
            .split("\n")
            .map((line, index) => {
                if (line.indexOf(commentTag) == 0) {
                    var command = line.slice(3).split(":"),
                        commandName = command[0],
                        commandAction = command[1] || "start";

                    if (commandAction == "end") {
                        if (curHandle == commandName) {
                            curHandle = null;
                        }
                        else {
                            console.error("actionComment:", `Command ${commandName} can not be terminated because it has not been started.`)
                        }
                    }
                    else if (commandAction == "start") {
                        curHandle = commandName
                    }

                    //Delete a command line by default
                    return `${commentTag}removeThisLine`;
                }

                if (curHandle) {
                    if (_this._localHandles[curHandle]) {
                        return _this._localHandles[curHandle].call(_this, line, index)
                    }

                    console.error("actionComment:", `${curHandle} handler not defined.`)
                }


                return line;
            })
            .filter((line) => {
                return !(line && line.indexOf(`${commentTag}removeThisLine`) == 0)
            })
            .join("\n")
    }

    return this;

}


module.exports = actionComment
