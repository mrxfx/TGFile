import { setVerified } from '../settings.js';

export default async function handler(req, res) {
    const { user_id } = req.query;
    await setVerified(user_id);
    res.status(302).redirect('https://t.me/Txxx_XBot');
}