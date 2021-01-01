// Group Anagrams by the letter they start with
// Comma-separated list instead of new lines to save space
import {IBotCommand, Discord, IBotCommandInfo, CategoryTypes, Argument} from '../api';

import {isAnagram, findAnagrams, permutation, repeatCharCount, factorial, capitalize} from '../helper';

export default class AnagramCommand implements IBotCommand
{
    public get info(): IBotCommandInfo { return this._info; }

    public readonly name = "anagram";

    public readonly descriptions: string[] = [
        "With one argument, returns the anagrams for that word, up to 120 anagrams (5 unique characters).",
        "If there are too many anagrams, will display amount instead.",
        "With two arguments, determines whether they are anagrams.",
    ];

    aliases: string[] = [
        "ana",
        "similar",
        "rearrange",
        "contains",
        "has",
    ];

    public readonly arguments: Argument[] = [
        {
            name: "word to compare/find anagrams",
            required: true,
            allowedValues: null,
        },
        {
            name: "word to compare",
            required: false,
            allowedValues: null,
        },
    ];

    private _info!: IBotCommandInfo;

    init(): boolean
    {

        this._info = {
            name: this.name,
            aliases: this.aliases,
            descriptions: this.descriptions,
            category: CategoryTypes.Other,
            cooldown: 3,
            args: this.arguments,
            permissions: null,
            examples: ["ana naa", "ana", "12345", "1010"],
        };

        return true;
    }

    public isValid(message: Discord.Message, args: string[]): boolean
    {
        return !!args.length;
    }

    public async execute(message: Discord.Message, args: string[]): Promise<void>
    {
        if (args[0] && !args[1])
        {
            const s1 = args[0];

            const length = s1.length - repeatCharCount(s1);

            if (length > 19)
            {
                message.reply(`${length} unique characters is way too big a number! I wouldn't give an accurate permutation anyway!`);
                return;
            }

            const permCount = permutation(length, length);

            if (permCount > factorial(6))
            {
                // TODO: Output to file or something
                message.reply(`Anagram possibility was too large! Found: ${permCount} permutations.`);
            }
            else
            {
                const combinations = findAnagrams(s1);

                if (combinations.length > 179)
                {
                    message.reply(`I can't send ${combinations.length} anagrams in one message! Sorry!`);
                    return;
                }

                for (let index = 0; index < combinations.length; index++)
                {
                    const tmp = combinations[index].toLowerCase();
                    combinations[index] = capitalize(tmp);
                }

                combinations.push(`**Original Word:** _${s1}_`);

                const embed = new Discord.MessageEmbed()
                    .setTitle(`Found ${combinations.length - 1} Anagrams for ${s1}`)
                    .setDescription(combinations)
                    ;
                message.channel.send(embed);
            }
        }

        // If Both arguments are passed
        if (args[0] && args[1])
        {
            const s1 = args[0];
            const s2 = args[1];

            if (isAnagram(s1, s2))
            {
                message.reply(`${s1} and ${s2} are anagrams.`);
            }
            else if (s1.includes(s2))
            {
                message.reply(`${s1} and ${s2} are not anagrams, but ${s1} contains ${s2}`);
            }
            else if (s2.includes(s1))
            {
                message.reply(`${s1} and ${s2} are not anagrams, but ${s2} contains ${s1}.`);
            }
            else
            {
                message.reply(`${s1} and ${s2} are neither anagrams nor does one contain the other.`);
            }
        }

        return;
    }

}