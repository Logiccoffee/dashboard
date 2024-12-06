// Mengimpor modul eksternal
import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import { setInner } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import { redirect } from "https://cdn.jsdelivr.net/gh/jscroot/url@0.0.9/croot.js";

// Fungsi untuk mengecek status login
function checkLoginStatus() {
    const loginToken = getCookie("login");

    if (!loginToken) {
        // Jika token tidak ada, arahkan ke halaman login
        console.log("Token tidak ditemukan. Redirecting to login...");
        redirect("/login");
        return;
    }

    // Verifikasi token dengan API
    getJSON("https://api.logiccoffee.id/verify-token", "token", loginToken, (result) => {
        if (!result.valid) {
            console.log("Token tidak valid. Redirecting to login...");
            deleteAllCookies();
            redirect("/login");
        } else {
            console.log("Pengguna masih login. Data valid.");
            loadUserData(result.data);
        }
    });
}

// Fungsi untuk memuat data pengguna ke UI
function loadUserData(data) {
    const userNameElement = document.getElementById("user-name");
    const userRoleElement = document.getElementById("user-role");

    if (userNameElement && userRoleElement) {
        userNameElement.textContent = data.name || "Nama Pengguna";
        userRoleElement.textContent = data.role || "Peran Pengguna";
    }

    console.log("Data pengguna berhasil dimuat:", data);
}

// Fungsi untuk menghapus cookie tertentu
function deleteCookie(cookieName) {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
    console.log(`Cookie '${cookieName}' telah dihapus.`);
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

// Fungsi untuk menghapus data pengguna dari UI
function clearUserData() {
    const userNameElement = document.getElementById("user-name");
    const userRoleElement = document.getElementById("user-role");

    if (userNameElement) userNameElement.textContent = "Nama Pengguna";
    if (userRoleElement) userRoleElement.textContent = "Peran Pengguna";

    console.log("User data cleared from UI");
}

// Fungsi logout
function logout(event) {
    event.preventDefault();

    // Hapus semua cookie
    deleteAllCookies();

    // Hapus token dan data dari localStorage
    localStorage.removeItem("login");
    localStorage.removeItem("userData");

    console.log("Token dan data pengguna dihapus dari localStorage");

    // Hapus data dari UI
    clearUserData();

    // Redirect ke halaman utama
    setTimeout(() => {
        window.location.href = "https://logiccoffee.id.biz.id/";
        console.log("Redirected to homepage");
    }, 200);
}

// Tambahkan event listener untuk tombol logout setelah DOM siap
document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", logout);
        console.log("Logout Button event listener attached.");
    } else {
        console.error("Logout button tidak ditemukan.");
    }

    // Panggil fungsi cek login saat halaman dimuat
    checkLoginStatus();
});
