const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ComponentType } = require('discord.js');
// const { MessageActionRow, MessageButton } = require('@discordjs/builders');
const TriviaManager = require('../TriviaManager');
const Utility = require('../Utility');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('trivia')
		.setDescription('Play a game of trivia!'),
	async execute(interaction) {

    if(TriviaManager.checkIfGameExists(interaction.guild.id)) {
      return await interaction.reply(
        {embeds: [
            Utility.createSimpleEmbedMessage(
                '#ff0000',
                'Game already in progress',
                'Game is currently in progress. Please wait for the game to end.',
                interaction.user.displayAvatarURL({format: 'png', dynamic: true})
            )
        ]
      }
    );
    }

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(interaction.guild.id + '-join')
          .setLabel('Join')
          .setStyle('Primary'),
        new ButtonBuilder()
          .setCustomId(interaction.guild.id + '-start')
          .setLabel('Start game !')
          .setStyle('Success'),
      );

    const msg = await interaction.reply(
        {embeds: [
            Utility.createSimpleEmbedMessage(
                '#ff0000',
                'Starting a game of trivia',
                'Click the buttons below to join the game or start the game. You have 15 seconds to start the game. Two or more players are required to start the game.coccc',
                interaction.user.displayAvatarURL({format: 'png', dynamic: true})
            )
        ],
        fetchReply: true,
        components: [row]
      }
    );

    let players = [];
    let startedBy = null;
    let gameStarted = false;
    const collector = msg.createMessageComponentCollector({ ComponentType: ComponentType.Button, time: 15000 });

    collector.on('collect', async i => {
      if(i.customId === interaction.guild.id + '-join'){
        if(!players.includes(i.user)){
          if(players.length <= 5){
            players.push(i.user);
            await i.reply({ content: i.user.username + ' joined the game'});
          } else {
            await i.reply({ content: 'The game is full'});
          }
        } else {
          await i.reply({ content: i.user.username + ' is already in the game'});
        }
      }
      if(i.customId === interaction.guild.id + '-start'){
        if(players.length >= 2){
          gameStarted = true;
          await i.reply({ content: 'Starting the game'});
          startedBy = i.user;
          collector.stop();
        } else {
          await i.reply({ content: 'Not enough players to start the game'});
        }
      }
    });

    collector.on('end', async collected => {
      if(!gameStarted){
        // await interaction.editReply({ content: 'Nobody started the game. Game cancelled', components: []});
        await interaction.editReply(
          {
            embeds: [
              Utility.createSimpleEmbedMessage(
                '#ff0000',
                'Game cancelled',
                'Nobody started the game.',
                interaction.user.displayAvatarURL({format: 'png', dynamic: true})
              )
            ],
            components: []
          });
      } else {
        // await interaction.editReply({ content: 'Game started', components: []});
        await interaction.editReply(
          {
            embeds: [
              Utility.createSimpleEmbedMessage(
              '#ff0000',
              'Game started',
              'Game is currently in progress. Please wait for the game to end.',
              interaction.user.displayAvatarURL({format: 'png', dynamic: true})
              )
            ],
            components: []
          }
        );
        TriviaManager.addGame(interaction.guild.id, players, interaction.channel, startedBy);
          // await triviaManager.startGame();
        TriviaManager.startGame(interaction.guild.id);
      }
    });
	},
};