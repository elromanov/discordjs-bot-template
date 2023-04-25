const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Displays discord avatar')
        .addUserOption(option => option.setName('user').setDescription('user')),
	async execute(interaction) {
        let userParameter = interaction.options.getUser('user');

        if(userParameter == null){
            await interaction.reply(interaction.user.displayAvatarURL({format: 'png', dynamic: true}));
        } else {
            await interaction.reply(userParameter.displayAvatarURL({format: 'png', dynamic: true}));
        }
	},
};