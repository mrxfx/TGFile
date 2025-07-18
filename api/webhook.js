import { sendMessage, checkVerification, generateLink } from '../settings.js';

export default async function handler(req, res) {
    const body = req.body;

    if (body.message) {
        const chatId = body.message.chat.id;
        const userId = body.message.from.id;
        const text = body.message.text || '';

        if (text === '/start') {
            const verified = await checkVerification(userId);
            if (!verified) {
                await sendMessage(chatId, '❌ You are not verified! Please verify at: https://your-domain.vercel.app/verify.html');
            } else {
                await sendMessage(chatId, '✅ You are verified! Send /help or upload a file.');
            }
        }

        if (text.startsWith('/help')) {
            await sendMessage(chatId, 'ℹ️ This is a file sharing bot.

Admins can upload files. Users can access files via short links.');
        }
    }

    res.status(200).json({ ok: true });
}