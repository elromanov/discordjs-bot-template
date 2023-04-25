const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection, joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const pdl = require('play-dl');
const PlayerManager = require('../PlayerManager');
const Utility = require('../Utility');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play-youtube')
		.setDescription('plays music from youtube.')
        .addStringOption(opt => opt.setName('url').setDescription('video url'))
        .addStringOption(opt => opt.setName('name').setDescription('Song name')),
	async execute(interaction) {
        if(!interaction.options.getString('url') && !interaction.options.getString('name')){
            return await interaction.reply({embeds: [Utility.createSimpleEmbedMessage('#ff0000', '❌ Error', 'Please provide a url or song name', interaction.user.displayAvatarURL({format: 'png', dynamic: true}))]});
        } 
        const voice_channel = interaction.member?.voice.channel;
        if(getVoiceConnection(interaction.guildId) == undefined && voice_channel){
            const connection = await joinVoiceChannel({
                channelId: voice_channel.id,
                guildId: voice_channel.guild.id,
                adapterCreator: voice_channel.guild.voiceAdapterCreator,
                selfDeaf: false
            });
        }
        const connection = await getVoiceConnection(interaction.guildId);

        // Create & get new player
        if(PlayerManager.hasPlayer(interaction.guildId) == false){
            const testplayer = createAudioPlayer();
            PlayerManager.addPlayer(testplayer, interaction.guildId, interaction.channel);
            // Link connection & player
            connection.subscribe(testplayer);
            connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
                PlayerManager.removePlayer(interaction.guildId);
                connection.destroy();
            });

            const networkStateChangeHandler = (oldState, newState) => {
                const newUDP = Reflect.get(newState, 'udp');
                clearInterval(newUDP?.keepAliveInterval);
            };

            connection.on('stateChange', (oldState, newState) => {
                Reflect.get(oldState, 'networking')?.off('stateChange', networkStateChangeHandler);
                Reflect.get(newState, 'networking')?.on('stateChange', networkStateChangeHandler);
            });
        }
        if(interaction.options.getString('url')){

            if(interaction.options.getString('url').includes("playlist") == true){
                let playlist_link = await pdl.playlist_info(interaction.options.getString('url'));
                if(!playlist_link) return await interaction.reply({embeds: [Utility.createSimpleEmbedMessage('#ff0000', '❌ Error', 'Invalid playlist link', interaction.user.displayAvatarURL({format: 'png', dynamic: true}))]});
                let test = await playlist_link.all_videos();
                test.forEach(async (e) => {
                    try {
                        await PlayerManager.appendTrackToPlaylist(e.url, interaction.guildId, interaction.user);
                    } catch (e) {
                        console.log(e);
                    }
                });
                // return;
                await interaction.reply({embeds: [Utility.createSimpleEmbedMessage('#ff0000', '🔉 Added to queue', 'Added ' + playlist_link.videoCount + ' songs to queue', interaction.user.displayAvatarURL({format: 'png', dynamic: true}))]});
            } else {
                let player = PlayerManager.getPlayer(interaction.guildId);
                let url = interaction.options.getString('url');

                if(player.state.status != 'idle'){
                    let songInfo = await pdl.video_basic_info(url);
                    PlayerManager.appendTrackToPlaylist(interaction.options.getString('url'), interaction.guildId, interaction.user);
                    await interaction.reply({embeds: [Utility.createSimpleEmbedMessage('#ff0000', '🔉 Added to queue', 'Added ' + songInfo.video_details.title + ' by ' + songInfo.video_details.channel.name + ' to queue', interaction.user.displayAvatarURL({format: 'png', dynamic: true}))]});
                } else {
                    let songInfo = await pdl.video_basic_info(url);
                    PlayerManager.appendTrackToPlaylist(interaction.options.getString('url'), interaction.guildId, interaction.user);
                    await interaction.reply({embeds: [Utility.createSimpleEmbedMessage('#ff0000', '🔉 Now playing', 'Playing ' + songInfo.video_details.title + ' by ' + songInfo.video_details.channel.name, interaction.user.displayAvatarURL({format: 'png', dynamic: true}))]});
                }
            }
        } else if(interaction.options.getString('name')){
            let player = PlayerManager.getPlayer(interaction.guildId);
            let searchQuery = await pdl.search(interaction.options.getString('name'), { limit: 1 });
            let queryResult = searchQuery[0];
            let url = queryResult.url;

            

            if(player.state.status != 'idle'){
                let songInfo = await pdl.video_basic_info(url);
                PlayerManager.appendTrackToPlaylist(url, interaction.guildId, interaction.user);
                await interaction.reply({embeds: [Utility.createSimpleEmbedMessage('#ff0000', '🔉 Added to queue', 'Added ' + songInfo.video_details.title + ' by ' + songInfo.video_details.channel.name + ' to queue', interaction.user.displayAvatarURL({format: 'png', dynamic: true}))]});
            } else {
                let songInfo = await pdl.video_basic_info(url);
                PlayerManager.appendTrackToPlaylist(url, interaction.guildId, interaction.user);
                await interaction.reply({embeds: [Utility.createSimpleEmbedMessage('#ff0000', '🔉 Now playing', 'Playing ' + songInfo.video_details.title + ' by ' + songInfo.video_details.channel.name, interaction.user.displayAvatarURL({format: 'png', dynamic: true}))]});
            }
        }
	},
};