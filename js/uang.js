import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";

document.addEventListener("DOMContentLoaded", function () {
    // Menampilkan data keuangan
    getJSON("https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/orders", displayKeuangan);

    // Fungsi dropdown untuk nama pengguna
    const profileDropdown = document.getElementById("profileDropdown");
    if (profileDropdown) {
        const dropdownMenu = document.querySelector(".dropdown-menu");

        if (dropdownMenu) {
            profileDropdown.addEventListener("click", function (event) {
                event.preventDefault();
                dropdownMenu.classList.toggle("show");
            });

            document.addEventListener("click", function (event) {
                if (!profileDropdown.contains(event.target) && !dropdownMenu.contains(event.target)) {
                    dropdownMenu.classList.remove("show");
                }
            });
        }
    }
    

    // Fungsi cetak laporan
    const cetakButton = document.getElementById('cetakButton');
    if (cetakButton) {
        cetakButton.addEventListener('click', function () {
            const laporan = document.getElementById('laporanKeuangan');
            if (laporan) {
                const originalContent = document.body.innerHTML;
                document.body.innerHTML = laporan.outerHTML;
                window.print();
                document.body.innerHTML = originalContent;
                document.getElementById('cetakButton').addEventListener('click', arguments.callee);
            }
        });
    }
});

function displayKeuangan(orders) {
    const contentElement = document.querySelector(".content");

    if (!contentElement) {
        console.error("Elemen dengan class 'content' tidak ditemukan.");
        return;
    }

    if (!orders || orders.length === 0) {
        contentElement.innerHTML = "<p>Tidak ada data keuangan yang tersedia.</p>";
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
