import {IBotCommand, Discord} from "../api";

export default class UserCommand implements IBotCommand
{
    public readonly name = "user";
    public readonly description = "Displays User Information";

    public aliases: string[] = [];

    public help():string
    {
        return "";
    }

    public async execute(message: Discord.Message): Promise<void>
    {
        message.reply(`Your Username: ${message.author.username}\nYour ID: ${message.author.id}\nYour Racist Level: Over 9000!`);
    }
}

