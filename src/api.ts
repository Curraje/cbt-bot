import * as Discord from 'discord.js';

export {Discord};

export interface IBotConfig
{
    token: string,
    commands: string[],
    prefix: string
}

export interface IBotCommand
{
    readonly name: string,
    readonly description: string,
    aliases: string[],
    execute(message: Discord.Message, args?: string[]): Promise<void>,
    help(): string
}

export interface IBot
{
    readonly commands: IBotCommand[],
    readonly client: Discord.Client,
    readonly config: IBotConfig
}

export interface IBotEmbed
{
    setColor(text: string): void,
    setTitle(text: string): void,
    setURL(text: string): void,
}