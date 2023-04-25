const { getVoiceConnection, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const pdl = require('play-dl');
const Utility = require('./Utility');

class PlayerManager {
    static playerList = [];
    
    static addPlayer(audioPlayer, guildId, channel){
        this.playerList.push({player: audioPlayer, guildId: guildId, queue: [], loopQueue: false, queueIndex: 0, pauseStatus: false, hasListener: false, channel: channel});
    }
    
    static removePlayer(guildId){
        let indexToRemove;
        for(let i = 0; i < this.playerList.length; i++){
            if(this.playerList[i].guildId == guildId) indexToRemove = i;
        }
        if(indexToRemove == null) return false;
        this.playerList[indexToRemove].player.stop();
        this.playerList.splice(indexToRemove, 1);
        return true;
    }

    static hasPlayer(guildId){
        for(let i = 0; i < this.playerList.length; i++){
            if(this.playerList[i].guildId == guildId) return true;
        }
        return false;
    }

    static getPlayer(guildId){
        for(let i = 0; i < this.playerList.length; i++){
            if(this.playerList[i].guildId == guildId) return this.playerList[i].player;
        }
        return null;
    }

    static getPlayerData(guildId){
        for(let i = 0; i < this.playerList.length; i++){
            if(this.playerList[i].guildId == guildId) return this.playerList[i];
        }
        return null;
    }

    static changeLoopQueueStatus(guildId){
        let id = this.getPlayerIndex(guildId);
        this.playerList[id].loopQueue = !this.playerList[id].loopQueue;   
        return this.playerList[id].loopQueue;
    }

    static changePauseStatus(guildId){
        let id = this.getPlayerIndex(guildId);
        if(this.playerList[id].pauseStatus == false){
            this.playerList[id].player.pause()
        } else {
            this.playerList[id].player.unpause();
        }
        this.playerList[id].pauseStatus = !this.playerList[id].pauseStatus;   
        return this.playerList[id].pauseStatus;
    }

    static getQueueLength(guildId){
        for(let i = 0; i < this.playerList.length; i++){
            if(this.playerList[i].guildId == guildId) return this.playerList[i].queue.length;
        }
        return -1;
    }

    static getPlayerIndex(guildId){
        for(let i = 0; i < this.playerList.length; i++){
            if(this.playerList[i].guildId == guildId) return i;
        }
        return null;
    }

    static incrementQueueIndex(guildId){
        let index = this.getPlayerIndex(guildId);
        this.playerList[index].queueIndex += 1;
    }

    static resetQueueIndex(p_id){
        this.playerList[p_id].queueIndex = 0;
    }

    static async playNextSong(player_id){
        if(this.playerList[player_id].queue.length > 0){
            if(this.playerList[player_id].queue.length > this.playerList[player_id].queueIndex){
                const stream = await pdl.stream(this.playerList[player_id].queue[this.playerList[player_id].queueIndex].url);
                // Create discord audio ressource
                const audioRessource = createAudioResource(stream.stream, {
                    inputType: stream.type
                });
                this.playerList[player_id].player.play(audioRessource);
                const songData = await pdl.video_basic_info(this.playerList[player_id].queue[this.playerList[player_id].queueIndex].url);
                this.playerList[player_id].channel.send({embeds: [Utility.createSimpleEmbedMessage('#ff0000', '🔉 Now playing', 'Playing ' + songData.video_details.title + ' by ' + songData.video_details.channel.name, this.playerList[player_id].queue[this.playerList[player_id].queueIndex].user.displayAvatarURL({format: 'png', dynamic: true}))]});
                this.incrementQueueIndex(this.playerList[player_id].guildId);
            } else {
                if(this.playerList[player_id].loopQueue == true){
                    this.resetQueueIndex(player_id);
                    const stream = await pdl.stream(this.playerList[player_id].queue[this.playerList[player_id].queueIndex].url);
                    // Create discord audio ressource
                    const audioRessource = createAudioResource(stream.stream, {
                        inputType: stream.type
                    });
                    this.playerList[player_id].player.play(audioRessource);
                    const songData = await pdl.video_basic_info(this.playerList[player_id].queue[this.playerList[player_id].queueIndex].url);
                    this.playerList[player_id].channel.send({embeds: [Utility.createSimpleEmbedMessage('#ff0000', '🔉 Now playing', 'Playing ' + songData.video_details.title + ' by ' + songData.video_details.channel.name, this.playerList[player_id].queue[this.playerList[player_id].queueIndex].user.displayAvatarURL({format: 'png', dynamic: true}))]});
                    this.incrementQueueIndex(this.playerList[player_id].guildId);
                } else {
                    const connection = await getVoiceConnection(this.playerList[player_id].guildId);
                    this.removePlayer(this.playerList[player_id].guildId);
                    connection.destroy();
                }
            }
        } else {
            this.playerList[player_id].player.stop();
        }
    }

    static async appendTrackToPlaylist(audioRessource, guildId, user){
        let p_id = this.getPlayerIndex(guildId);
        let song_info = await pdl.video_basic_info(audioRessource);
        this.playerList[p_id].queue.push({url: audioRessource, user: user, title: song_info.video_details.title, author: song_info.video_details.channel.name});

        if(this.playerList[p_id].hasListener == false){
            this.playerList[p_id].hasListener = true;

            const stream = await pdl.stream(this.playerList[p_id].queue[this.playerList[p_id].queueIndex].url);
            // Create discord audio ressource
            const audioRessource = createAudioResource(stream.stream, {
                inputType: stream.type
            });
            this.playerList[p_id].player.play(audioRessource);
            this.incrementQueueIndex(this.playerList[p_id].guildId);
            this.playerList[p_id].player.on(AudioPlayerStatus.Idle, () => {
                this.playNextSong(p_id);
            });
        }
    }

    static async clearQueue(guildId){
        let player_id = this.getPlayerIndex(guildId);
        this.playerList[player_id].queue = [];
        this.playerList[player_id].queueIndex = 0;
    }

    static async shuffleQueue(guildId){
        let player_id = this.getPlayerIndex(guildId);
        this.playerList[player_id].queue = Utility.shuffleArray(this.playerList[player_id].queue);

    }

    static async getQueue(guildId){
        let player_id = this.getPlayerIndex(guildId);
        return this.playerList[player_id].queue;
    }
}

module.exports = PlayerManager;