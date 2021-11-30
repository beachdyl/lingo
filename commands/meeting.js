const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('meeting')
		.setDescription('Need to remind someone where to find meeting info?'),
	async execute(interaction) {
		const exampleEmbed = new MessageEmbed()
			.setColor('#532d8e')
			.setTitle('Purple Fire Robotics Calendar')
			.setURL('https://calendar.google.com/calendar/embed?src=5r67hb19jke4qk7jkeftov91f8%40group.calendar.google.com&ctz=America%2FNew_York')
			.setAuthor('Purple Fire Robotics', 'https://i.ibb.co/cDrSdS5/PF-Flame.png', 'https://purplefire.org')
			.setDescription('Our calendar always has the latest information on our events, meetings, and more!')
			.addField('Integration', 'You can add our calendar to your own Google account by clicking the "+ Google Calendar" button at the botom right of the calendar page.', true)
			.addField('Problem?', 'If you notice an error, just tell any Chairperson or E-Board member.', true)
			.setThumbnail('https://i.ibb.co/cDrSdS5/PF-Flame.png')
			.setTimestamp();
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setLabel('Open the Calendar')
					.setURL('https://calendar.google.com/calendar/embed?src=5r67hb19jke4qk7jkeftov91f8%40group.calendar.google.com&ctz=America%2FNew_York')
					.setStyle('LINK'),
			);
		await interaction.reply({content: 'Hey there! :wave:\nI heard you had a question about an upcoming meeting, which is awesome! Thanks for being involved.\nPurple Fire Robotics has a very handy calendar which lists the meeting you\'re talking about, as well as all of our other events and more!\nGive this button a click and tell me if this answers your question:\n', ephemeral: false, embeds: [], components: [row] });
	},
};

