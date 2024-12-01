// Mengimpor modul eksternal
import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import { setInner } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import { redirect } from "https://cdn.jsdelivr.net/gh/jscroot/url@0.0.9/croot.js";

// Periksa apakah cookie login tersedia
if (!getCookie("login")) {
    redirect("/");
}

// Fungsi utama untuk mendapatkan data pengguna
getJSON(
    "https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/user",
    "login",
    getCookie("login"),
    handleResponse
);

// Fungsi untuk menangani respons API
function handleResponse(result) {
    if (!result || typeof result !== "object") {
        console.error("Respons API tidak valid:", result);
        setInner("content", "Terjadi kesalahan saat memuat data pengguna.");
        return;
    }

    if (result.status === 404) {
        // Pengguna tidak ditemukan
        setInner("content", "Silahkan lakukan pendaftaran terlebih dahulu.");
        redirect("/register");
    } else if (result.status === 200 && result.data) {
        // Data pengguna ditemukan
        const { name, role } = result.data;

        // Tampilkan pesan selamat datang
        setInner("content", `Selamat datang ${name}`);

        // Perbarui elemen nama pengguna
        const userNameElement = document.getElementById("user-name");
        if (userNameElement) {
            userNameElement.textContent = name;
        }

        // Arahkan pengguna berdasarkan peran
        switch (role) {
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
                console.warn("Peran tidak dikenali:", role);
                redirect("/");
                break;
        }
    } else {
        console.error("Status API tidak dikenali:", result.status);
        setInner("content", "Terjadi kesalahan saat memproses data.");
    }
    console.log(result);
}
