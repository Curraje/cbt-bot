// TODO
// Get it down to only one request | Verdict: Str8 up impossible if I want to display what I am displaying.
// Fix invalid requests, they take just as long as valid ones
// cache the names/id, whichever one was not requested originally, so it does not produce an extra request to the api.
// Pokemon with spaces in their name, query whole args list
// Shiny Pokemon: Thumbnail and Image
// Pokemon Forms: Galar, Alolan, Special (e.g. Wormadam Forms, Rotom Forms, Giratina)
// Evolution Chain / Method
// Smogon Tier for latest gen?
// Region introduced
// Move Count
// Using region, get their thumbnail
// Height and Weight in Imperial
// Fix Formatting for Fields
// Some pokemon with default formes like giratina and wormadam do not have a pokemon endpoint
// Add More Information to Embed
// More examples for edge cases

// REQUEST POKEMON LIST AND CACHE IT SO INVALID REQUESTS ARE QUERIED LOCALLY INSTEAD OF SENDING A REQUEST TO THE SERVER
import {IBotCommand, Discord, pokedex, IBotCommandInfo, CategoryTypes, Argument} from '../api';

import {getRandomInt, capitalize} from '../helper';

export default class PokemonCommand implements IBotCommand
{
    public get info(): IBotCommandInfo { return this._info; }

    public readonly name = "pokemon";

    public readonly descriptions = [
        "Shows information on a random pokemon unless you specify a name or number.",
        "Can search from 1 to 898 (Pokedex Number).",
        "For names with spaces, I haven't figured it out yet, but I will soon!",
    ];

    public readonly arguments: Argument[] =
    [
        {
            required: false,
            name: "name or number",
            allowedValues: null,
        },
    ];

    public readonly aliases: string[] = ["poke", "mon", "pokedex", "dex"];

    private _info!: IBotCommandInfo;

    public init(): boolean
    {
        this._info = {
            name: this.name,
            aliases: this.aliases,
            descriptions: this.descriptions,
            category: CategoryTypes.Pokemon,
            cooldown: 3,
            args: this.arguments,
            permissions: null,
            examples: ["25", "pikachu", ""],
        };
        return true;
    }

    public isValid(): boolean
    {
        return true;
    }

    public async execute(message: Discord.Message, args: string[]): Promise<void>
    {
        const request = args.length === 0 ? getRandomInt(1, 898) : args.join().toLowerCase();

        let textEntry = `Cannot find pokemon with name or number **${request}**. Does that pokemon actually exist?`;

        try
        {
            let mon, species, artworkID;
            if (request.toString().includes('-'))
            {
                mon = await pokedex.getPokemonByName(request);
                species = await pokedex.resource(mon.species.url);
                artworkID = mon.id;
            }
            else
            {
                species = await pokedex.getPokemonSpeciesByName(request);
                mon = await pokedex.getPokemonByName(species.id);
                artworkID = species.id;
            }

            // const response = await Promise.all([pokemon, pokemonSpecies]);

            // const mon = response[0];
            // const species = response[1];

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
                    `Ht.: ${mon.height/10} m\nWt.: ${mon.weight/10} kg`,
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
                .setURL(`https://pokemondb.net/pokedex/${species.name}`)
                .setDescription(`${textEntry}`)
                .setThumbnail(`http://img.pokemondb.net/sprites/black-white/anim/normal/${species.name}.gif`)
                .addFields(embedFields)
                .setImage(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${artworkID}.png`)
                .setTimestamp()
                ;
            message.channel.send(embed);
            console.log(`Request for ${species.name} with id ${species.id} and color: ${species.color.name}`);
        }
        catch(err)
        {
            // console.error(err);
            message.reply(textEntry);
            throw err;
        }
    }
}
