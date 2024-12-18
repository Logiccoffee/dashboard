import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";

document.addEventListener("DOMContentLoaded", function () {
    // URL endpoint API untuk mengambil data pesanan
    const apiUrl = "https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/orders";
    
    // Mengambil token dari cookie menggunakan getCookie
    const token = getCookie("session");  // Ganti 'session' dengan nama cookie yang sesuai

    // Mengambil elemen tbody untuk menampilkan data ke dalam tabel
    const laporanKeuanganTbody = document.querySelector("#laporanKeuangan tbody");

    // Fungsi untuk mengambil dan menampilkan data
    async function getLaporanKeuangan() {
        const token = getCookie('session'); // Ambil token dari cookie
        if (!token) {
            console.error("Token tidak ditemukan di cookie!");
            return;
        }
    
        try {
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'login': token, // Pastikan token benar
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                console.error("Error fetching data:", response.status);
                return;
            }
    
            const data = await response.json();
            console.log("Data yang diterima:", data); // Menampilkan data untuk debugging
    
            // Menampilkan laporan keuangan ke dalam tabel
            laporanKeuanganTbody.innerHTML = ""; // Bersihkan tabel sebelum diisi
    
            data.forEach(order => {
                // Ambil informasi yang relevan dari order
                const tanggalPesanan = new Date(order.orderDate).toLocaleDateString(); // Ubah tanggal menjadi format yang mudah dibaca
                const metodePembayaran = order.paymentMethod;
                const total = order.total;
                const jumlah = order.orders.reduce((sum, item) => sum + item.quantity, 0); // Jumlahkan semua kuantitas item dalam pesanan
    
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
