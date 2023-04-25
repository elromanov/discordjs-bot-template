const { SlashCommandBuilder } = require('discord.js');
const PlayerManager = require('../PlayerManager.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('loop-queue')
		.setDescription('Loops the whole queue'),
	async execute(interaction) {
        let loopStatus = PlayerManager.changeLoopQueueStatus(interaction.guildId);
        interaction.reply('Queue loop status: ' + loopStatus);
	},
};