// Mengimpor modul eksternal
import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import { setInner } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import { redirect } from "https://cdn.jsdelivr.net/gh/jscroot/url@0.0.9/croot.js";

// URL API
const apiUrl = "https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/user";

// Cek apakah cookie login ada
const loginCookie = getCookie("login");
if (!loginCookie) {
    console.log("Cookie login tidak ditemukan. Mengarahkan ke halaman utama.");
    redirect("/");
}

// Ambil data pengguna menggunakan API
getJSON(apiUrl, "login", loginCookie, responseFunction);

// Fungsi untuk menangani respons API
function responseFunction(result) {
    try {
        if (result.status === 404) {
            console.log("Pengguna tidak ditemukan. Mengarahkan ke halaman pendaftaran.");
            setInner("content", "Silahkan lakukan pendaftaran terlebih dahulu.");
            redirect("/register");
            return; // Menghentikan eksekusi setelah redirect
        }

        // Tampilkan pesan selamat datang
        setInner("content", `Selamat datang ${result.data.name}`);

        // Menampilkan nama pengguna di elemen yang telah disediakan
        const userNameElement = document.getElementById("user-name");
        if (userNameElement) {
            userNameElement.textContent = result.data.name;
        }

        // Arahkan pengguna berdasarkan role
        switch (result.data.role) {
            case "user":
            case "dosen":
                console.log("Role:", result.data.role, "Mengarahkan ke /menu");
                redirect("/menu");
                break;
            case "admin":
                console.log("Role: admin. Mengarahkan ke /dashboard-admin");
                redirect("/dashboard-admin");
                break;
            case "cashier":
                console.log("Role: cashier. Mengarahkan ke /dashboard-cashier");
                redirect("/dashboard-cashier");
                break;
            default:
                console.warn("Role tidak dikenali. Tetap di halaman utama.");
                setInner("content", "Role tidak dikenali. Hubungi administrator.");
                break;
        }
    } catch (error) {
        console.error("Terjadi kesalahan saat memproses respons:", error.message);
        setInner("content", "Terjadi kesalahan saat memproses data.");
    }
    console.log(result);
}
