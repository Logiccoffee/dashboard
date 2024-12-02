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

        // Menampilkan data dashboard
        setInner("content", `
            <h1 class="dashboard-tittle">Dasbor Logic Coffee</h1>
            <section class="info-boxes d-flex justify-content-between flex-wrap">
                <div class="info-box border p-3 d-flex justify-content-center align-items-center gap-3"
                    style="flex-grow: 1; min-width: 250px; max-width: 350px; height: 150px; margin: 10px;">
                    <div class="box-icon">
                        <i class="fa-solid fa-map" style="font-size: 40px;"></i>
                    </div>
                    <div class="box-content text-left">
                        <span class="big d-block" style="font-size: 50px;">${result.data.alamat}</span>
                        <p>Alamat Pengguna</p>
                    </div>
                </div>
                <div class="info-box border p-3 d-flex justify-content-center align-items-center gap-3"
                    style="flex-grow: 1; min-width: 250px; max-width: 350px; height: 150px; margin: 10px;">
                    <div class="box-icon">
                        <i class="fa-solid fa-comment" style="font-size: 40px;"></i>
                    </div>
                    <div class="box-content text-left">
                        <span class="big d-block" style="font-size: 50px;">${result.data.ulasan}</span>
                        <p>Ulasan</p>
                    </div>
                </div>
            </section>
        `);

    } catch (error) {
        console.error("Terjadi kesalahan:", error);
        setInner("content", "Terjadi kesalahan saat memuat data.");
    }
}
