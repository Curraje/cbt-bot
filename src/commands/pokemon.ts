// TODO: Pokemon Command
import {IBotCommand, IBot, Discord} from '../api';

import Pokedex from 'pokedex-promise-v2';

export default class PokemonCommand implements IBotCommand
{
    public get usage(): string { return this._usage; }

    public readonly name = "pokemon";

    public readonly descriptions = [
        "Displays Pokemon Information",
    ];

    public readonly requires_args = true;

    public readonly guildOnly = true;

    private _usage = "";

    public aliases: string[] = ["poke", "mon"];

    private pokedex = new Pokedex();

    public init(bot: IBot): boolean
    {
        this._usage = `${bot.config.prefix + this.name}`;
        return true;
    }

    public async execute(message: Discord.Message, args: string[]): Promise<void>
    {

        if (args.length === 0)
        {
            message.reply(`${this.name} command requires one argument!`);
            return;
        }
        await this.pokedex.getPokemonSpeciesByName(args[0])
            .then(species => {
                message.channel.send(`${species.flavor_text_entries[0].flavor_text}`);
                console.log(`Request for ${species.name}`);
            })
            .catch( err => {
                console.log(err);
                message.reply(`Cannot find pokemon **${args[0]}**. Does that pokemon actually exist?`);
            });

    }
}
