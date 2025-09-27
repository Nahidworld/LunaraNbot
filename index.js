require('dotenv').config();
const { Telegraf } = require('telegraf');

const startCommand = require('./commands/start');
const tapCommand = require('./commands/tap');
const balanceCommand = require('./commands/balance');
const topCommand = require('./commands/top');
const dailyCommand = require('./commands/daily');
const tasksCommand = require('./commands/tasks');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(startCommand);
bot.command('tap', tapCommand);
bot.command('balance', balanceCommand);
bot.command('top', topCommand);
bot.command('daily', dailyCommand);
bot.command('tasks', tasksCommand);

bot.launch().then(() => console.log('Bot is running...'));

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
