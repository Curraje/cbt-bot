// Development file, everything in here is nasty
// For this command to work, the npm run watch command must be running

import {IBotCommand, Discord, IBot, IBotCommandInfo, CategoryTypes} from "../api";

export default class ReloadCommand implements IBotCommand
{
    public get info(): IBotCommandInfo { return this._info; }

    public readonly name = "reload";

    public readonly descriptions = [
        "Reloads the bot's commands",
    ];

    public aliases: string[] = ["refresh", "restart", "re"];

    private _bot!: IBot;

    public readonly arguments = null;

    private _info!: IBotCommandInfo;

    public init(bot: IBot): boolean
    {
        this._bot = bot as IBot;

        this._info = {
            name: this.name,
            aliases: this.aliases,
            descriptions: this.descriptions,
            category: CategoryTypes.Util,
            cooldown: 3,
            args: this.arguments,
            permissions: `ADMINISTRATOR`,
            examples: [""],
        };

        return true;
    }

    public isValid(message: Discord.Message): boolean
    {
        return message.member?.hasPermission(`ADMINISTRATOR`) || false;
    }

    public async execute(message: Discord.Message): Promise<void>
    {
        if (this._bot === undefined)
        {
            message.channel.send("The command list could not be reloaded!");
            throw "The command list could not be reloaded.";
            // return;
        }

        for (const cmd of this._bot.config.commands)
        {
            try
            {
                delete require.cache[require.resolve(`./${cmd}`)];
            }
            catch(err)
            {
                message.channel.send(`😱 Error occurred while trying to remove '${cmd}' from require cache.`);
                throw err;
            }

        }

        message.channel.send(`Check the console for command loading details!`);

        this._bot.loadCommands(__dirname, `${__dirname}/../../data`);

        return;
    }
}