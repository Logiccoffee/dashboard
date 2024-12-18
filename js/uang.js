import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";

const apiUrl = "URL_API_ANDA"; // Ganti dengan URL API backend Anda
const laporanKeuanganTbody = document.querySelector(".content");

async function getLaporanKeuangan() {
    console.log("Memulai proses fetch laporan keuangan...");

    const token = getCookie('session');
    console.log("Token yang ditemukan:", token);
    if (!token) {
        console.error("Token tidak ditemukan di cookie!");
        return;
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'login': token,
                'Content-Type': 'application/json',
            },
        });

        console.log("Respons API:", response);

        if (!response.ok) {
            console.error("Error fetching data:", response.status);
            return;
        }

        const data = await response.json();
        console.log("Data yang diterima:", data);

        if (!Array.isArray(data)) {
            console.error("Data bukan array:", data);
            return;
        }

        laporanKeuanganTbody.innerHTML = ""; // Bersihkan tabel

        data.forEach(order => {
            console.log("Order:", order);

            const tanggalPesanan = new Date(order.orderDate).toLocaleDateString();
            const metodePembayaran = order.paymentMethod || "-";
            const total = order.total || 0;
            const jumlah = order.orders.reduce((sum, item) => sum + (item.quantity || 0), 0);

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${tanggalPesanan}</td>
                <td>${metodePembayaran}</td>
                <td>${total}</td>
                <td>${jumlah}</td>
            `;

            laporanKeuanganTbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Kesalahan saat mengambil data:", error);
    }
}

getLaporanKeuangan();


// Fungsi untuk dropdown nama pengguna
document.addEventListener("DOMContentLoaded", function () {
    const profileDropdown = document.getElementById("profileDropdown");
    const dropdownMenu = profileDropdown.nextElementSibling;

    profileDropdown.addEventListener("click", function (event) {
        event.preventDefault();
        dropdownMenu.classList.toggle("show");
    });

    // Tutup dropdown jika klik di luar
    document.addEventListener("click", function (event) {
        if (!profileDropdown.contains(event.target)) {
            dropdownMenu.classList.remove("show");
        }
    });
});

// Event listener untuk tombol cetak
document.getElementById('cetakButton').addEventListener('click', function () {
    // Ambil elemen laporan keuangan
    const laporan = document.getElementById('laporanKeuangan');

    // Simpan konten asli halaman
    const originalContent = document.body.innerHTML;

    // Ganti isi halaman dengan hanya laporan keuangan
    document.body.innerHTML = laporan.outerHTML;

    // Cetak
    window.print();

    // Kembalikan konten asli halaman setelah cetak
    document.body.innerHTML = originalContent;
});
