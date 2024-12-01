// Mengimpor modul eksternal
import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import { setInner } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import { redirect } from "https://cdn.jsdelivr.net/gh/jscroot/url@0.0.9/croot.js";

// URL API
const apiUrl = "https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/user";

// Cek apakah cookie login ada, jika tidak arahkan ke halaman utama
if (!getCookie("login")) {
    redirect("/");
}

// Fungsi untuk mengambil data pengguna
async function fetchUserData() {
    try {
        console.log("Mengambil data dari API:", apiUrl);

        // Permintaan data ke API
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getCookie("login")}`, // Token dari cookie
            },
        });

        // Validasi respons
        if (!response.ok) {
            console.error(`Gagal mengambil data: ${response.status} ${response.statusText}`);
            if (response.status === 404) {
                setInner("content", "Silahkan lakukan pendaftaran terlebih dahulu.");
                redirect("/register");
            } else {
                throw new Error("Gagal mengambil data pengguna");
            }
        }

        // Parsing JSON
        const result = await response.json();
        console.log("Data pengguna:", result);

        // Menangani respons pengguna
        handleUserResponse(result);
    } catch (error) {
        console.error("Error saat mengambil data pengguna:", error.message);
        setInner("content", "Terjadi kesalahan saat memuat data. Silakan coba lagi.");
    }
}

// Fungsi untuk menangani respons API
function handleUserResponse(result) {
    if (result.status === 404) {
        // Jika pengguna tidak ditemukan, arahkan ke halaman pendaftaran
        setInner("content", "Silahkan lakukan pendaftaran terlebih dahulu.");
        redirect("/register");
    } else {
        // Tampilkan pesan selamat datang
        setInner("content", "Selamat datang " + result.data.name);

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
                console.error("Role tidak dikenali:", result.data.role);
                redirect("/");
                break;
        }
    }
}

// Memanggil fungsi untuk mengambil data pengguna
fetchUserData();
