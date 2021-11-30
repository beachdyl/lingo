const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const csv = require('csv-parser');
const fs = require('fs');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('calendar')
		.setDescription('Get a list of upcoming meetings and events!')
		.addStringOption(option =>
			option
				.setName('section')
				.setDescription('Show only events for one section.')
				.setRequired(false)
				.addChoice('Combat', 'Combat')
				.addChoice('VEXU', 'VEX U')
				.addChoice('Research & Development', 'Research & Development')
				.addChoice('250 Pound', '250 Pound')
				.addChoice('Events', 'Events')
				.addChoice('Fundraising', 'Fundraising')
				.addChoice('Outreach', 'Outreach')
				.addChoice('Leadership', 'Leadership')
				.addChoice('Workshops', 'Workshops')
				.addChoice('Open Lab Hours', 'Open Lab Hours')
				.addChoice('General', 'General')),

	async execute(interaction) {
		const section = interaction.options.getString('section');
		const events = [];
		const event_embeds = [];
		//console.log(section);
		await new Promise((resolve) => {
			fs.createReadStream('google/events.csv')
				.pipe(csv({ headers: false }))
				.on('data', (data) => events.push(data))
				.on('end', () => setTimeout(resolve, 1));
		});

		let i = 0;
		for (event of events) {
			if (i > 9) break;
			if (section !== event[1] && section !== null && event[1] !== 'General') continue;
			if (event[0] === 'cancelled') continue;
			const _embed = new MessageEmbed()
				.setColor(`${event[7]}`)
				//.setThumbnail('https://i.ibb.co/cDrSdS5/PF-Flame.png')
				.setTitle(event[2])
				.setDescription(`${event[5]} - ${event[6]}`);
			if (event[1]) {
				_embed.setAuthor(event[1], 'https://i.ibb.co/cDrSdS5/PF-Flame.png', 'https://purplefire.org')
			} else {
				_embed.setAuthor('Purple Fire Robotics', 'https://i.ibb.co/cDrSdS5/PF-Flame.png', 'https://purplefire.org')
			}
			if (event[4]) {
				_embed.addField('Location', event[4], true);
			}
			if (event[3]) {
				//_embed.addField('Description', event[3]);
			}
			event_embeds.push(_embed);
			i++;
		}

		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setLabel('Open the Calendar')
					.setURL('https://calendar.google.com/calendar/embed?src=5r67hb19jke4qk7jkeftov91f8%40group.calendar.google.com&ctz=America%2FNew_York')
					.setStyle('LINK'),
			);

		if (event_embeds.length === 0) 
			await interaction.reply({content:'This section has no events coming up.', components: [row]});
		else
			await interaction.reply({ephemeral: false, embeds: event_embeds, components: [row] });
	},
};

