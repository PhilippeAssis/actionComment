var fs = require("fs"),
    path = require("path")

var actionComment = function(config = {}) {

    var commentTag = config.tag || "//!",
        curHandle;

    this._filePath = null;

    this._fileBuffer = null;
    
    this._fileString = null;

    this._localHandles = {
        "includeNodeModule": (line, index) => {
            if (line.indexOf("require") > -1) {
                var importHandles = this._localHandles
                var include = /\(([^)]+)\)/.exec(line)[1].replace('./', '').replace(/'/g, "").replace(/"/g, "")
                include = path.resolve(process.cwd(), include)

                return `var ${actionComment(config).path(include)._importHandles(importHandles).exec()};`
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

    this.handles = (handles) => {
        for (let key in handles) {
            this._localHandles[key] = handles[key];
        }

        return this;
    }
    
    this.string = (file) => {
        this._fileString = file;

        return this;
    }
    
    this.path = (file) => {
        this._filePath = file;

        return this;
    }

    this.buffer = (buffer) => {
        this._fileBuffer = buffer;

        return this;
    }

    this.exec = () => {
        var file;
        
        if (this._filePath) {
            file = fs.readFileSync(this._filePath).toString()
        }
        else if (this._fileBuffer) {
            file = this._fileBuffer.toString()
        }
        else if (this._fileString) {
            file = this._fileString;
        }

        var _this = this;

        return file
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
