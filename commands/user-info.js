const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user-info')
		.setDescription('server info'),
	async execute(interaction) {
        let s = '\`\`\`';
		await interaction.reply(`\`\`\`Your username : ${interaction.user.username}\nYour discord ID: ${interaction.user.id}\nCreated: ${interaction.user.createdAt} \`\`\``);
	},
};

