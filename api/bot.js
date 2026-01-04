// api/bot.js
const { Telegraf } = require('telegraf');
const axios = require('axios');

// --- TOKEN LANGSUNG DIPASANG DI SINI ---
const token = '7883375170:AAFjJF_BOGsZWeCSmgitx5nKkuCIlqfbjOQ';
const bot = new Telegraf(token);

// Pesan Start
bot.start((ctx) => {
    ctx.reply('Halo! Kirimkan link video TikTok, aku akan downloadkan tanpa watermark untukmu.\n\nPowered by Fhrydl Downloader. n\n\https://fhrydl-downloader.vercel.app');
});

// Logic menangani pesan text
bot.on('text', async (ctx) => {
    const urlInput = ctx.message.text;
    const tiktokRegex = /tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com/i;

    // 1. Validasi Link
    if (!tiktokRegex.test(urlInput)) {
        return ctx.reply('❌ Link tidak valid! Pastikan link berasal dari TikTok.');
    }

    ctx.reply('⏳ Sedang memproses video, mohon tunggu sebentar...');

    try {
        // 2. Menggunakan API TikWM
        const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(urlInput)}`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (data.code === 0) {
            const videoData = data.data;
            const caption = `✅ **Berhasil!**\n\n👤 Author: ${videoData.author.nickname} (@${videoData.author.unique_id})\n📝 Deskripsi: ${videoData.title}\n\nDiproses oleh Fhrydl Downloader`;

            // 3. Kirim Video ke Telegram
            await ctx.replyWithVideo(
                { url: videoData.play }, 
                { caption: caption }
            );

        } else {
            ctx.reply('❌ Video tidak ditemukan atau akun di-private.');
        }

    } catch (error) {
        console.error(error);
        ctx.reply('❌ Terjadi kesalahan pada server. Coba lagi nanti.');
    }
});

// Setup Webhook untuk Vercel
module.exports = async (req, res) => {
    try {
        await bot.handleUpdate(req.body);
        res.status(200).send('OK');
    } catch (e) {
        console.error("Error di Webhook:", e);
        res.status(500).send('Error');
    }
};
