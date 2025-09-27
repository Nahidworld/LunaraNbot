const db = require('../db/client');

async function topCommand(ctx) {
  const res = await db.query(
    'SELECT username, balance FROM users ORDER BY balance DESC LIMIT 10'
  );

  if (!res.rows.length) return ctx.reply('No users yet.');

  let message = '🏆 Top 10 Users:\n\n';
  res.rows.forEach((user, index) => {
    message += `${index + 1}. ${user.username || 'Anonymous'} - ${user.balance} coins\n`;
  });

  ctx.reply(message);
}

module.exports = topCommand;
