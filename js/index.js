// Mengimpor modul eksternal
import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import { setInner } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import { redirect } from "https://cdn.jsdelivr.net/gh/jscroot/url@0.0.9/croot.js";

// Cek apakah cookie login ada, jika tidak arahkan ke halaman utama
if (getCookie("login") === "") {
    console.log("Cookie login tidak ditemukan. Mengarahkan ke halaman utama.");
    redirect("/");
}

// Ambil data pengguna menggunakan API
getJSON("https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/user","login", getCookie("login"), responseFunction);

// Fungsi untuk menangani respons API
function responseFunction(result) {
    try {
        if (result.status === 404) {
            console.log("Pengguna tidak ditemukan. Mengarahkan ke halaman pendaftaran.");
            setInner("content", "Silahkan lakukan pendaftaran terlebih dahulu.");
            redirect("/register");
            return; // Menghentikan eksekusi setelah redirect
        }

        // Menampilkan nama pengguna dan peran pengguna di elemen yang telah disediakan
        const userNameElement = document.getElementById("user-name");
        const userRoleElement = document.getElementById("user-role");

        if (userNameElement && userRoleElement) {
            userNameElement.textContent = result.data.name || "Nama Tidak Diketahui";
            userRoleElement.textContent = result.data.role || "Peran Tidak Diketahui";
        }

        console.log("Data pengguna:", result.data);
    } catch (error) {
        console.error("Terjadi kesalahan saat memproses respons:", error.message);
        setInner("content", "Terjadi kesalahan saat memproses data.");
    }
}

// Fungsi untuk menghapus cookie tertentu
function deleteCookie(cookieName) {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
    console.log(`Cookie '${cookieName}' has been deleted.`);
}

// Fungsi untuk menghapus semua cookie
function deleteAllCookies() {
    const cookies = document.cookie.split("; ");
    cookies.forEach(cookie => {
        const name = cookie.split("=")[0];
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
    });
    console.log("Semua cookie telah dihapus.");
}

// Fungsi untuk menghapus data user dari UI
function clearUserData() {
    const userElement = document.querySelector(".user-info");
    if (userElement) {
        userElement.innerHTML = "<p>User data cleared.</p>";
        console.log("User data cleared from the UI.");
    }
}

// Fungsi logout
function logout(event) {
    event.preventDefault();  // Pastikan preventDefault dipanggil agar form atau link tidak melakukan aksi default
    
    // Hapus semua cookies
    deleteAllCookies();
    
    // Hapus token dari localStorage
    localStorage.removeItem("login");
    console.log("Token removed from localStorage");
    
    // Hapus data dari UI
    clearUserData();
    
    // Tunggu sebentar sebelum redirect (untuk memastikan semua operasi selesai)
    setTimeout(function() {
        // Redirect ke halaman utama
        window.location.href = "https://logiccoffee.id.biz.id/";
        console.log("Redirected to homepage");
    }, 200);  // Menunggu 200ms sebelum pindah halaman
}

// Menambahkan event listener pada tombol logout setelah DOM siap
document.addEventListener("DOMContentLoaded", function () {
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", logout); // Menambahkan event listener ke tombol
        console.log("Logout Button event listener attached.");
    } else {
        console.error("Logout button not found.");
    }
});
