const db = require('../db/client');

async function tasksCommand(ctx) {
  const tgId = ctx.from.id;

  const userRes = await db.query('SELECT id, balance FROM users WHERE tg_id=$1', [tgId]);
  const user = userRes.rows[0];
  if (!user) return ctx.reply('User not found!');

  // Get active tasks
  const tasksRes = await db.query('SELECT * FROM tasks WHERE active=true');
  if (!tasksRes.rows.length) return ctx.reply('No active tasks at the moment.');

  let message = '📝 Active Tasks:\n\n';
  tasksRes.rows.forEach((task, index) => {
    message += `${index + 1}. ${task.name} - Reward: ${task.reward} coins\n`;
  });

  ctx.reply(message);
}

module.exports = tasksCommand;
