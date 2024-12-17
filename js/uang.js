import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";

document.addEventListener("DOMContentLoaded", function () {
    // Menampilkan data keuangan
    getJSON("https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/orders", displayKeuangan);

    // Fungsi dropdown untuk nama pengguna
    const profileDropdown = document.getElementById("profileDropdown");
    const dropdownMenu = profileDropdown ? profileDropdown.nextElementSibling : null;

    if (profileDropdown && dropdownMenu) {
        profileDropdown.addEventListener("click", function (event) {
            event.preventDefault();
            dropdownMenu.classList.toggle("show");
        });

        // Tutup dropdown jika klik di luar
        document.addEventListener("click", function (event) {
            if (profileDropdown && !profileDropdown.contains(event.target)) {
                dropdownMenu.classList.remove("show");
            }
        });
    }

    // Fungsi cetak laporan
    document.getElementById('cetakButton').addEventListener('click', function () {
        const laporan = document.getElementById('laporanKeuangan');
        
        if (laporan) {
            // Simpan konten asli halaman
            const originalContent = document.body.innerHTML;

            // Ganti isi halaman dengan hanya laporan keuangan
            document.body.innerHTML = laporan.outerHTML;

            // Cetak
            window.print();

            // Kembalikan konten asli halaman setelah cetak
            document.body.innerHTML = originalContent;

            // Pastikan event listener cetak tetap ada setelah pengembalian konten
            document.getElementById('cetakButton').addEventListener('click', arguments.callee);
        }
    });
});

function getJSON(url, callback) {
    fetch(url)
        .then(response => response.json())
        .then(data => callback(data))
        .catch(error => console.error('Error fetching data:', error));
}

function displayKeuangan(orders) {
    const contentElement = document.querySelector(".content");

    if (!contentElement) {
        console.error("Elemen dengan class 'content' tidak ditemukan.");
        return;
    }

    contentElement.innerHTML = "";

    const table = document.createElement("table");
    table.className = "keuangan-table";

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

    const tableBody = document.createElement("tbody");

    orders.forEach((order) => {
        const formattedDate = new Date(order.orderDate).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });

        const totalQuantity = order.orders.reduce((sum, item) => sum + item.quantity, 0);

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${order.paymentMethod}</td>
            <td>Rp ${order.total.toLocaleString("id-ID")}</td>
            <td>${totalQuantity}</td>
        `;
        tableBody.appendChild(row);
    });

    table.appendChild(tableBody);
    contentElement.appendChild(table);
}