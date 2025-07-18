const https = require('https');

const BOT_TOKEN = '7532683111:AAFTf7dR377XAF2BTprIkn7GXVmOost_FN4';
const ADMIN_ID = '6367868203';
const VERIFIED_USERS = {};

function sendMessage(chatId, text) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const data = JSON.stringify({ chat_id: chatId, text: text });

    return new Promise((resolve, reject) => {
        const req = https.request(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': data.length }
        }, res => {
            res.on('data', d => process.stdout.write(d));
            res.on('end', resolve);
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

async function checkVerification(userId) {
    if (!VERIFIED_USERS[userId]) return false;
    const lastVerified = VERIFIED_USERS[userId];
    return (Date.now() - lastVerified) < 24 * 60 * 60 * 1000;
}

async function setVerified(userId) {
    VERIFIED_USERS[userId] = Date.now();
}

module.exports = { sendMessage, checkVerification, setVerified };