import * as Discord from 'discord.js';


import * as configProd from "./../bot.prod.json";

const client = new Discord.Client();

client.login(configProd.token);

client.once('ready', () => {
    console.log("CBT is Online!");
});