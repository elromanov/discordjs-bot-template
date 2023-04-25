const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, ActivityType } = require('discord.js');
const { token } = require('./config.json');
const jsonFilePath = "./games.json";

const client = new Client({ intents: [
	GatewayIntentBits.DirectMessages,
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences
], });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const forbidenWords = ["bz", "tarlouze", "pédal", "t.arlouze", "faggot", "philosophie ia", "i love turkey", "i am turkish", "nigger", "niger", "n1ger", "n1gger", "n1gg3r", "nigg3r", "fag", "f4g", "nigga", "n1gga", "niga", "nigg4", "n1gg4", "n1g4", "nig4", "bougnoule", "bougnoul", "buñul", "juif", "jew", "ju1f", "j3w", "nègre", "nègres", "negre", "negres"];
const channelsToModerate = ["402915463291731970", "678586273031520260", "393489936705388544"];

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
	client.user.setPresence({
		activities: [{name: 'YOU', type: ActivityType.Listening}],
	});
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on('messageCreate', async (message) => {
	if(forbidenWords.some(word => message.content.toLowerCase().includes(word)) && channelsToModerate.includes(message.channelId)){
		console.log(message);
		message.delete();
	}
});

client.login(token);