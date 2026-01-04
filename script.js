// --- Update Fungsi downloadVideo ini menggantikan yang lama ---

async function downloadVideo() {
    const urlInput = document.getElementById('tiktokUrl').value;
    const btn = document.getElementById('btnSubmit');
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('errorMsg');
    const iosHintBox = document.getElementById('ios-hint-box');

    // Reset UI
    errorDiv.style.display = "none";
    resultDiv.style.display = "none";
    iosHintBox.style.display = "none";

    // 1. Validasi Input Kosong
    if (!urlInput) {
        showError("Harap masukkan link video TikTok yang valid.");
        return;
    }

    // 2. FITUR BARU: Validasi URL TikTok (Regex)
    // Mengecek apakah link mengandung kata tiktok.com
    const tiktokRegex = /tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com/i;
    if (!tiktokRegex.test(urlInput)) {
        showError("Link tidak valid! Pastikan link berasal dari TikTok.");
        return;
    }

    // Simpan teks asli tombol
    const originalBtnHTML = btn.innerHTML;

    // 3. FITUR BARU: Ubah tombol jadi Loading Spinner
    btn.innerHTML = '<span class="spinner"></span> Memproses...';
    btn.disabled = true;

    try {
        // Menggunakan API Publik TikWM
        const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(urlInput)}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.code === 0) {
            // Isi Data ke HTML
            document.getElementById('thumb').src = data.data.cover;
            document.getElementById('author').innerText = '@' + data.data.author.unique_id;
            
            // Potong deskripsi jika terlalu panjang
            let desc = data.data.title;
            if (desc.length > 50) desc = desc.substring(0, 50) + "...";
            document.getElementById('desc').innerText = desc;
            
            document.getElementById('downloadLink').href = data.data.play; 
            document.getElementById('musicLink').href = data.data.music;

            // Tampilkan Hasil
            resultDiv.style.display = "block";

            // Cek apakah user pakai iPhone/iPad
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            if (isIOS) {
                iosHintBox.style.display = "block";
            }

        } else {
            showError("Video tidak ditemukan. Pastikan akun tidak di-private atau link salah.");
        }

    } catch (err) {
        console.error(err);
        showError("Gagal menghubungi server. Cek koneksi internet kamu.");
    } finally {
        // Kembalikan tombol seperti semula (hapus spinner)
        btn.innerHTML = "Download Video"; // Reset teks tombol
        btn.disabled = false;
    }
}

// ... (Biarkan fungsi showError, updateActionBtn, handleInputBtn tetap ada seperti sebelumnya) ...


// --- 4. FITUR BARU: Support Tombol Enter ---
// Tambahkan kode ini di bagian paling bawah script.js

document.getElementById('tiktokUrl').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        // Mencegah prilaku default form jika ada, lalu jalankan fungsi download
        e.preventDefault(); 
        downloadVideo();
    }
});
