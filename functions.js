// Require the necessary files and modules
const fs = require('fs');
const errHandle = require ('./errorHandler.js');
const { channelId } = require('./config.json');

// matchWord function. Returns a value, usually 0 or 1, for how many matches there are in the words list
let matchWord = async function(word) {
    let length;
    let answer = await new Promise((resolve) => {
        const regEx = new RegExp('\\b'+word+'\\b', "i")
        const result = [];

        // Scan the file for the word
        fs.readFile('./files/US.txt', 'utf8', function (err, contents) {
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
    })
    return length;
};

let matchUsed = async function(word) {
    let length;
    let answer = await new Promise((resolve) => {
        const regEx = new RegExp('\\b'+word+'\\b', "i")
        const result = [];

        // Scan the file for the word
        fs.readFile('./files/Used.txt', 'utf8', function (err, contents) {
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
    })
    return length;
};

let whoSaid = async function(word) {
    let answer = await new Promise((resolve) => {
        const regEx = new RegExp('\\b'+word+'\\b', "i")
        let result = [];

        // Scan the file for the word
        fs.readFile('./files/Used.txt', 'utf8', function (err, contents) {
            let lines = contents.toString().split("\n");
            lines.forEach(line => {
                if (line && line.search(regEx) >= 0) {
                    result.push(line);
                }
            })
            result = result[0];
            result = result.substring(result.indexOf(" ")+1, result.length);
            resolve(result);
        })
    });
    return answer;
};

let correctWord = async function(message) {
    console.log('congrats '+message.author.username);
    message.react('✅');
    fs.appendFileSync('./files/Used.txt',`${message.content} ${message.author.id}\n`);
};

let deleteWord = async function(message) {
    console.log('fool '+message.author.username);
    message.react('❓');
    await new Promise (function(resolve) {setTimeout(resolve, 2700);});
    message.delete();
    fs.appendFileSync('./files/Wrong.txt',`${message.content} ${message.author.id}\n`);
};

let wrongWord = async function(message) {
    console.log('fool '+message.author.username);
    message.react('❌');
};

module.exports = { matchWord, matchUsed, correctWord, deleteWord, wrongWord, whoSaid } ;