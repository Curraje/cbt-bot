// Development file, everything in here is nasty
// For this command to work, the npm run watch command must be running

import {IBotCommand, Discord, IBot} from "../api";

export default class ReloadCommand implements IBotCommand
{
    public get cooldown(): number { return this._cooldown; }

    public get usage(): string { return this._usage; }

    public readonly name = "reload";

    public readonly descriptions = [
        "Reloads the bot and bot commands",
    ];

    public readonly requires_args = false;

    public readonly guildOnly = true;

    private _usage = "";

    public aliases: string[] = ["refresh", "restart", "re"];

    private _cooldown = 10;

    private _bot!: IBot;

    public init(bot: IBot): boolean
    {
        this._usage = `${bot.config.prefix + this.name}`;
        this._bot = bot as IBot;
        return true;
    }

    public async execute(message: Discord.Message): Promise<void>
    {
        if (this._bot === undefined)
        {
            message.channel.send("The command list could not be reloaded!");
            console.error("The command list could not be reloaded.");
            return;
        }

        for await (const cmd of this._bot.config.commands)
        {
            try
            {
                delete require.cache[require.resolve(`./${cmd}`)];
            }
            catch(err)
            {
                console.error(`😲 Error occurred!`, err);
                message.channel.send(`😱 Error occurred while trying to remove '${cmd}' from require cache.`);
            }

        }

        message.channel.send(`Check the console for command loading details!`);

        this._bot.loadCommands(__dirname);

        return;
    }
}