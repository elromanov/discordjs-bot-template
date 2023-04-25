const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('get-channel-id')
		.setDescription('Returns channel ID')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		await interaction.reply({content: interaction.channelId, ephemeral: true });
	},
};