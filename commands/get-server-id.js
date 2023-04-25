const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('get-server-id')
		.setDescription('Returns server ID')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		await interaction.reply({content: interaction.guildId, ephemeral: true });
	},
};