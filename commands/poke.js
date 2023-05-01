const { SlashCommandBuilder } = require('discord.js');
const Utility = require('../Utility');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('poke')
		.setDescription('poke someone')
        .addUserOption(option => option.setName('user').setDescription('user')),
	async execute(interaction) {
		let poked_user = interaction.options.getUser('user');

        poked_user.send({embeds: [
            Utility.createSimpleEmbedMessage(
                '#ff0000',
                '👉 Poke',
                'You have been poked by ' + interaction.user.username + ' !',
                interaction.user.displayAvatarURL({ format: "png", dynamic: true })
            )
        ]});

        await interaction.reply({content: 'You have poked ' + poked_user.username + ' !', ephemeral: true });
	},
};