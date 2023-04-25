const { SlashCommandBuilder } = require('discord.js');
const PlayerManager = require('../PlayerManager.js');
const Utility = require('../Utility.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('show-queue')
		.setDescription('Shows the queue'),
	async execute(interaction) {
        let queue = await PlayerManager.getQueue(interaction.guildId);
        let queueString = '';
        for(let i = 0; i < queue.length; i++){
            queueString += `${i+1}. ${queue[i].title} by ${queue[i].author}\n`;
        }
        await interaction.reply({embeds: [Utility.createSimpleEmbedMessage('#ff0000', '⏭️ Current queue', queueString, interaction.user.displayAvatarURL({format: 'png', dynamic: true}))]});
	},
};