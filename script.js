// --- 1. Fungsi Utama: Download Video ---
async function downloadVideo() {
    const urlInput = document.getElementById('tiktokUrl').value;
    const btn = document.getElementById('btnSubmit');
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('errorMsg');
    const iosHintBox = document.getElementById('ios-hint-box');

    // Reset UI (Sembunyikan error & hasil lama)
    errorDiv.style.display = "none";
    resultDiv.style.display = "none";
    iosHintBox.style.display = "none";

    // Validasi Input Kosong
    if (!urlInput) {
        showError("Harap masukkan link video TikTok yang valid.");
        return;
    }

    // Validasi URL TikTok (Regex)
    const tiktokRegex = /tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com/i;
    if (!tiktokRegex.test(urlInput)) {
        showError("Link tidak valid! Pastikan link berasal dari TikTok.");
        return;
    }

    // Ubah tombol jadi Loading Spinner
    const originalBtnText = btn.innerHTML;
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
            
            // Set Link Download
            document.getElementById('downloadLink').href = data.data.play; 
            document.getElementById('musicLink').href = data.data.music;

            // Tampilkan Hasil
            resultDiv.style.display = "block";

            // Cek apakah user pakai iPhone/iPad untuk menampilkan hint
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
        // Kembalikan tombol seperti semula
        btn.innerHTML = "Download Video"; 
        btn.disabled = false;
    }
}

// --- 2. Fungsi Menampilkan Error ---
function showError(message) {
    const errorDiv = document.getElementById('errorMsg');
    errorDiv.innerText = message;
    errorDiv.style.display = "block";
}

// --- 3. Fungsi Tombol Kecil (Tempel / Hapus) ---
async function handleInputBtn() {
    const input = document.getElementById('tiktokUrl');
    
    // Jika input ada isinya -> Jadi tombol Hapus
    if (input.value.trim() !== "") {
        input.value = "";
        updateActionBtn(); // Update ikon/teks tombol
        input.focus();
    } 
    // Jika input kosong -> Jadi tombol Tempel (Paste)
    else {
        try {
            const text = await navigator.clipboard.readText();
            input.value = text;
            updateActionBtn();
        } catch (err) {
            showError("Gagal menempelkan (Paste). Izin clipboard mungkin ditolak.");
        }
    }
}

// --- 4. Fungsi Mengubah Tampilan Tombol (Paste <-> Clear) ---
function updateActionBtn() {
    const input = document.getElementById('tiktokUrl');
    const btn = document.getElementById('actionBtn');

    if (input.value.trim() !== "") {
        // Mode Hapus
        btn.innerText = "Hapus";
        btn.classList.remove('btn-paste');
        btn.classList.add('btn-clear');
    } else {
        // Mode Tempel
        btn.innerText = "Tempel";
        btn.classList.remove('btn-clear');
        btn.classList.add('btn-paste');
    }
}

// --- Event Listeners ---

// Cek perubahan input saat mengetik agar tombol berubah (Tempel <-> Hapus)
document.getElementById('tiktokUrl').addEventListener('input', updateActionBtn);

// Support tombol Enter untuk download
document.getElementById('tiktokUrl').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault(); 
        downloadVideo();
    }
});

// ... (Kode script.js yang sebelumnya di atas ini) ...

// --- 5. FITUR BARU: Efek Bintang Berjatuhan (Rain Stars) ---
function createStars() {
    const container = document.getElementById('star-container');
    const starCount = 30; // Jumlah bintang (jangan terlalu banyak biar tidak lag di HP)

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');

        // Posisi horizontal acak (0% - 100%)
        star.style.left = Math.random() * 100 + '%';

        // Ukuran acak (kecil-kecil cabe rawit)
        const size = Math.random() * 2 + 1; // 1px sampai 3px
        star.style.width = size + 'px';
        star.style.height = size + 'px';

        // Durasi jatuh acak (antara 3s sampai 8s) agar tidak jatuh barengan
        const duration = Math.random() * 5 + 3; 
        star.style.animationDuration = duration + 's';

        // Delay acak agar munculnya gantian
        star.style.animationDelay = Math.random() * 5 + 's';

        container.appendChild(star);
    }
}

// Jalankan fungsi saat website dimuat
document.addEventListener('DOMContentLoaded', createStars);
