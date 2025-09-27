const db = require('../db/client');

async function balanceCommand(ctx) {
  const tgId = ctx.from.id;
  const res = await db.query('SELECT balance FROM users WHERE tg_id=$1', [tgId]);
  const user = res.rows[0];
  if (!user) return ctx.reply('User not found!');
  ctx.reply(`💰 Your balance: ${user.balance} coins`);
}

module.exports = balanceCommand;
