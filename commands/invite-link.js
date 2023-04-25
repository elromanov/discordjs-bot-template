const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('invite-link')
		.setDescription('creates a valid invite link')
		.addIntegerOption( opt =>
			opt.setName('duration')
				.setDescription('duration of invite link in hours (default 10)')
				.setRequired(false)
		)
		.addIntegerOption( opt => 
			opt.setName('max-uses')
				.setDescription('max number of uses for invite link (default 10)')
				.setRequired(false)	
		),
	async execute(interaction) {
		// await interaction.reply('discord.gg/rKfCtSubcg');
		let channel = interaction.channel;
		let duration = interaction.options.getInteger('duration') == null ? 10 : interaction.options.getInteger('duration');
		let maxUses = interaction.options.getInteger('max-uses') == null ? 10 : interaction.options.getInteger('max-uses');
		let invite = await channel.createInvite({
			maxAge: duration * 60 * 60,
			maxUses: maxUses,
		});
		interaction.reply(invite.url);
	},
};