import {IBotCommand, Discord, IBot} from "../api";

export default class UserCommand implements IBotCommand
{
    public get usage(): string { return this._usage; }

    public readonly name = "user";

    public readonly descriptions = [
        "Displays User Information",
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
        message.reply(`Your Username: ${message.author.username}\nYour ID: ${message.author.id}\nYour Racist Level: Over 9000!`);
    }
}

