// Implement Cooldowns
import {IBot, IBotCommand, Discord, IBotConfig} from "./api";

import * as path from 'path';

export default class Bot implements IBot
{
    public get commands(): IBotCommand[] { return this._commands; }

    public get client(): Discord.Client { return this._client; }

    public get config(): IBotConfig { return this._config; }

    private _commands: IBotCommand[] = [];

    private _client: Discord.Client = new Discord.Client;

    private _config!: IBotConfig;

    /**
     * Loads the bot's commands, starts the bot and listens for instructions.
     * @param config The configuration information for the bot from bot.json and bot.prod.json.
     * @param commandPath The path to the command folder.
     */
    public launch(config: IBotConfig, commandPath: string, dataPath: string): void
    {
        if (config.token === undefined)
        {
            throw new Error("Critical error 😱! Token was not found! Check that bot.prod.json exists!");
        }
        this._config = config;

        this.loadCommands(commandPath, dataPath);

        // On Bot Startup
        this._client.once('ready', () => {
            console.info(`${this._client.user?.username} is online!`);
            console.info(`Bot started...`);
        });

        // Message Listener
        this._client.on('message', async(message) => {
            if (!message.content.toLowerCase().startsWith(this._config.prefix) || message.author.bot) { return; }

            const args = message.content.slice(config.prefix.length).trim().split(/ +/);
            const commandName = args.shift()?.toLowerCase();

            if (commandName === undefined)
            {
                return;
            }

            // Find the command the user entered
            for (const cmd of this._commands)
            {
                if (cmd.name === commandName || cmd.aliases.includes(commandName))
                {

                    // Check if the Message Environment and Arguments are valid
                    if (cmd.isValid(message, args))
                    {
                        console.time(`${cmd.name} executed in`);
                        cmd.execute(message, args).then(() => {
                            console.timeEnd(`${cmd.name} executed in`);
                        }).catch( err => {
                            console.error(`Error occurred while executing ${cmd.name}!`);
                            console.error(err);
                            console.timeEnd(`${cmd.name} executed in`);
                        });
                    }
                    // If the command environment was not valid, send the help value for that command
                    else
                    {
                        this._commands.find(cmd => {return cmd.name === 'help';})?.execute(message, [cmd.name]);
                    }

                    break;
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
    public loadCommands(commandPath: string, dataPath: string): void
    {
        // Check if the commands list is present
        if (!this._config.commands || this._config.commands.length === 0)
        {
            throw new Error("Command list not found.");
        }

        // Check if a command list is already loaded
        if (this._commands.length > 0)
        {
            console.info("A command list was already loaded! Cleared...");
            this._commands.length = 0;
        }

        // Import the commands, execute the class constructors and push them onto the bot command list
        for (const commandName of this._config.commands)
        {
            import(`${commandPath}/${commandName}`).then(cmdClass => {
                const cmd = new cmdClass.default() as IBotCommand;

                if (cmd.init(this as IBot, path.resolve(`${dataPath}/${commandName}`)))
                {
                    this._commands.push(cmd);
                    console.info(`Command: ${commandName} loaded...`);
                }
                else
                {
                    console.error(`Command: ${commandName} failed to initialize! skipped...`);
                }
            }).catch(err => { console.log(`An error occurred while trying to load commands!`); throw err;});
        }
    }

}