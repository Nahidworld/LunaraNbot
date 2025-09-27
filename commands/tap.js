const db = require('../db/client');

async function tapCommand(ctx) {
  const tgId = ctx.from.id;

  // Get user
  const res = await db.query('SELECT * FROM users WHERE tg_id=$1', [tgId]);
  const user = res.rows[0];
  if (!user) return ctx.reply('User not found!');

  // Check last tap
  const lastTapRes = await db.query(
    'SELECT created_at FROM taps WHERE user_id=$1 ORDER BY created_at DESC LIMIT 1',
    [user.id]
  );

  const now = new Date();
  if (lastTapRes.rows[0]) {
    const lastTap = new Date(lastTapRes.rows[0].created_at);
    const diffSec = (now - lastTap) / 1000;
    if (diffSec < 60) return ctx.reply(`⏱ Wait ${Math.ceil(60 - diffSec)} seconds before tapping again.`);
  }

  // Add tap
  await db.query('INSERT INTO taps(user_id, created_at) VALUES ($1,$2)', [user.id, now]);
  await db.query('UPDATE users SET balance = balance + 1 WHERE id=$1', [user.id]);

  ctx.reply('You tapped! +1 coin 💰');
}

module.exports = tapCommand;
