const { SlashCommandBuilder } = require('discord.js');
const Util = require('../Utility.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dice')
		.setDescription('Returns a random number between 1 and 6'),
	async execute(interaction) {
        return interaction.reply(`🎲 ${Util.randomNumberFromZero(6)}`);
	},
};