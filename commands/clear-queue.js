const { SlashCommandBuilder } = require('discord.js');
const PlayerManager = require('../PlayerManager.js');
const Utility = require('../Utility.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear-queue')
		.setDescription('Clears the queue'),
	async execute(interaction) {
        PlayerManager.clearQueue(interaction.guildId);
		await interaction.reply({embeds: [Utility.createSimpleEmbedMessage('#ff0000', '⏭️ Cleared queue', 'Cleared queue', interaction.user.displayAvatarURL({format: 'png', dynamic: true}))]});
	},
};