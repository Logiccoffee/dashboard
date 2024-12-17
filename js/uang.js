import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";

// Ambil data pesanan
getJSON("https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/orders", "login", displayKeuangan);

function displayKeuangan(orders) {
    const contentElement = document.querySelector(".content");

    // Validasi elemen .content
    if (!contentElement) {
        console.error("Elemen dengan class 'content' tidak ditemukan.");
        return;
    }

    // Bersihkan konten sebelumnya
    contentElement.innerHTML = "";

    // Membuat tabel untuk menampilkan laporan keuangan
    const table = document.createElement("table");
    table.className = "keuangan-table";

    // Membuat header tabel
    const tableHeader = document.createElement("thead");
    tableHeader.innerHTML = `
        <tr>
            <th>Tanggal Pemesanan</th>
            <th>Metode Pembayaran</th>
            <th>Total</th>
            <th>Jumlah</th>
        </tr>
    `;
    table.appendChild(tableHeader);

    // Membuat body tabel
    const tableBody = document.createElement("tbody");

    // Iterasi setiap pesanan untuk menampilkan data yang dibutuhkan
    orders.forEach((order) => {
        const formattedDate = new Date(order.orderDate).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });

        // Menghitung total jumlah pesanan
        const totalQuantity = order.orders.reduce((sum, item) => sum + item.quantity, 0);

        // Membuat baris baru untuk tabel
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${order.paymentMethod}</td>
            <td>Rp ${order.total.toLocaleString("id-ID")}</td>
            <td>${totalQuantity}</td>
        `;
        tableBody.appendChild(row);
    });

    // Menambahkan body ke dalam tabel
    table.appendChild(tableBody);

    // Tambahkan tabel ke dalam contentElement
    contentElement.appendChild(table);
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
