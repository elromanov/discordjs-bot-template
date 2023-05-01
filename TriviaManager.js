const { ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders');
const { questions } = require('./trivia.json');
const Utility = require('./Utility');
const { ComponentType } = require('discord.js');

class TriviaManager {
    static gameList = [];

    static sortPlayersByPoints(players) {
        for(let n = 0; n < players.length; n++){
            const key = players[n].score;
            let k = n - 1;

            while(k >= 0 && players[k].score > key){
                players[k + 1] = players[k];
                k = k - 1;
            }
            players[k + 1].score = key;
        }
        return players;
    }

    static addGame(guildId, players, channel, startedBy) {
        let _players = [];
        for(let i = 0; i < players.length; i++){
            _players.push({player: players[i], score: 0});
        }
        //TODO ONLY SELECT A CERTAIN AMOUNT OF QUESTIONS (eg: 10)
        let _questions = questions;
        _questions = Utility.shuffleArray(_questions); 
        this.gameList.push({guildId: guildId, players: _players, channel: channel, questions: _questions, questionNumber: 1, gameStartedBy: startedBy});
    }

    static removeGame(guildId) {
        let indexToRemove;
        for(let i = 0; i < this.gameList.length; i++){
            if(this.gameList[i].guildId == guildId) indexToRemove = i;
        }
        if(indexToRemove == null) return false;
        this.gameList.splice(indexToRemove, 1);
        return true;
    }

    static checkIfGameExists(guildId) {
        return this.gameList.some(game => game.guildId === guildId);
    }

    static getGameId(guildId) {
        for(let i = 0; i < this.gameList.length; i++){
            if(this.gameList[i].guildId == guildId) return i;
        }
        return null;
    }

    static removeQuestionFromList(guildId) {
        let indexToRemove;
        for(let i = 0; i < this.gameList.length; i++){
            if(this.gameList[i].guildId == guildId) indexToRemove = i;
        }
        if(indexToRemove == null) return false;
        this.gameList[indexToRemove].questions.splice(0, 1);
        return true;
    }

    static startGame(guildId) {
        this.askQuestion(guildId);
    }

    static endGame(guildId) {
        let id = this.getGameId(guildId);
        let scores = "Scores:\n";
        // let plrs = this.mergeSortPlayers(this.gameList[id].players);
        let plrs = this.sortPlayersByPoints(this.gameList[id].players);
        plrs.reverse();

        for(let i = 0; i < plrs.length; i++){
            scores += plrs[i].player.username + " - " + plrs[i].score + "\n";
        }

        this.gameList[id].channel.send({
            embeds: [
                Utility.createSimpleEmbedMessage(
                    '#ff0000',
                    'Game ended! Congratulations ' + plrs[0].player.username + ' !',
                    scores,
                    this.gameList[id].gameStartedBy.avatarURL({dynamic: true, format: 'png'})
                )
            ]
        });

        this.removeGame(guildId);
        return;
    }

    static async askQuestion(guildId) {
        let id = this.getGameId(guildId);
        if(id == null) return false;
        if(this.gameList[id].questions.length == 0) return this.endGame(guildId);

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(guildId + '-0')
                    .setLabel('1')
                    .setStyle('Primary'),
                new ButtonBuilder()
                    .setCustomId(guildId + '-1')
                    .setLabel('2')
                    .setStyle('Primary'),
                new ButtonBuilder()
                    .setCustomId(guildId + '-2')
                    .setLabel('3')
                    .setStyle('Primary'),
                new ButtonBuilder()
                    .setCustomId(guildId + '-3')
                    .setLabel('4')
                    .setStyle('Primary')
            );

        // Send question to channel
        let question = this.gameList[id].questions[0];
        const msg = await this.gameList[id].channel.send({embeds: [
            Utility.createTriviaEmbedMessage(
                this.gameList[id].questionNumber,
                question.answers[0].answer,
                question.answers[1].answer,
                question.answers[2].answer,
                question.answers[3].answer,
                question.question
            )
        ], components: [row]});

        let player_length = this.gameList[id].players.length;
        let goodAnswer = question.goodAnswer;
        let answeredBy = [];
        const collector = msg.createMessageComponentCollector({ ComponentType: ComponentType.Button, time: 15000 });

        collector.on('collect', async i => {
            if(answeredBy.includes(i.user.id)) return i.reply({content: 'You already answered!', ephemeral: true});
            answeredBy.push(i.user.id);
            if(i.customId == guildId + '-' + goodAnswer){
                i.reply({content: 'Correct!', ephemeral: true});
                for(let j = 0; j < player_length; j++){
                    if(i.user.id == this.gameList[id].players[j].player.id){
                        this.gameList[id].players[j].score++;
                    }
                }
            } else {
                i.reply({content: 'Wrong!', ephemeral: true});
            }
            if(answeredBy.length == player_length){
                collector.stop();
            }
        });

        collector.on('end', async (collected) => {
            row.components.forEach(element => {
                element.setDisabled(true);
            });
            msg.edit({components: [row]});
            Utility.sleep(500);
            await this.gameList[id].channel.send({embeds: [Utility.createSimpleEmbedMessage('#ff0000', 'Time\'s up!', 'The correct answer was: ' + question.answers[goodAnswer].answer + "\n" + question.explanation, this.gameList[id].gameStartedBy.avatarURL({format: 'png', dynamic: true}))]})
            this.gameList[id].questionNumber++;
            this.removeQuestionFromList(guildId);
            Utility.sleep(5000);
            this.askQuestion(guildId);
        });

        return;
    }
}

module.exports = TriviaManager;