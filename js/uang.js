import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";

document.addEventListener("DOMContentLoaded", async function () {
    const tableBody = document.querySelector("#laporanKeuanganTable tbody");

    try {
        // Mengambil data menggunakan getJSON dari JSCroot
        getJSON("https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/orders", (data) => {
            // Bersihkan tabel sebelum menambahkan data baru
            tableBody.innerHTML = "";

            // Iterasi setiap order untuk ditampilkan di tabel
            data.forEach(order => {
                const totalQuantity = order.orders.reduce((sum, item) => sum + item.quantity, 0); // Hitung total quantity

                const row = `
                    <tr>
                        <td>${new Date(order.orderDate).toLocaleString("id-ID")}</td>
                        <td>${order.payment_method}</td>
                        <td>Rp ${order.total.toLocaleString("id-ID")}</td>
                        <td>${totalQuantity}</td>
                    </tr>
                `;
                tableBody.insertAdjacentHTML("beforeend", row);
            });
        });
    } catch (error) {
        console.error("Error:", error.message);
        tableBody.innerHTML = `<tr><td colspan="4">Gagal memuat data.</td></tr>`;
    }
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
