const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mihir')
		.setDescription('Allows Mihir to consent.')
		.setDefaultPermission(false),
	async execute(interaction) {
		const permissions = [
			{
				id: '201124810141597696',
				type: 'USER',
				permission: true,
			},
		];
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('yesconsent')
					.setLabel('I Consent')
					.setStyle('PRIMARY'),
				new MessageButton()
					.setCustomId('noconsent')
					.setLabel('I Do Not Consent')
					.setStyle('PRIMARY'),
			);
		await interaction.reply({ ephemeral: true, content: 'Hello, Robodaddy. Do you consent?', components: [row] });
	},
};