
// api/bot.js
const { Telegraf } = require('telegraf');
const axios = require('axios');

// --- KONFIGURASI ---
const token = '7883375170:AAFjJF_BOGsZWeCSmgitx5nKkuCIlqfbjOQ'; 
const ADMIN_ID = 7518301639; // <--- JANGAN LUPA GANTI DENGAN ID TELEGRAM KAMU

const bot = new Telegraf(token);

bot.start((ctx) => {
    ctx.reply('Halo! Kirimkan link video TikTok, aku akan downloadkan tanpa watermark untukmu.\nPowered by Fhrydl Downloader.\nhttps://fhrydl-downloader.vercel.app');
});

bot.on('text', async (ctx) => {
    const urlInput = ctx.message.text;
    const tiktokRegex = /tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com/i;
    const user = ctx.from; 

    // 1. Validasi Link
    if (!tiktokRegex.test(urlInput)) {
        return ctx.reply('❌ Link tidak valid! Pastikan link berasal dari TikTok.');
    }

    ctx.reply('⏳ Sedang memproses video, mohon tunggu sebentar...');

    try {
        // 2. Request ke API
        const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(urlInput)}`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (data.code === 0) {
            const videoData = data.data;
            const caption = `✅ **Berhasil!**\n\n👤 Author: ${videoData.author.nickname} (@${videoData.author.unique_id})\n📝 Deskripsi: ${videoData.title}\n\nDiproses oleh Fhrydl Downloader`;

            // 3. Kirim Video ke User
            await ctx.replyWithVideo(
                { url: videoData.play }, 
                { caption: caption }
            );

            // --- FITUR HISTORI (LOG KE ADMIN) ---
            // Kode 'if' sudah dihapus, jadi bot akan lapor siapapun yang download
            const logMessage = `
🚨 **HISTORI DOWNLOAD BARU** 🚨

👤 **Info Pengguna:**
• Nama: ${user.first_name} ${user.last_name || ''}
• Username: @${user.username || 'Tidak ada'}
• ID: ${user.id}

📹 **Info Video:**
• Author: ${videoData.author.nickname}
• Judul: ${videoData.title}
• Link Asli: ${urlInput}

⏰ Waktu: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
`;
            
            // Kirim Laporan ke Admin
            await bot.telegram.sendMessage(ADMIN_ID, logMessage);

        } else {
            ctx.reply('❌ Video tidak ditemukan atau akun di-private.');
        }

    } catch (error) {
        console.error(error);
        ctx.reply('❌ Terjadi kesalahan pada server. Coba lagi nanti.');
        
        // Lapor Error ke Admin (Opsional)
        bot.telegram.sendMessage(ADMIN_ID, `⚠️ **ERROR LOG**\nUser: ${user.first_name}\nError: ${error.message}`);
    }
});

module.exports = async (req, res) => {
    try {
        await bot.handleUpdate(req.body);
        res.status(200).send('OK');
    } catch (e) {
        console.error("Error di Webhook:", e);
        res.status(500).send('Error');
    }
};
