const db = require('../db/client');
const crypto = require('crypto');

async function startCommand(ctx) {
  const { id, username, first_name } = ctx.from;

  // Check for referral code in /start parameter
  let referredBy = null;
  const startParam = ctx.startPayload || ctx.message?.text?.split(' ')[1];
  if (startParam) {
    const refRes = await db.query('SELECT id FROM users WHERE referral_code=$1', [startParam]);
    if (refRes.rows[0]) referredBy = refRes.rows[0].id;
  }

  // Generate unique referral code (6 chars)
  const referralCode = crypto.randomBytes(3).toString('hex');

  await db.query(
    `INSERT INTO users(tg_id, username, first_name, referral_code, referred_by)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (tg_id)
     DO UPDATE SET username=$2, first_name=$3`,
    [id, username, first_name, referralCode, referredBy]
  );

  // Bonus to the referrer
  if (referredBy) {
    await db.query('UPDATE users SET balance = balance + 5 WHERE id=$1', [referredBy]);
    ctx.reply('🎁 Someone used your referral! +5 coins were added to the inviter.');
  }

  ctx.reply(`Welcome, ${first_name}! 🎉\nUse /tap to earn coins.\nYour referral code: ${referralCode}`);
}

module.exports = startCommand;
