# CBT Discord Bot
A discord bot written in TypeScript.

## Inspirtation
The api and structure of this project was based on and inspired by [this discord bot](https://github.com/Leopotam/discord-bot) made by user [Leopotam](https://github.com/Leopotam) and [bongo bot](https://top.gg/bot/339926969548275722), which you can support [here](https://www.patreon.com/bongobot).

## Installation

This bot requires node.js to install.

### Build Files
Do npm install to install the required packages, then do npm run build to transpile the TS files to JS files. Ensure you are in the root directory:

```
npm install
npm run build
```

### Add your Discord Token
In order for the bot to work, you need to create a file named "bot.prod.json" in the root directory with your auth token like so:

```
{
    "token": "DISCORD TOKEN HERE"
}
```

## Start the Bot
To start the bot, do `npm start` in the root directory.