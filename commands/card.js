const { SlashCommandBuilder } = require('discord.js');
const Utility = require("../Utility.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('card')
		.setDescription('Displays your member card'),
	async execute(interaction) {
        let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        let joinDate = (await interaction.guild.members.fetch(interaction.user.id)).joinedAt;
        joinDate = joinDate.toLocaleDateString("en-US", options).toString();
	    await interaction.reply({embeds: [Utility.createEmbedMessage(
			"#ff0000",
			"Member Card",
			"Member Card",
			interaction.user.displayAvatarURL({ format: "png", dynamic: true }),
			[["Name", `${interaction.user.username}`, true],
			["Member since", joinDate, true]],
			null // You can replace null with an image link to display an image at the bottom of the embed message
		)]});
	},
};