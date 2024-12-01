// Mengimpor modul eksternal
import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import { setInner } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import { redirect } from "https://cdn.jsdelivr.net/gh/jscroot/url@0.0.9/croot.js";

// Cek apakah cookie login ada, jika tidak arahkan ke halaman utama
const loginCookie = getCookie("login");
if (!loginCookie) {
    redirect("/");  // Jika cookie login tidak ada, arahkan ke halaman utama
}

// Ambil data pengguna menggunakan API
getJSON("https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/user", 
        "login", loginCookie, responseFunction);

// Fungsi untuk menangani respons API
function responseFunction(result) {
    if (!result || result.status === 404) {
        // Jika pengguna tidak ditemukan, arahkan ke halaman pendaftaran
        setInner("content", "Silahkan lakukan pendaftaran terlebih dahulu.");
        redirect("/register");
    } else {
        // Tampilkan pesan selamat datang
        setInner("content", "Selamat datang, " + result.data.name);

        // Menampilkan nama pengguna di elemen yang telah disediakan
        const userNameElement = document.getElementById("user-name");
        if (userNameElement) {
            userNameElement.textContent = result.data.name; // Ganti dengan nama pengguna
        }

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
                // Jika role tidak dikenali, tetap di halaman utama atau tampilkan pesan error
                setInner("content", "Role tidak dikenali, silakan hubungi admin.");
                redirect("/");  // Mengarahkan ke halaman utama jika role tidak valid
                break;
        }
    }
    console.log(result);  // Debugging: Tampilkan hasil dari API
}
