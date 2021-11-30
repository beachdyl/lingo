// Require the necessary discord.js classes
const fs = require('fs');
const readline = require('readline');
const stream = require('stream');
const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const { token, clientId, guildId, channelId, devChannelId } = require('./config.json');
const errHandle = require ('./errorHandler.js')

// Try deleting old errorTemp.txt if it exists
try {fs.unlinkSync('./errorTemp.txt');}
catch (error) {}

// Create a new client instance
const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
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
//console.log(client.commands);

// Process text messages sent in the correct channel
client.on("messageCreate", message => {
	if (channelId == message.channel.id) console.log(message.content);
	console.log('test1');
	console.log('test2');
	return new Promise((resolve) => {
		console.log('test3');
		const inStream = fs.createReadStream('./files/US.txt');
		const outStream = new stream;
		console.log('test4');
		const rl = readline.createInterface(inStream, outStream);
		const result = [];
		const regEx = new RegExp(message.content, "i")
		rl.on('line', function (line) {
			if (line && line.search(regEx) >= 0) {
				result.push(line);
				console.log('test5');
			}
		});
		rl.on('close', function () {
			console.log('finished search');
			resolve(result);
		});
		
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
			await interaction.reply({ content: 'There was an error while executing this command! Please alert a Dylan.', ephemeral: true });
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