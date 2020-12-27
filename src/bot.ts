import {IBot, IBotCommand, Discord, IBotConfig} from "./api";

export default class Bot implements IBot
{
    public get commands(): IBotCommand[] { return this._commands;}

    public get client(): Discord.Client { return this._client;}

    public get config(): IBotConfig { return this._config;}

    private readonly _commands: IBotCommand[] = [];

    private _client: Discord.Client = new Discord.Client;

    private _config: IBotConfig = {token: '', commands: [], prefix: ''};

    /**
     * Loads the bot's commands, starts the bot and listens for instructions.
     * @param config The configuration information for the bot from bot.json and bot.prod.json.
     * @param commandPath The path to the command folder.
     */
    public launch(config: IBotConfig, commandPath: string): void
    {
        this._config = config;

        this.loadCommands(commandPath);

        // On Bot Startup
        this._client.once('ready', () => {
            console.info(`${this._client.user?.username} is online!`);
            console.info(`Bot started...`);
        });

        // Message Listener
        this._client.on('message', async(message) => {
            if (!message.content.startsWith(this._config.prefix) || message.author.bot) { return; }

            const args = message.content.slice(config.prefix.length).trim().split(/ +/);
            const command = args.shift()?.toLowerCase();

            for (const cmd of this._commands)
            {
                if (cmd.name === command)
                {
                    try
                    {
                        cmd.execute(message);
                    }
                    catch(error)
                    {
                        console.error(error);
                        message.reply("An error occurred while trying to execute that command.");
                    }
                }
            }
        });

        // Bot Login
        this._client.login(this._config.token);
    }

    /**
     * Imports the command files from the commands folder, creates objects for those commands and pushes them
     * into the Bot command array.
     *
     * @param commandPath The path to the folder holding the command classes.
     */
    private loadCommands(commandPath: string)
    {
        if (!this._config.commands || this._config.commands.length === 0)
        {
            throw new Error("Command list not found.");
        }

        for (const commandName of this._config.commands)
        {
            import(`${commandPath}/${commandName}`).then(cmdClass => {
                const cmd = new cmdClass.default() as IBotCommand;
                this._commands.push(cmd);
                console.info(`Command: ${commandName} loaded...`);
            });
        }
    }

}