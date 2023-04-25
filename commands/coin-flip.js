const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('coinflip')
		.setDescription('Flips a coin'),
	async execute(interaction) {
        let answers = ["Heads !", "Tails !"];
		await interaction.reply(answers[Math.floor(Math.random()*2)]);
	},
};