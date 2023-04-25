const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server-info')
		.setDescription('server info')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
        let s = '\`\`\`';
		await interaction.reply(s + 'Server name: ' + interaction.guild.name + 
            '\nMembers: ' + interaction.guild.memberCount +
            '\nCreated: ' + interaction.guild.createdAt + s);
	},
};

