# CBT Discord Bot
A discord bot written in TypeScript.

## Inspiration
The api and structure of this project was based on and inspired by [this discord bot](https://github.com/Leopotam/discord-bot) made by user [Leopotam](https://github.com/Leopotam) and [bongo bot](https://top.gg/bot/339926969548275722), which you can support [here](https://www.patreon.com/bongobot).

## Installation

This bot requires node.js to install.

### Add your Discord Token
In order for the bot to work, you need to create a file named "bot.prod.json" in the root directory with your auth token like so:

```
{
    "token": "DISCORD TOKEN HERE"
}
```

### Build Files
Do npm install to install the required packages, then do npm run build to transpile the TS files to JS files. Ensure you are in the root directory:

```
npm install
npm run build
```
Check that the 'dist' folder has been created, and ensure it contains the 'data' folder. If it does not, copy the 'data' folder into dist.

## Start the Bot
To start the bot, do `npm start` in the root directory.