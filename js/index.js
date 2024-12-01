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
        // Jika respons berhasil, tampilkan data pengguna
        const userData = result.data;

        // Tampilkan data pengguna pada elemen HTML
        const userPhoto = document.getElementById("user-photo");
        const userName = document.getElementById("user-name");

        userPhoto.src = userData.profpic;
        userPhoto.alt = `Foto Profil ${userData.name}`;
        userName.textContent = userData.name;

        console.log("Data pengguna berhasil dimuat:", userData);
    } else {
        // Jika gagal, tampilkan pesan kesalahan
        console.error("Gagal memuat data pengguna:", result.message || "Unknown error");
        alert("Gagal memuat informasi pengguna. Silakan coba lagi.");
    }
}
