// Deal with examples
import {IBotCommand, Discord, IBot, IBotCommandInfo, CategoryTypes} from "../api";
import {capitalize} from "../helper";
import forEach from 'lodash/forEach';
import map from 'lodash/map';
import filter from 'lodash/filter';
import uniq from 'lodash/uniq';

export default class HelpCommand implements IBotCommand
{
    public get info(): IBotCommandInfo { return this._info; }

    public readonly name = "help";

    public readonly descriptions = [
        "Displays command information",
    ];

    private _bot!: IBot;

    public readonly aliases: string[] = [];

    public readonly arguments = null;

    private _info!: IBotCommandInfo;

    public init(bot: IBot): boolean
    {
        this._bot = bot;
        this._info = {
            name: this.name,
            aliases: this.aliases,
            descriptions: this.descriptions,
            category: CategoryTypes.Util,
            cooldown: 0,
            args: this.arguments,
            permissions: null,
            examples: [],
        };
        return true;
    }

    public isValid(): boolean
    {
        return true;
    }

    public async execute(message: Discord.Message, args: string[]): Promise<void>
    {
        const commandList: IBotCommand[] = this._bot.commands;

        const description: string[] = [];

        const prefix = this._bot.config.prefix;

        let title = '';

        let sendDM = true;

        let fields = [{name: "Failed to Load", value: "Yikes"}];

        // If a command is specified and that command is not help
        if (args[0] && args[0].toLowerCase() !== this.name)
        {
            const cmdName = args[0].toLowerCase();

            for (const cmd of commandList)
            {
                if (cmdName === cmd.name || cmd.aliases.includes(cmdName))
                {
                    title = capitalize(cmd.name);
                    description.push(map(cmd.descriptions, string => { return `• ${string}`; }).join('\n'));
                    sendDM = false;
                    fields = this.genInfoFields(cmd.info);
                    break;
                }
            }

            if (sendDM)
            {
                return;
            }
        }

        // If no command is specified or that command is help
        if (!args[0] || args[0].toLowerCase() === this.name)
        {
            sendDM = !(args[0]?.toLowerCase() === this.name);

            title = `CBT at your service!`;

            fields = this.genListFields(filter(map(commandList, cmd => { return cmd.info;}), info => { return info.name !== this.name;}));

            description.unshift(`• A comprehensive list of all the commands.`);
            description.unshift(`• If you want this list in your channel, do \`${prefix + this.name} ${this.name}\`.`);
        }

        const embed = new Discord.MessageEmbed()
            .setTitle(`${title}`)
            .setDescription(description)
            .addFields(fields)
            .setColor('GOLD')
            .setFooter(`Prefix: ${prefix} | Cool Bot in TypeScript`)
            ;

        if (sendDM)
        {
            message.reply(`I have sent you a DM with my commands.` +
                `Check your DMs! If you would like the list here, do \`${prefix + this.name} ${this.name}\``);
            message.author.send(embed);
        }
        else
        {
            message.channel.send(embed);
        }

        return;
    }

    private genListFields(infoList: IBotCommandInfo[]): {name: string, value: string}[]
    {
        const fields = [];

        const categories = uniq(map(infoList, info => {return info.category;}));

        forEach(categories, category => {
            fields.push({
                name: `**❯ ${category}**`,
                value: map(filter(infoList, info => {return info.category === category; }), info => {return info.name; }).join(' | '),
            });
        });

        fields.push({
            name: "**❯ Help**",
            value: `• For info on a specific command, you can do \`${this._bot.config.prefix + this.name} [command name]\``,
        });
        return fields;
    }

    private genInfoFields(info: IBotCommandInfo): {name: string, value: string}[]
    {
        const fields = [];

        const invoke = `${this._bot.config.prefix + info.name}`;

        let usage = invoke;

        const hasArgs = !!info.args;

        const hasPerms = !!info.permissions;

        const hasAliases = !!info.aliases.length;

        if (hasArgs)
        {
            forEach(info.args, (argument) => {

                const arg_string = argument.required ? ` <${argument.name}>` : ` [${argument.name}]`;

                usage += arg_string;

                if (argument.allowedValues)
                {
                    fields.push({
                        name: `**❯ Allowed Values for **_${argument.name}_`,
                        value: argument.allowedValues.join(", "),
                    });
                }
            });
        }

        fields.push({
            name: "**❯ Usage**",
            value: `\`${usage}\``,
        });

        fields.push({
            name: `**❯ Examples**`,
            value: `\`${map(info.examples, eg => {return `${invoke} ${eg}`;}).join('\n').trim()}\``,
        });

        if (hasAliases)
        {
            fields.push({
                name: "**❯ Aliases**",
                value: `\`${info.aliases.join(' | ')}\``,
            });
        }

        if (hasPerms)
        {
            fields.push({
                name: "**❯ Required Permissions**",
                value: `\`${info?.permissions}\``,
            });
        }

        fields.push({
            name: "**❯ Cooldown**",
            value: `${info.cooldown.toFixed(1)}s`,
        });

        fields.push({
            name: "**❯ Legend**",
            value: `\`<> required, [] optional\``,
        });

        return fields;
    }
}