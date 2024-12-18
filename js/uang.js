import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";

document.addEventListener("DOMContentLoaded", function () {
    // URL endpoint API
    const apiUrl = "https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/orders";
    
    // Mengambil token dari cookie menggunakan getCookie
    const token = getCookie("session");  // Ganti 'session' dengan nama cookie yang sesuai

    // Mengambil elemen tbody untuk menampilkan data ke dalam tabel
    const laporanKeuanganTbody = document.querySelector("#laporanKeuangan tbody");

    // Fungsi untuk mengambil dan menampilkan data
    async function getLaporanKeuangan() {
        if (!token) {
            console.error("Token tidak ditemukan di cookie!");
            return;
        }

        try {
            // Permintaan fetch dengan header Authorization menggunakan cookie
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,  // Menambahkan token ke header
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();  // Parse response ke format JSON

            // Bersihkan tabel sebelum menambahkan data baru
            laporanKeuanganTbody.innerHTML = "";

            // Looping melalui data dan menampilkan ke tabel
            data.forEach(order => {
                const tanggalPesanan = order.tanggal; // Sesuaikan jika format tanggal berbeda
                const metodePembayaran = order.metode_pembayaran; // Sesuaikan nama field di API
                const total = order.total; // Total pembayaran
                const jumlah = order.jumlah; // Jumlah pesanan

                // Membuat elemen baris baru
                const tr = document.createElement("tr");

                // Isi data dalam baris
                tr.innerHTML = `
                    <td>${tanggalPesanan}</td>
                    <td>${metodePembayaran}</td>
                    <td>${total}</td>
                    <td>${jumlah}</td>
                    <td><a href="invoice.html" class="btn btn-primary">Detail</a></td>
                `;

                // Masukkan baris ke dalam tabel
                laporanKeuanganTbody.appendChild(tr);
            });
        } catch (error) {
            console.error("Terjadi kesalahan saat mengambil data:", error);
        }
    }

    // Panggil fungsi untuk mengambil data saat halaman dimuat
    getLaporanKeuangan();
});


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
