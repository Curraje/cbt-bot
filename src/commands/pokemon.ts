// TODO
// Fix Groudon and Kyogre `primal` edgecase so they work like normal megas
// Shiny Mega X does not work
// Need to Try Every Form (Special and Regional) to look for edge cases
// Pokemon who have default forms and a regional (specifically darmanitan so far) need to be accounted for
// Pokemon Forms: Galar, Alolan, Special (e.g. Wormadam Forms, Rotom Forms, Giratina), MEGAS
// Gigantamax (gmax) forms (artwork and requests)
// Artwork for Galarian and Shiny Galarian
// Pikachu Special Forms (Forms with spaces join form name as one word)
// unown pictures (unown is a special case, the forms dont seem to work)
// Different form text entries
// Evolution Chain / Method
// Smogon Tier for latest gen?
// Region introduced
// Move Count
// Using region, get their thumbnail
// Add More Information to Embed
// May want to have a function to parse the pokemon data so code is more maintainable
// Clear Cache for pokedex every once in a while so ram isn't perma doomed
// Chance to show shiny on random
// Move some stuff into pokehelper.ts

import {IBotCommand, IBot, Discord, IBotCommandInfo, CategoryTypes, Argument} from '../api';

import {getRandomInt, capitalize, loadData} from '../helper';

import { Pokemon } from 'pokedex-promise-v2';

import {Regions, pokeData, pokedex} from '../pokehelper';

export default class PokemonCommand implements IBotCommand
{
    public get info(): IBotCommandInfo { return this._info; }

    public readonly name = "pokemon";

    public readonly descriptions = [
        "Shows information on a random pokemon unless you specify a name or number.",
        "Can search from 1 to 898 (Pokedex Number).",
        "Shows data and images for shiny, mega and different forms of pokemon.",
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

    private _Pokedex: pokeData[] = [];

    private _PokeWithForms: pokeData[] = [];

    private _defaultFormExceptions = ["mr-mime", "ho-oh", "mime-jr", "porygon-z", "type-null", "jangmo-o", "hakamo-o", "kommo-o", "tapu"];

    private ALOLA_REGEX = /^.*alola|alola.*$/;
    private GALAR_REGEX = /^.*galar|galar.*$/;
    private SHINY_REGEX = /^.*shiny|shiny.*$/;
    private MEGA_REGEX = /^.*mega|mega.*$/;
    private CLEAN_REGEX = /-*(mega|alolan|galarian|shiny|alola|galar)-*/g;

    private readonly pokedexEnd = Regions.Galar.end;

    public init(bot: IBot, dataPath: string): boolean
    {
        this._info = {
            name: this.name,
            aliases: this.aliases,
            descriptions: this.descriptions,
            category: CategoryTypes.Pokemon,
            cooldown: 3,
            args: this.arguments,
            permissions: null,
            examples: ["25", "pikachu", "shiny pikachu", "alolan raichu", "shiny alolan raichu", "mega charizard x", "landorus therian"],
        };

        console.time(`Data: ${this.name} data loaded in`);
        loadData(dataPath, this._Pokedex).then(data => {
            this._Pokedex = data;
            this._PokeWithForms = data.filter(mon => {return mon.forms;});
            console.timeEnd(`Data: ${this.name} data loaded in`);
        }).catch(err => {
            console.error(`The data for ${this.name} could not be loaded. Ensure data folder is present in dist.`);
            throw err;
        });

        return true;
    }

    public isValid(): boolean { return true; }

    public async execute(message: Discord.Message, args: string[]): Promise<void>
    {
        const request = args.length === 0 ? getRandomInt(1, this.pokedexEnd) : args.join('-').toLowerCase();

        let textEntry = `Cannot find pokemon with name or number **${args.join(' ')}**. Does that pokemon actually exist?`;

        let item: pokeData = {name: '', url:'', alola: false, galar: false, hasMega: false, forms: []};

        const shiny = this.SHINY_REGEX.test(request.toString());
        const mega = this.MEGA_REGEX.test(request.toString());
        const alolan = this.ALOLA_REGEX.test(request.toString());
        const galarian = this.GALAR_REGEX.test(request.toString());

        let xy = '';
        let cleanRequest = request.toString().replace(this.CLEAN_REGEX, '');
        if (mega && (cleanRequest.includes(`charizard`) || cleanRequest.includes(`mewtwo`)))
        {
            if (request.toString().includes(`y`))
            {
                xy = `y`;
                cleanRequest = cleanRequest.replace(/[-y]/g, '');
            }
            else if (request.toString().includes(`x`))
            {
                xy = `x`;
                cleanRequest = cleanRequest.replace(/[-x]/g, '');
            }
        }


        const formRequest = cleanRequest.split('-');
        let form = false;

        // Check Request
        // message.reply(`Clean Request: ${cleanRequest} | Request: ${request} | Form Request: ${formRequest}`);


        if (typeof request === 'string')
        {

            item = this._Pokedex.find(data => {
                return data.name === cleanRequest || (data.name.split('-')[0] === cleanRequest
                && !this._defaultFormExceptions.includes(cleanRequest));
            }) ?? item;

            if (!item.url)
            {
                item = this._PokeWithForms.find(data => {
                    const cleanName = this._defaultFormExceptions.includes(data.name) ? data.name : data.name.split('-')[0];
                    return cleanName === formRequest[0] && !!(data.forms?.find(form => {
                        return `${cleanName}-${form}` === cleanRequest || (`${cleanName}-${form}` === cleanRequest);
                    }));
                }) ?? item;
                form = true;
            }

            const re = parseInt(cleanRequest) - 1;
            if (re >= 0 && re <= this.pokedexEnd - 1)
            {
                item = this._Pokedex[re];
            }

            if (!item.url || (alolan && galarian) || (mega && alolan) || (mega && galarian)) { message.reply(textEntry); return;}
        }

        const validAlolan = alolan && !!(item.alola);
        const validGalarian = galarian && !!(item.galar);
        const validMega = mega && !!(item.hasMega);
        const validForm = form && !!(item.forms);
        const url = typeof request === 'number' ? this._Pokedex[request - 1].url : item.url;
        const index = this._Pokedex.indexOf(item) + 1;

        // Check if a form was requested and checks if that form exists
        if (alolan)
        {
            item.alola ? cleanRequest = `${cleanRequest}-alola`
                : message.reply(`\`${capitalize(cleanRequest)}\` has no **alolan** form! Showing normal instead...`);
        }
        else if (galarian)
        {
            item.galar ? cleanRequest = `${cleanRequest}-galar`
                : message.reply(`${capitalize(cleanRequest)} has no **galarian** form! Showing normal instead...`);
        }
        else if (mega)
        {
            item.hasMega ? cleanRequest = `${cleanRequest}-mega`
                : message.reply(`${capitalize(cleanRequest)} has no **mega** evolution! Showing normal instead...`);

            if (item.hasXY)
            {
                cleanRequest = `${cleanRequest}-${xy}`;
            }
        }

        // message.reply(`Clean Request After Form Checks: ${cleanRequest}`);
        // if (validForm) { message.reply(`Form for ${item.name} is valid`);}

        const pokemon = validForm || validAlolan || validGalarian || validMega ?
            pokedex.getPokemonByName(cleanRequest) : pokedex.resource(url);
        // const pokemonSpecies = pokedex.getPokemonSpeciesByName(index || request);

        const response = await Promise.all([pokemon, pokedex.getPokemonSpeciesByName(index || request)]).catch(err => {
            message.reply(textEntry); throw err;});

        const mon = response[0] as Pokemon;
        const species = response[1];

        // Get this down to a Promise.all(), always use id even if name is requested
        let artworkID, artworkName; // mon, species;
        if (validAlolan || validMega || validGalarian || validForm)
        {
            artworkID = mon.id;
            artworkName = mon.name;
        }
        else
        {
            artworkID = species.id;
            artworkName = species.name;
        }

        textEntry = `Could not find an english text entry for ${species.name}`;

        // Find English Pokedex Entry
        textEntry = species.flavor_text_entries.find( entry => { return entry.language.name === 'en'; })?.flavor_text ?? textEntry;

        // Remove New Lines, Form Feeds and Carriage Returns from Pokedex Entry
        textEntry = textEntry.replace(/[\n\f\r]/g, " ");

        // Add Pokemon Types to Type String
        let types = "";

        mon.types.forEach(type => { types += `${capitalize(type.type.name)}\n`;});

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

        const height = mon.height/10;
        const weight = mon.weight/10;
        let inches = (height * 39.3700787);
        let feet = Math.floor(inches / 12);
        inches = Math.round(inches % 12);
        if (inches === 12) { feet += 1; inches = 0;}
        // Embed Fields
        const embedFields = [
            {
                name: "Base Stats",
                value: `${stats}`,
                // inline: true,
            },
            {
                name: "Appearance",
                value:
                    `Height: ${feet}'${inches.toLocaleString(undefined, {minimumIntegerDigits: 2})}" (${height} m)
                    Weight: ${(weight*2.205).toFixed(1)} lbs. (${weight.toFixed(1)} kg)`,
                // inline: true,
            },
            {
                name: "Types",
                value: types,
                // inline: true,
            },
        ];

        let thumbnailURL = `https://www.smogon.com/dex/media/sprites/xy/${artworkName}.gif`;
        let imageURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${artworkID}.png`;
        const formattedName = validForm ? formRequest : species.name.split('-');
        formattedName.forEach(n => { formattedName[formattedName.indexOf(n)] = capitalize(n); });

        if (validGalarian) { formattedName.unshift(`Galarian`);}
        if (validAlolan) { formattedName.unshift(`Alolan`);}
        if (validMega) { formattedName.unshift(`Mega`); item.hasXY ? formattedName.push(`${capitalize(xy)}`) : '';}
        if (shiny)
        {
            formattedName.unshift(`✨`);
            imageURL = `https://assets.poketwo.net/shiny/${artworkID}.png`;
            thumbnailURL = `https://play.pokemonshowdown.com/sprites/ani-shiny/${artworkName}.gif`;
        }

        const embed = new Discord.MessageEmbed()
            .setColor(species.color.name.toUpperCase())
            .setTitle(`#${species.id} - ${formattedName.join(' ')}`)
            .setURL(`https://pokemondb.net/pokedex/${species.name}`)
            .setDescription(`${textEntry}`)
            .setThumbnail(thumbnailURL)
            .addFields(embedFields)
            .setImage(imageURL)
            .setTimestamp()
            ;
        message.channel.send(embed);
        console.log(`Request for ${species.name} with id ${species.id} and color: ${species.color.name}`);

    }
}
