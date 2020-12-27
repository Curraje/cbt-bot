import {IBotCommand, Discord} from "../api";

export default class ServerCommand implements IBotCommand
{
    public readonly name = "server";
    public readonly description = "Displays Server Information";

    public aliases: string[] = [];

    public help(): string
    {
        return "";
    }

    public async execute(message: Discord.Message): Promise<void>
    {
        message.channel.send(`Guild Name: ${message.guild?.name}
        \nTotal Members: ${message.guild?.memberCount}`);
    }
}