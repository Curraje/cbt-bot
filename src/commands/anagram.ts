import {IBotCommand, IBot, Discord} from '../api';

import {isAnagram, findAnagrams, permutation, repeatCharCount, factorial, capitalize} from '../helper';

export default class AnagramCommand implements IBotCommand
{
    public get usage(): string { return this._usage; }
    public readonly name = "anagram";
    public readonly descriptions: string[] = [
        "With one argument, returns the anagrams for that word, up to 120 anagrams.",
        "With two arguments, determines whether they are anagrams.",
    ];
    private _usage = "";
    public readonly requires_args = true;
    public readonly guildOnly = false;
    aliases: string[] = [
        "ana",
        "similar",
        "rearrange",
        "contains",
        "has",
    ];

    public async execute(message: Discord.Message, args: string[]): Promise<void>
    {
        if (args.length === 0)
        {
            message.reply(`The ${this.name} command requires at least one arugment!`);
            return;
        }

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

    init(bot: IBot): boolean
    {
        this._usage = `${bot.config.prefix + this.name}`;
        return true;
    }

}