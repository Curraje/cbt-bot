// TODO
// Shiny Pokemon
// Pokemon Forms: Galar, Alolan, Special
// Evolution Chain
// Other pokemon information
import {IBotCommand, IBot, Discord, pokedex} from '../api';

// import Pokedex from 'pokedex-promise-v2';

import {getRandomInt, capitalize} from '../helper';

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

    public aliases: string[] = ["poke", "mon", "pokedex", "dex"];

    // private pokedex = new Pokedex();

    public init(bot: IBot): boolean
    {
        this._usage = `${bot.config.prefix + this.name}`;
        return true;
    }

    public async execute(message: Discord.Message, args: string[]): Promise<void>
    {
        const request = args.length === 0 ? getRandomInt(1, 898) : args[0];

        let textEntry = `Cannot find pokemon with name or number **${request}**. Does that pokemon actually exist?`;

        try
        {

            const pokemon = pokedex.getPokemonByName(request);

            const pokemonSpecies = pokedex.getPokemonSpeciesByName(request);

            const response = await Promise.all([pokemon, pokemonSpecies]);

            const mon = response[0];
            const species = response[1];

            textEntry = `Could not find an english text entry for ${species.name}`;

            // Find English Pokedex Entry
            for(const entry of species.flavor_text_entries)
            {
                if (entry.language.name === 'en')
                {
                    textEntry = entry.flavor_text;
                    break;
                }
            }

            // Remove New Lines, Form Feeds and Carriage Returns from Pokedex Entry
            textEntry = textEntry.replace(/[\n\f\r]/g, " ");

            // Add Pokemon Types to Type String
            let types = "";

            for (const type of mon.types)
            {
                types += `${capitalize(type.type.name)}\n`;
            }

            // Add Pokemon Stats to String
            let stats = "";
            let total = 0;
            for (const stat of mon.stats)
            {
                const currentStat = stat.base_stat.valueOf();
                total += currentStat;

                if (stat.stat.name === 'special-attack')
                {
                    stats += `**Sp. Atk:**`;
                }
                else if (stat.stat.name === 'special-defense')
                {
                    stats += `**Sp. Def:**`;
                }
                else
                {
                    stats += `**${capitalize(stat.stat.name)}:**`;
                }

                stats += ` ${currentStat}\n`;
            }

            stats += `**__Total:__** ${total}\n`;

            // Embed Fields
            const embedFields = [
                {
                    name: "Base Stats",
                    value: `${stats}`,
                    inline: true,
                },
                {
                    name: "Appearance",
                    value:
                    `Height: ${mon.height/10} m\nWeight: ${mon.weight/10} kg`,
                    inline: true,
                },
                {
                    name: "Types",
                    value: types,
                    inline: true,
                },
            ];
            const embed = new Discord.MessageEmbed()
                .setColor(species.color.name.toUpperCase())
                .setTitle(`#${species.id} - ${capitalize(species.name)}`)
                .setURL(`https://bulbapedia.bulbagarden.net/wiki/${species.name}_(Pok%C3%A9mon)`)
                .setDescription(`${textEntry}`)
                .setThumbnail(`http://img.pokemondb.net/sprites/black-white/anim/normal/${species.name}.gif`)
                .addFields(embedFields)
                .setImage(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${species.id}.png`)
                .setTimestamp()
                ;
            message.channel.send(embed);
            console.log(`Request for ${species.name} with id ${species.id} and color: ${species.color.name}`);
        }
        catch(err)
        {
            console.error(err);
            message.reply(textEntry);
        }
    }
}
