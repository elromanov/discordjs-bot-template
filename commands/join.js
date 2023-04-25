const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection, joinVoiceChannel } = require('@discordjs/voice')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('the bot will join your voice channel'),
	async execute(interaction) {
        const voice_channel = interaction.member?.voice.channel;
        if(getVoiceConnection(interaction.guildId) == undefined && voice_channel){
            const connection = joinVoiceChannel({
                channelId: voice_channel.id,
                guildId: voice_channel.guild.id,
                adapterCreator: voice_channel.guild.voiceAdapterCreator,
                selfDeaf: false
            });
            await interaction.reply('Joined your voice channel.')
        } else {
            await interaction.reply('It no work :(');
        }
	},
};