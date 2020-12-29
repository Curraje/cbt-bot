/* eslint-disable no-use-before-define */
import * as Discord from 'discord.js';

export {Discord};

export const seconds = 1000;

export interface IBotConfig
{
    token: string;
    commands: string[];
    prefix: string;
}

export interface IBotCommand
{
    readonly name: string;
    readonly descriptions: string[];
    readonly usage: string;
    readonly requires_args: boolean;
    readonly args?: Record<string, string>;
    readonly guildOnly: boolean;
    readonly permissions?: string;
    cooldown?: number;
    aliases: string[];
    execute(message: Discord.Message, args?: string[]): Promise<void>;
    init(bot: IBot): boolean;
    // TODO: add isValid method
}

export interface IBot
{
    readonly commands: IBotCommand[];
    readonly client: Discord.Client;
    readonly config: IBotConfig;
    loadCommands(commandPath: string): void;
}