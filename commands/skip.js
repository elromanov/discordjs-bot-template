const { SlashCommandBuilder } = require('discord.js');
const PlayerManager = require('../PlayerManager.js');
const Utility = require('../Utility.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skip to the next track in queue'),
	async execute(interaction) {
        let playerIndex = PlayerManager.getPlayerIndex(interaction.guildId);
        PlayerManager.playNextSong(playerIndex);
		await interaction.reply({embeds: [Utility.createSimpleEmbedMessage('#ff0000', '⏭ Skipped song', 'Skipped song', interaction.user.displayAvatarURL({format: 'png', dynamic: true}))]});
	},
};