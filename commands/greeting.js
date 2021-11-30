const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('greeting')
		.setDescription('May I introduce myself?'),
	async execute(interaction) {
		const exampleEmbed = new MessageEmbed()
			.setColor('#532d8e')
			.setTitle('Hey there, I\'m Robo-Kathryn!')
			.setAuthor('Purple Fire Robotics', 'https://i.ibb.co/cDrSdS5/PF-Flame.png', 'https://purplefire.org')
			.setDescription('I am here to help out with a few of the simple tasks around here. I\'m still learning, so please, have some patience.')
			.addField('Developer', 'This bot is being developed by <@200316185445793792> and <@581128269584138250>.', true)
			.addField('Problem?', 'Did I make a mistake? No worries, just tell a Dylan.', true)
			.addField('Open Source', 'You can find the source code at https://github.com/beachdyl/purple_fire_bot/', false)
			.addField('Similarity', 'Robo-Kathryn is a work of fiction. Any similarity to actual persons, living or dead, is purely coincidental.', false)
			.setThumbnail('https://i.ibb.co/cDrSdS5/PF-Flame.png')
			.setTimestamp();
		await interaction.reply({ephemeral: false, embeds: [exampleEmbed] });
	},
};

