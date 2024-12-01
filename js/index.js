// Fungsi untuk mengambil nilai cookie berdasarkan nama
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return "";
}

// Fungsi untuk memuat data pengguna
function displayUserData() {
    const loginToken = getCookie("login");

    if (!loginToken) {
        // Jika cookie login tidak ditemukan, arahkan ke halaman login
        alert("Anda belum login. Silakan login terlebih dahulu.");
        window.location.href = "/login";
    } else {
        // Lakukan permintaan ke API untuk mendapatkan data pengguna
        fetch("https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/user", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${loginToken}`,
            },
        })
            .then(response => response.json())
            .then(result => {
                if (result.status === 200 && result.data) {
                    // Jika berhasil, tampilkan nama pengguna
                    document.getElementById("user-name").textContent = result.data.name;
                } else {
                    // Jika gagal, tampilkan pesan error
                    alert("Gagal memuat informasi pengguna. Silakan coba lagi.");
                    console.error("Error:", result.message);
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Terjadi kesalahan. Silakan coba lagi.");
            });
    }
}

// Jalankan fungsi setelah DOM selesai dimuat
document.addEventListener("DOMContentLoaded", displayUserData);
