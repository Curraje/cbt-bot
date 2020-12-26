import * as Discord from 'discord.js';

import cfg = require('./../bot.json');

import cfgProd = require("./../bot.prod.json");

const config = {...cfg, ...cfgProd};

const client = new Discord.Client();

// Only Triggers once after logging in
client.once('ready', () => {
    console.log("CBT is Online!");
});

// Message Listening Test
client.on('message', message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) { return; }

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const command = args.shift()?.toLowerCase();

    if (command === `user`)
    {
        message.channel.send(`Your Username: ${message.author.username}\nYour ID: ${message.author.id}\nYour Racist Level: Over 9000!`);
    }
    else if (command === `server`)
    {
        message.channel.send(`Guild Name: ${message.guild?.name}
        \nTotal Members: ${message.guild?.memberCount}`);
    }
    else if (command === `args-info`)
    {
        if (!args.length)
        {
            return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
        }

        message.channel.send(`Command name: ${command}\nArguments: ${args}\nArgument Length: ${args.length}`);
    }
    else if (command === `kick`)
    {
        if (!message.mentions.users.size)
        {
            return message.reply('You need to tag a user in order to kick them!');
        }

        const taggedUser = message.mentions.users.first();

        message.channel.send(`You wanted to kick: ${taggedUser?.username}`);

        console.log(`User ${taggedUser} was almost kicked.`);
    }
    else if (command === `avatar`)
    {
        if (!message.mentions.users.size)
        {
            return message.channel.send(`Your avatar: <${message.author.displayAvatarURL({format: "png", dynamic: true})}>`);
        }

        const avatarList = message.mentions.users.map(user => {
            return `${user.username}'s avatar: <${user.displayAvatarURL({format: "png", dynamic: true})}>`;
        });

        message.channel.send(avatarList);
    }
    else if (command === `prune`)
    {
        const amount = parseInt(args[0]) + 1;

        if (isNaN(amount))
        {
            return message.reply('that doesn\'t seem to be a valid number.');
        } else if (amount <= 1 || amount > 100)
        {
            return message.reply('You need to input a number between 2 and 100.');
        }

        if (message.channel.type === 'dm')
        {
            return;
        }

        message.channel.bulkDelete(amount, true);

    }
});

client.login(config.token);