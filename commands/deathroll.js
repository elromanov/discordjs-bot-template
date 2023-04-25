const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deathroll')
		.setDescription('Deathroll with a friend!')
        .addIntegerOption(option =>
            option.setName('maxnumber')
                .setDescription('deathroll max number')
                .setMinValue(2)
                .setRequired(true)),
	async execute(interaction) {
        let rd = Math.floor(Math.random() * (interaction.options.getInteger('maxnumber'))) + 1;
        return await interaction.reply('Rolled ' + rd + ' out of ' + interaction.options.getInteger('maxnumber') + '!');
	},
};