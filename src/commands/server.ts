import {IBotCommand, Discord, IBot} from "../api";

export default class ServerCommand implements IBotCommand
{
    public get usage(): string { return this._usage; }

    public readonly name = "server";

    public readonly descriptions = [
        "Displays Server Information",
    ];

    public readonly requires_args = false;

    public readonly guildOnly = true;

    private _usage = "";

    public aliases: string[] = [];

    public init(bot: IBot): boolean
    {
        this._usage = `${bot.config.prefix + this.name}`;
        return true;
    }

    public async execute(message: Discord.Message): Promise<void>
    {
        message.channel.send(`Guild Name: ${message.guild?.name}
        \nTotal Members: ${message.guild?.memberCount}`);
    }
}