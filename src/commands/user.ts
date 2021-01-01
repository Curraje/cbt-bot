import {IBotCommand, Discord, CategoryTypes, IBotCommandInfo} from "../api";

export default class UserCommand implements IBotCommand
{
    public get info(): IBotCommandInfo { return this._info; }

    public readonly name = "user";

    public readonly descriptions = [
        "Displays User Information",
    ];

    public aliases: string[] = [];

    public readonly arguments = null;

    private _info!: IBotCommandInfo;

    public init(): boolean
    {
        this._info = {
            name: this.name,
            aliases: this.aliases,
            descriptions: this.descriptions,
            category: CategoryTypes.Util,
            cooldown: 3,
            args: this.arguments,
            permissions: null,
            examples: [""],
        };
        return true;
    }

    public isValid(): boolean
    {
        return true;
    }

    public async execute(message: Discord.Message): Promise<void>
    {
        message.reply(`Your Username: ${message.author.username}\nYour ID: ${message.author.id}\nYour Racist Level: Over 9000!`);
    }
}

