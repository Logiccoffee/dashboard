// Mengimpor modul eksternal
import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import { setInner } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import { redirect } from "https://cdn.jsdelivr.net/gh/jscroot/url@0.0.9/croot.js";

// Fungsi untuk membaca cookie login
const loginToken = getCookie("login");

// Cek apakah cookie login ada, jika tidak arahkan ke halaman utama
if (!loginToken || loginToken.trim() === "") {
    redirect("/");
}

// Ambil data pengguna menggunakan API
getJSON(
    "https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/user", 
    "login", 
    loginToken, 
    responseFunction
);

// Fungsi untuk menangani respons API
function responseFunction(result) {
    console.log("API Response:", result);

    if (result.status === 404) {
        // Jika pengguna tidak ditemukan, arahkan ke halaman pendaftaran
        setInner("content", "Silahkan lakukan pendaftaran terlebih dahulu " + (result.data?.name || ""));
        redirect("/register");
    } else {
        // Tampilkan pesan selamat datang
        setInner("content", "Selamat datang " + (result.data?.name || "Pengguna"));

        // Menampilkan nama pengguna di elemen yang telah disediakan
        const userNameElement = document.getElementById("user-name");
        if (userNameElement) {
            userNameElement.textContent = result.data.name || "Pengguna"; // Ganti dengan nama pengguna
        }

        // Arahkan pengguna berdasarkan role
        switch (result.data?.role) {
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
                // Jika role tidak dikenali, tetap di halaman utama atau tampilkan pesan error
                redirect("/");
                break;
        }
    }
}
