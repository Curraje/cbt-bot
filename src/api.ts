/* eslint-disable no-use-before-define */
import * as Discord from 'discord.js';

import Pokedex from 'pokedex-promise-v2';

export const pokedex = new Pokedex({timeout: 5 * 1000});

export {Discord};

export interface IBotConfig
{
    token: string;
    commands: string[];
    prefix: string;
}

export type Argument = {
    required: boolean;
    name: string;
    allowedValues: (string|number)[] | null;
}

export enum CategoryTypes {
    Pokemon = 'Pokemon',
    Math = 'Math',
    Music = 'Music',
    Util = 'Util',
    Other = 'Other'
}

export interface IBotCommandInfo
{
    readonly name: string;
    readonly aliases: string[];
    readonly descriptions: string[];
    readonly category: CategoryTypes;
    readonly cooldown: number;
    readonly args: Argument[] | null;
    readonly permissions: string | null;
    readonly examples: string[];
}

export interface IBotCommand
{
    readonly name: string;
    readonly descriptions: string[];
    readonly arguments: Argument[] | null;
    readonly info: IBotCommandInfo;
    readonly aliases: string[];
    init(bot?: IBot, dataPath?: string): boolean;
    isValid(message?: Discord.Message, args?: string[]): boolean;
    execute(message: Discord.Message, args?: string[]): Promise<void>;
}

export interface IBot
{
    readonly commands: IBotCommand[];
    readonly client: Discord.Client;
    readonly config: IBotConfig;
    loadCommands(commandPath: string, dataPath: string): void;
}