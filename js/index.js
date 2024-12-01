// Periksa apakah cookie login tersedia
const loginToken = getCookie("login");
if (!loginToken) {
    // Jika tidak ada cookie, arahkan ke halaman login
    alert("Anda belum login. Silakan login terlebih dahulu.");
    window.location.href = "/login";
} else {
    // Ambil data pengguna melalui API
    getJSON(
        "https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/user", // Endpoint API
        { 
            login: loginToken // Header login
        },
        handleUserResponse // Fungsi callback untuk menangani respons
    );
}

// Fungsi untuk menangani respons dari API
function handleUserResponse(result) {
    if (result.status === 200 && result.data) {
        // Jika respons berhasil, tampilkan nama pengguna
        const userData = result.data;
        const userName = document.getElementById("user-name");
        userName.textContent = userData.name; // Hanya tampilkan nama pengguna

        console.log("Nama pengguna berhasil dimuat:", userData.name);
    } else {
        // Jika gagal, tampilkan pesan kesalahan
        console.error("Gagal memuat nama pengguna:", result.message || "Unknown error");
        alert("Gagal memuat informasi pengguna. Silakan coba lagi.");
    }
}
