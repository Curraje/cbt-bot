import {IBotCommand, Discord, IBot} from "../api";

export default class HelpCommand implements IBotCommand
{
    public get usage(): string { return this._usage; }

    public readonly name = "help";

    public readonly descriptions = [
        "Displays command information",
    ];

    public readonly requires_args = false;

    public readonly guildOnly = true;

    private _usage = "";

    public readonly aliases: string[] = [];

    public init(bot: IBot): boolean
    {
        this._usage = `${bot.config.prefix + this.name}`;
        return true;
    }

    public async execute(message: Discord.Message): Promise<void>
    {
        message.reply("No one wants to help you");
    }
}