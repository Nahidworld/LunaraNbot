const db = require('../db/client');

async function dailyCommand(ctx) {
  const tgId = ctx.from.id;

  // Get user
  const userRes = await db.query('SELECT id, balance FROM users WHERE tg_id=$1', [tgId]);
  const user = userRes.rows[0];
  if (!user) return ctx.reply('User not found!');

  // Check last claim
  const claimRes = await db.query('SELECT last_claim FROM daily_claims WHERE user_id=$1', [user.id]);
  const now = new Date();

  if (claimRes.rows[0]) {
    const lastClaim = new Date(claimRes.rows[0].last_claim);
    const diffHours = (now - lastClaim) / (1000 * 60 * 60);
    if (diffHours < 24) return ctx.reply(`⏱ You already claimed today. Come back in ${Math.ceil(24 - diffHours)} hours.`);
    // Update claim time
    await db.query('UPDATE daily_claims SET last_claim=$1 WHERE user_id=$2', [now, user.id]);
  } else {
    // First claim
    await db.query('INSERT INTO daily_claims(user_id, last_claim) VALUES ($1, $2)', [user.id, now]);
  }

  // Add daily reward
  const reward = 10; // adjust reward amount
  await db.query('UPDATE users SET balance = balance + $1 WHERE id=$2', [reward, user.id]);

  ctx.reply(`🎁 You claimed your daily bonus of ${reward} coins!`);
}

module.exports = dailyCommand;
