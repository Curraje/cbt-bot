import {IBotCommand, Discord, IBotCommandInfo, CategoryTypes} from "../api";

export default class ServerCommand implements IBotCommand
{
    public get info(): IBotCommandInfo { return this._info; }

    public readonly name = "server";

    public readonly descriptions = [
        "Displays Server Information",
        "Can only be used in a server channel",
    ];

    public readonly arguments = null;

    public aliases: string[] = [];

    private _info!: IBotCommandInfo;

    public init(): boolean
    {

        this._info = {
            name: this.name,
            aliases: this.aliases,
            descriptions: this.descriptions,
            category: CategoryTypes.Util,
            cooldown: 0,
            args: this.arguments,
            permissions: null,
            examples: [""],
        };

        return true;
    }

    public isValid(message: Discord.Message): boolean
    {
        return !(message.channel.type === 'dm');
    }

    public async execute(message: Discord.Message): Promise<void>
    {
        message.channel.send(`Guild Name: ${message.guild?.name}
        \nTotal Members: ${message.guild?.memberCount}`);
    }
}