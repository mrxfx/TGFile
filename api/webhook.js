// /api/webhook.js
import fs from 'fs';
import path from 'path';
import { botToken, adminId, logChannel, requiredChannels, siteURL } from '../../settings.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

const readJSON = (filename) => {
  try {
    return JSON.parse(fs.readFileSync(path.resolve(filename)));
  } catch {
    return [];
  }
};

const writeJSON = (filename, data) => {
  fs.writeFileSync(path.resolve(filename), JSON.stringify(data, null, 2));
};

const sendMessage = async (chat_id, text, buttons = []) => {
  const reply_markup = buttons.length
    ? { inline_keyboard: [buttons.map((btn) => ({ text: btn.text, url: btn.url }))] }
    : undefined;

  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id, text, parse_mode: "HTML", reply_markup }),
  });
};

export default async function handler(req, res) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const rawBody = Buffer.concat(chunks).toString('utf-8');
  const update = JSON.parse(rawBody);

  if (!update.message) return res.status(200).end();

  const { chat, text, from } = update.message;
  const chat_id = chat.id;
  const name = from.first_name;

  if (text === "/start") {
    const verified = readJSON("verified.json");

    if (!verified.includes(chat_id)) {
      const url = `${siteURL}/verify.html?uid=${chat_id}`;
      await sendMessage(chat_id, "🔐 Please verify first!", [
        { text: "🔓 Verify Me", url }
      ]);
      return res.status(200).end();
    }

    await sendMessage(chat_id, `👋 Welcome, ${name}!\nYou're now verified!`);
  }

  res.status(200).end("ok");
}
