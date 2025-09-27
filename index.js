require('dotenv').config();
const { Telegraf } = require('telegraf');
const { Client } = require('pg');


const db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // ensures secure SSL connection
});

db.connect();


const bot = new Telegraf(process.env.BOT_TOKEN);

// Start command
bot.start((ctx) => {
  ctx.reply(`Welcome, ${ctx.from.first_name}! 🎉\nUse /tap to earn coins.`);
});

// Example tap command
bot.command('tap', (ctx) => {
  ctx.reply(`You tapped! +1 coin 💰`);
});

// Balance
bot.command('balance', (ctx) => {
  ctx.reply(`Your balance: 0 (DB not connected yet)`);
});

// Launch bot (polling for now)
bot.launch();
console.log("🤖 Bot is running...");
