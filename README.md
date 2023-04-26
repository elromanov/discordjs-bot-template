<h1 align="center">Welcome to Discordjs bot template 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: ISC" src="https://img.shields.io/badge/License-ISC-yellow.svg" />
  </a>
</p>

> This is an opensource discord bot made with discord.js

## Features
This bot is an all purpose bot that features
* fun commands such as `/card`, `/coinflip`, `/deathroll` ...
* utility commands such as `/avatar`, `/invite-link`, `/user-info` ...
* admin commands such as `/censor`, `/get-channel-id`, `/server-info` & more
* And last but not least, full music capabilities making it easy to play songs from youtube on your discord server.

## Install

```sh
npm install
```

> You will have to change `config.json` with your own data (you will have to change `clientId`, `guildId` and `token`).

To get a Discord bot client ID, you'll need to create a new application on the Discord Developer Portal. Once you've created the application, navigate to the "Bot" section and click "Add Bot". This will generate a new bot user for your application, and you'll be able to view the client ID in the "General Information" section.

To obtain a guild ID, you'll need to invite your bot to a Discord server. Once the bot is added to a server, you can right-click on the server name in Discord and select "Copy ID" to get the guild ID.

Finally, to get a bot token, you'll need to navigate back to the "Bot" section of your Discord Developer Portal application and click "Copy" next to the "Token" field. Be sure to keep this token private and secure, as it grants access to your bot user and can be used to perform actions on behalf of your bot in Discord.

> By default `censor` option is set to `true` in `config.json`. If you want to disable it, you will have to change it to `false`. You can change the list of profanities in `profanities.json`.

## Usage

### Register slash commands

```sh
node deploy-commands.js
```

### Launch the bot
```sh
node .
```

## Dependencies

* nodejs ^18.16.0
* npm ^9.6.5

## npm Dependencies
* `discord.js` ^14.5.0
* `@discordjs/rest` ^1.7.0
* `@discordjs/voice` ^0.13.0
* `play-dl` ^1.9.5
* `readme-md-generator` ^1.0.0

## Author

👤 **Romain Chardon**

* Twitter: [@\_romanov3](https://twitter.com/\_romanov3)
* Github: [@elromanov](https://github.com/elromanov)

## Show your support

Give a ⭐️ if this project helped you!