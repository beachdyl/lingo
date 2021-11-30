// Require the necessary files and modules
const fs = require('fs');
const errHandle = require ('./errorHandler.js');

let length;

let isWord = function(word, client) {
    new Promise((resolve) => {
        console.log('test2', word);
        const regEx = new RegExp('\\b'+word+'\\b', "i")
        const result = [];

        fs.readFile('files/US.txt', 'utf8', function (err, contents) {
            errHandle(err, 1, client)
            let lines = contents.toString().split("\n");
            lines.forEach(line => {
                if (line && line.search(regEx) >= 0) {
                    result.push(line);
                }
            })
            resolve(result);
        })
    }).then(value => {
        length = value;
        console.log(length);
    })
    console.log(length);
    return length;
};

module.exports = isWord;