import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";

// Fungsi untuk mengambil data laporan keuangan
function getLaporanKeuangan() {
    getJSON('https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/orders', function(data) {
        // Mengecek apakah data berhasil diterima dan merupakan array
        if (Array.isArray(data)) {
            const tbody = document.querySelector('#laporanKeuangan tbody');
            tbody.innerHTML = ''; // Kosongkan tabel sebelum menambahkan data baru

            // Looping data untuk menambahkannya ke tabel
            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.orderdate}</td>
                    <td>${item.payment_method}</td>
                    <td>Rp ${item.total}</td>
                    <td>${item.quantity} Cup</td>
                `;
                tbody.appendChild(row);
            });
        } else {
            console.error('Data tidak sesuai format');
        }
    }).fail(function(xhr, status, error) {
        console.error('Terjadi kesalahan:', error);
    });
}

// Panggil fungsi untuk menampilkan data saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    getLaporanKeuangan(); // Memanggil fungsi untuk mengambil data laporan keuangan
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
