// Require the necessary files and modules
const fs = require('fs');
const errHandle = require ('./errorHandler.js');
const { channelId } = require('./config.json');

// matchWord function. Returns a value, usually 0 or 1, for how many matches there are of the first argument in the words list
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
				};
			});
			resolve(result);
		});
	}).then(value => {
		// Return how many matches there are. Should only be 0 or 1.
		length = value.length;
	});
	return length;
};

// matchUsed function. Returns a value, usually 0 or 1, for how many matches there are of the first argument in the list of words already used
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
				};
			});
			resolve(result);
		});
	}).then(value => {
		// Return how many matches there are. Should only be 0 or 1.
		length = value.length;
	});
	return length;
};

// Allow us to get the ID (as a promise result) of the user that said a word. The word passed in must have already been said.
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
				};
			});
			// Converting the results into a promise-returned user ID string
			result = result[0];
			result = result.substring(result.indexOf(" ")+1, result.length);
			resolve(result);
		});
	});
	return answer;
};

// Allow us to get the score of users
let getScore = function(userid) {
	let userFile = `./files/users/${userid}.txt`

	// If they have a score, get and return it, otherwise, return 0 for no existing score.
	if (fs.existsSync(userFile)) {
		return parseInt(fs.readFileSync(userFile), 10);
	} else {
		return 0;
	};
};

// Process when a correct and accepted word is said
let correctWord = async function(message) {
	message.react('✅');
	fs.appendFileSync('./files/Used.txt',`${message.content} ${message.author.id}\n`);
	fs.writeFileSync(`./files/users/${message.author.id}.txt`,`${getScore(message.author.id)+1}`);
};

// Process when a non-word is said, and delete it
let deleteWord = async function(message) {
	message.react('❓');
	await new Promise (function(resolve) {setTimeout(resolve, 2700);}); // Wait before deleting
	message.delete();
	fs.appendFileSync('./files/Wrong.txt',`${message.content} ${message.author.id}\n`); // Log the message and user for safety
};

// Process when a repeated word is said
let wrongWord = async function(message) {
	message.react('❌');
};

module.exports = { matchWord, matchUsed, correctWord, deleteWord, wrongWord, whoSaid, getScore } ;