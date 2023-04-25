const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('censor')
		.setDescription('[ADMIN COMMAND] Deletes \'x\' number of messages')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addIntegerOption(option =>
            option.setName('input')
                .setDescription('Number of messages to delete')
                .setMaxValue(100)
                .setMinValue(1)
                .setRequired(true)),
	async execute(interaction) {
        nbOfMessagesToDelete = interaction.options._hoistedOptions[0].value;
        await interaction.channel.bulkDelete(nbOfMessagesToDelete, true);
		await interaction.reply('Removed ' + nbOfMessagesToDelete + (nbOfMessagesToDelete == 1 ? ' message.' : ' messages.'));
	},
};