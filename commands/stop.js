const { SlashCommandBuilder } = require('discord.js');
const PlayerManager = require('../PlayerManager.js');
const { getVoiceConnection, joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const Utility = require('../Utility');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stops music and leave voice channel'),
	async execute(interaction) {
        PlayerManager.removePlayer(interaction.guildId);
        const connection = await getVoiceConnection(interaction.guildId);
        if(connection != null){
            connection.destroy();
    		await interaction.reply({embeds: [Utility.createSimpleEmbedMessage('#ff0000', '⛔ Left voice channel', 'Left voice channel', interaction.user.displayAvatarURL({format: 'png', dynamic: true}))]});
        } else {
		    await interaction.reply({embeds: [Utility.createSimpleEmbedMessage('#ff0000', '❓ I\'m not connected to any voice channel', 'I\'m not connected to any voice channel', interaction.user.displayAvatarURL({format: 'png', dynamic: true}))]});
        }
	},
};