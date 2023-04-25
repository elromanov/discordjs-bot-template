const { SlashCommandBuilder } = require('discord.js');
const PlayerManager = require('../PlayerManager.js');
const { getVoiceConnection, joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const Utility = require('../Utility');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('pauses the playback of the player'),
	async execute(interaction) {
        let pauseStatus = PlayerManager.changePauseStatus(interaction.guildId);
        if(pauseStatus){
    		await interaction.reply({embeds: [Utility.createSimpleEmbedMessage('#ff0000', '⏸ Player paused', 'Player paused !', interaction.user.displayAvatarURL({format: 'png', dynamic: true}))]});
            
        } else {
            await interaction.reply({embeds: [Utility.createSimpleEmbedMessage('#ff0000', '▶ Player resumed', 'Player resumed !', interaction.user.displayAvatarURL({format: 'png', dynamic: true}))]});
        }
	},
};