import * as api from "./api";

import cfg = require("./../bot.json");

import cfgProd = require("./../bot.prod.json");

import Bot from "./bot";

const bot = new Bot();

const config = {...cfg, ...cfgProd} as api.IBotConfig;

bot.launch(config, `${__dirname}/commands`);