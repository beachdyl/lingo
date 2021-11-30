const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const csv = require('csv-parser');
const fs = require('fs');
const events = [];
const event_embeds = [];

const channel_table = {
	'VEX U': '#vexu-announcements',
	'Combat': '#combat-announcements',
	'250 Pound': '#250-pound-announcements',
	'Research & Development': '#r-and-d-announcements',
	'Events': '#events-announcements',
	'Outreach': '#outreach-announcements',
	'Fundraising': '#fundraising-announcements',
	'Whole Club': '#announcements',
	'University Team': '#univteam-announcements',
	'Open Lab Hours': '#lab-access',
	'Workshops': '#workshops',
	'Leadership': '#leadership-announcements'
};

const color_table = {
	'VEX U': '#fff908',
	'Combat': '#f50101',
	'250 Pound': '#f50101',
	'Research & Development': '#f501ed',
	'Events': '#f58e01',
	'Outreach': '#01eaf5',
	'Fundraising': '#2ff501',
	'Whole Club': '#532d8e',
	'University Team': '#532d8e',
	'Open Lab Hours': '#532d8e',
	'Workshops': '#f58e01',
	'Leadership': '#2c2c2c'
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('announce')
		.setDescription('Make an announcement in an announcements channel.')
		.addStringOption(option =>
			option
				.setName('channel')
				.setDescription('Which channel would you like to announce in?')
				.setRequired(true)
				.addChoice('Whole Club', 'Whole Club')
				.addChoice('Combat', 'Combat')
				.addChoice('VEX U', 'VEX U')
				.addChoice('Research & Development', 'Research & Development')
				.addChoice('250 Pound', '250 Pound')
				.addChoice('Events', 'Events')
				.addChoice('Fundraising', 'Fundraising')
				.addChoice('University Team', 'University Team')
				.addChoice('Outreach', 'Outreach')
				.addChoice('Workshops', 'Workshops')
				.addChoice('Leadership', 'Leadership')
),
				
	async execute(interaction) {
		await new Promise((resolve) => {
			fs.createReadStream('google/events.csv')
				.pipe(csv({ headers: false }))
				.on('data', (data) => events.push(data))
				.on('end', () => setTimeout(resolve, 1));
		});
		let i = 0;
		for (event of events) {
			if (i > 9) break;
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
				_embed.addField('Description', event[3]);
			}
			event_embeds.push(_embed);
			i++;
		}
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setLabel('View the Calendar')
					.setURL('https://calendar.google.com/calendar/embed?src=5r67hb19jke4qk7jkeftov91f8%40group.calendar.google.com&ctz=America%2FNew_York')
					.setStyle('LINK'),
			);
		await interaction.reply({ephemeral: false, embeds: event_embeds, components: [row] });
	},
};

