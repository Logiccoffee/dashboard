import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import { setInner } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";

// Periksa apakah cookie login tersedia
const loginToken = getCookie("login");
console.log("Login token:", loginToken);

if (!loginToken) {
    alert("Anda belum login. Silakan login terlebih dahulu.");
    window.location.href = "/login";
} else {
    getJSON(
        "https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/user",
        { login: loginToken },
        (result) => {
            console.log("Full API response:", result);

            if (result.status === 200 && result.data) {
                const userData = result.data;
                console.log("User data:", userData);

                // Tampilkan data pengguna
                setInner("user-name", userData.name);
            } else {
                console.error("Gagal memuat data pengguna:", result.message || "Unknown error");
                alert("Gagal memuat informasi pengguna. Silakan coba lagi.");
            }
        }
    );
}
