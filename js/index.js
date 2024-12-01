import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import { setInner } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";

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

        // Tampilkan nama pengguna pada elemen HTML
        const userName = document.getElementById("user-name");
        userName.textContent = userData.name;

        console.log("Nama pengguna berhasil dimuat:", userData.name);
    } else {
        // Jika gagal, tampilkan pesan kesalahan
        console.error("Gagal memuat data pengguna:", result.message || "Unknown error");
        alert("Gagal memuat informasi pengguna. Silakan coba lagi.");
    }
}
