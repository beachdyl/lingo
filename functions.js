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

let correctWord = async function(message, client) {


    console.log('congrats '+message.author.username);
    //await new Promise (function(resolve) {setTimeout(resolve, 200);});
    client.channels.cache.get(channelId).lastMessage.react('✅');
};

let incorrectWord = async function(message, client) {


    console.log('fool '+message.author.username);
    client.channels.cache.get(channelId).lastMessage.react('❌');
    await new Promise (function(resolve) {setTimeout(resolve, 1000);});
};

module.exports = { matchWord, matchUsed, correctWord} ;