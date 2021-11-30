// Require the necessary discord.js classes
const fs = require('fs');
const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const { token, clientId, guildId, channelId, devChannelId } = require('./config.json');
const errHandle = require('./errorHandler.js');
const { matchWord, matchUsed, correctWord, wrongWord, deleteWord } = require('./functions.js');

// Try deleting old errorTemp.txt if it exists
try {fs.unlinkSync('./errorTemp.txt');}
catch (error) {}

// Create a new client instance
const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
	presence: {
		activity: {
			type: "PLAYING", name: "with a dictionary"
		}
	}
});

// Register commands from commands directory
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

try {
	for (const file of commandFiles) {
		const command = require(`./commands/${file}`);
		client.commands.set(command.data.name, command);
	}
} catch (error) {
	try {
		errHandle(`Command registration of command named ${command.data.name}\n${error}`, 1, client);
	} catch (error) {
		errHandle(`Command registration of unknown command\n${error}`, 1, client);
	}
}

// Process text messages
client.on("messageCreate", message => {
	if (channelId !== message.channel.id) return; // Only in the right channel
	if (message.author.bot) return; // Ignore bots

	// See if the word is in the dictionary
	matchWord(message.content)
	.then(val1 => {
		switch (val1) {
			case 1:
				console.log(message.content+' is a word');

				// Given that it is a word, see if the word has been used before
				matchUsed(message.content)
				.then(val2 => {
					switch (val2) {
						case 1:
							console.log(message.content+' has been used');
							wrongWord(message);
							break;
						case 0:
							console.log(message.content+' has not been used');
							correctWord(message);

							break;
						default:
							errHandle(`Evaluation of whether or not ${message.content} has been used returned ${val}`, 1, client);
					};
				});

				break;
			case 0:
				console.log(message.content+' is not a word');
				deleteWord(message);
				break;
			default:
				errHandle(`Evaluation of whether or not ${message.content} is a word returned ${val}`, 1, client);
		};
	});
});

// Process slash command interactions
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	// If interaction is restart command, do things
	if (interaction.commandName === 'restart') {
		client.user.setPresence({status: 'idle'});
		errHandle(`Requested restart`, 8, client)
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		try {
			errHandle(`Interaction named ${interaction.commandName}\n${error}`, 1, client);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		} catch (error) {
			try {
				errHandle(`Error of interaction named ${interaction.commandName}\n${error}`, 5, client);
			} catch (error) {
				errHandle(`Error of interaction of unknown name\n${error}`, 5, client);
			}
		}
	}
});

// Process button interactions
client.on('interactionCreate', interaction => {
	if (!interaction.isButton()) return;
	errHandle(interaction, 1, client);
});

// Do things once the bot is ready
client.on('ready', () => {
	// Set the bot status to online
	client.user.setPresence({status: 'online'});

	// Send a good morning embed
	const readyEmbed = new MessageEmbed()
	.setColor('#00ff00')
	.setTitle('Ready to rock and roll!')
	//.setAuthor('Lingo', 'https://i.ibb.co/cDrSdS5/PF-Flame.png', 'https://beachdyl.com')
	.setDescription('I was asleep, but I am no longer asleep! To make a long story short, ~~I put a whole bag of jellybeans~~ **good morning**!')
	.setTimestamp();
	client.channels.cache.get(devChannelId).send({embeds: [readyEmbed] });

	// Check for persistent errors
	try {
		fs.accessSync('./persistError.txt');
		errHandle(fs.readFileSync('./persistError.txt'), 7, client);
	} catch {}
});

// Check for unhandled errors on each interaction
client.on('interactionCreate', interaction => {
	try {
		fs.accessSync('./tempError.txt');
		errHandle(fs.readFileSync('./tempError.txt'), 3, client);
	} catch {}
});

// Login to Discord using the secret token
client.login(token);