// Require the necessary files and modules
const fs = require('fs');
const errHandle = require ('./errorHandler.js');

let length;

// isWord function. Returns a value, usually 0 or 1, for how many matches there are in the words list
let isWord = async function(word, client) {
    let answer = await new Promise((resolve) => {
        const regEx = new RegExp('\\b'+word+'\\b', "i")
        const result = [];

        // Scan the file for the word
        fs.readFile('./files/US.txt', 'utf8', function (err, contents) {
            //errHandle(err, 1, client)
            let lines = contents.toString().split("\n");
            lines.forEach(line => {
                if (line && line.search(regEx) >= 0) {
                    result.push(line);
                }
            })
            resolve(result);
        })
    }).then(value => {
        // Return how many matches there are. Should only be 0 or 1.
        length = value.length;
        console.log(length);
        return length;
    })
    return length;
};

module.exports = isWord;