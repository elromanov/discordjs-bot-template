const { SlashCommandBuilder } = require('discord.js');
const PlayerManager = require('../PlayerManager.js');
const Utility = require('../Utility.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('shuffle')
		.setDescription('Shuffles the queue'),
	async execute(interaction) {
        PlayerManager.shuffleQueue(interaction.guildId);
		await interaction.reply({embeds: [Utility.createSimpleEmbedMessage('#ff0000', '🔀 Shuffled playlist', 'Shuffled playlist', interaction.user.displayAvatarURL({format: 'png', dynamic: true}))]});
	},
};