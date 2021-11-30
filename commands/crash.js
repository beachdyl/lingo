const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('crash')
		.setDescription('Forces the robot to crash. Please do not use this unless you know what you\'re doing.'),
	async execute(interaction) {
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('primary')
					.setLabel('Primary')
					.setStyle('PRIMARY'),
			);
		await interaction.reply({ content: 'Crashing now! Hopefully, I\'ll be back soon.\n**o7**' });
		await interaction.reply({ content: '', components: [row] });
	},
};