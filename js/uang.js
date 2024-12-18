import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";

// Mengambil data laporan keuangan dengan endpoint yang sesuai
getJSON(
  "https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/orders",  // Endpoint untuk mendapatkan data orders
  "login",  // Header yang digunakan untuk token login
  getCookie("session"),  // Mengambil session token dari cookie
  getLaporanKeuangan // Fungsi callback untuk menampilkan data laporan keuangan
);

function getLaporanKeuangan(response) {
    // Cek status dari response
    if (response.status !== 200) {
      console.error("Gagal mengambil data: ", response);
      return;
    }
  
    // Pastikan response.data adalah array
    if (!Array.isArray(response.data)) {
      console.error("Data orders bukan array:", response);
      return;
    }
  
    const laporanKeuanganTbody = document.querySelector(".content");
    if (!laporanKeuanganTbody) {
      console.error("Elemen dengan class 'content' tidak ditemukan di DOM.");
      return;
    }
  
    laporanKeuanganTbody.innerHTML = "";  // Bersihkan tabel sebelum menambahkan data baru
  
    // Looping untuk setiap order
    response.data.forEach(order => {
      const tanggalPesanan = new Date(order.orderDate).toLocaleDateString();
      const metodePembayaran = order.paymentMethod || "-";
      const total = order.total || 0;
      
      const jumlah = order.orders.reduce((sum, item) => sum + (item.quantity || 0), 0);
  
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${tanggalPesanan}</td>
        <td>${order.userInfo.name || "-"}</td>
        <td>${metodePembayaran}</td>
        <td>${total.toFixed(2)}</td>
        <td>${jumlah}</td>
      `;
  
      laporanKeuanganTbody.appendChild(tr);
    });
  }
  


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
