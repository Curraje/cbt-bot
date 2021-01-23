import {IBotCommand, Discord, IBotCommandInfo, CategoryTypes, Argument} from '../api';

import {isAnagram, findAnagrams, repeatCharCount, capitalize, groupByLetter, factorial} from '../helper';

import {paginationEmbed} from '../paginationEmbed';

import uniq from 'lodash/uniq';

export default class AnagramCommand implements IBotCommand
{
    public get info(): IBotCommandInfo { return this._info; }

    public readonly name = "anagram";

    public readonly descriptions: string[] = [
        "With one argument, returns the anagrams for that word, up to 40319 anagrams (8 unique characters).",
        "If there are too many anagrams, will display amount instead.",
        "With two arguments, determines whether they are anagrams.",
    ];

    aliases: string[] = [
        "ana",
        "anagrams",
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

    init(): boolean {

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

    public isValid(message: Discord.Message, args: string[]): boolean {
        return !!args.length;
    }

    public async execute(message: Discord.Message, args: string[]): Promise<void> {
        if (args[0] && !args[1]) {
            const s1 = args[0];

            const length = s1.length - repeatCharCount(s1);
            const uniqChars = uniq(s1.split(''));

            if (length > 19) {
                message.reply(`${length} unique characters is way too big a number! I wouldn't give an accurate permutation anyway!`);
                return;
            }
            if (uniqChars.length === 1) {
                message.reply(`\`${s1}\` contains only 1 unique character and therefore has no anagrams! It's a lonely word! 😔`);
                return;
            }

            const permCount = factorial(length);

            if (permCount > factorial(8)) {
                message.reply(`Anagram possibility was too large! Found: ${permCount} permutations.`);
                return;
            }

            const combinations = findAnagrams(s1);
            for (let index = 0; index < combinations.length; index++) {
                const tmp = combinations[index].toLowerCase();
                combinations[index] = capitalize(tmp);
            }

            const embeds: Discord.MessageEmbed[] = [];
            const anagramCount = combinations.length;
            const PAGE_LIMIT = 100;

            while(combinations.length) {
                const page = combinations.splice(0, PAGE_LIMIT);

                const embed = new Discord.MessageEmbed()
                    .setTitle(`Showing ${page.length} Anagrams out of ${anagramCount} for \`${s1}\``)
                ;

                // Group Words by Starting Letter
                uniqChars.forEach(char => {
                    const arr = groupByLetter(page, char);
                    if (arr.length) {
                        embed.addFields({name: `${arr.length} starting with \`${capitalize(char)}\``, value: arr.join(` ***|*** `)});
                    }
                });

                embeds.push(embed);
            }

            paginationEmbed(message, embeds);
        }

        // If Both arguments are passed
        if (args[0] && args[1]) {
            const s1 = args[0];
            const s2 = args[1];

            if (isAnagram(s1, s2)) {
                message.reply(`${s1} and ${s2} are anagrams.`);
            }
            else if (s1.includes(s2)) {
                message.reply(`${s1} and ${s2} are not anagrams, but ${s1} contains ${s2}`);
            }
            else if (s2.includes(s1)) {
                message.reply(`${s1} and ${s2} are not anagrams, but ${s2} contains ${s1}.`);
            }
            else {
                message.reply(`${s1} and ${s2} are neither anagrams nor does one contain the other.`);
            }
        }

        return;
    }

}