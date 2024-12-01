import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import { setInner } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import { redirect } from "https://cdn.jsdelivr.net/gh/jscroot/url@0.0.9/croot.js";

// Periksa apakah cookie login tersedia
if (getCookie("login") === "") {
    redirect("/"); // Jika tidak ada cookie login, arahkan ke halaman utama
}

// Ambil data pengguna menggunakan API
getJSON(
    "https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/user", // URL API
    "login", // Header parameter
    getCookie("login"), // Nilai cookie login
    responseFunction // Fungsi callback
);

// Fungsi callback untuk menangani respons dari API
function responseFunction(result) {
    if (result.status === 404) {
        // Jika data pengguna tidak ditemukan, tampilkan pesan dan arahkan ke halaman pendaftaran
        setInner("content", "Silahkan lakukan pendaftaran terlebih dahulu.");
        redirect("/register");
    } else if (result.status === 200 && result.data) {
        // Jika berhasil, tampilkan nama pengguna
        setInner("content", "Selamat datang " + result.data.name);

        // Arahkan pengguna berdasarkan role
        switch (result.data.role) {
            case "user":
            case "dosen":
                redirect("/menu");
                break;
            case "admin":
                redirect("/dashboard-admin");
                break;
            case "cashier":
                redirect("/dashboard-cashier");
                break;
            default:
                // Jika role tidak dikenali, tetap di halaman utama
                redirect("/");
                break;
        }
    } else {
        // Jika respons tidak sesuai, tampilkan pesan kesalahan
        console.error("Gagal memuat data pengguna:", result.message || "Unknown error");
        setInner("content", "Terjadi kesalahan. Silakan coba lagi.");
    }
    console.log(result);
}
