import {IBotCommand, Discord} from "../api";

export default class HelpCommand implements IBotCommand
{
    public readonly name = "help";

    public readonly description = "The Help Command";

    public readonly aliases: string[] = [];

    public help(): string
    {
        return "help command";
    }

    public async execute(message: Discord.Message): Promise<void>
    {
        message.reply("No one can help you");
    }
}