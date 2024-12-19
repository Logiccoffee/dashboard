import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";

// Ambil token dari cookie dengan nama 'login'
const token = getCookie('login');
if (!token) {
    alert('Token tidak ditemukan, harap login terlebih dahulu!');
    throw new Error("Token tidak ditemukan. Harap login ulang.");
}

// Fungsi untuk menampilkan data pesanan di tabel
function displayOrders(orders) {
    const container = document.querySelector('.table tbody');

    // Pastikan elemen container ditemukan
    if (!container) {
        console.error("Elemen dengan class 'table' tidak ditemukan.");
        return;
    }

    // Hapus data lama jika ada
    container.innerHTML = '';

    // Variabel untuk menyimpan total keuangan
    let totalKeuangan = 0;

    // Tampilkan data pesanan
    orders.forEach(order => {
        const row = document.createElement('tr');

        // Kolom Tanggal Pesanan
        const orderDateCell = document.createElement('td');
        orderDateCell.textContent = order.orderDate || '-';
        row.appendChild(orderDateCell);

        // Kolom Metode Pembayaran
        const paymentMethodCell = document.createElement('td');
        paymentMethodCell.textContent = order.paymentMethod || order.payment_method || '-';
        row.appendChild(paymentMethodCell);

        // Kolom Total
        const totalPriceCell = document.createElement('td');
        const total = parseFloat(order.total || 0); // Parsing sebagai angka
        totalPriceCell.textContent = total > 0
            ? `Rp ${total.toLocaleString('id-ID', { minimumFractionDigits: 2 })}`
            : '-';
        row.appendChild(totalPriceCell);

        // Tambahkan ke total keuangan
        totalKeuangan += total;

        // Kolom Jumlah (Jumlah produk)
        const quantityCell = document.createElement('td');
        const quantity = order.orders.reduce((acc, item) => acc + (item.quantity || 0), 0);
        quantityCell.textContent = quantity || '-';
        row.appendChild(quantityCell);

        container.appendChild(row);
    });

    // Format total keuangan dan masukkan ke dalam elemen
    const totalKeuanganFormatted = totalKeuangan.toLocaleString('id-ID', { minimumFractionDigits: 0 });
    document.getElementById('totalKeuangan').textContent = `Rp ${totalKeuanganFormatted}`;
}

// Panggil API menggunakan getJSON
getJSON(
    "https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/orders",
    "login",
    token,
    (response) => {
        if (response.status === "success") {
            const orders = response.data || [];
            displayOrders(orders); // Tampilkan data pesanan
        } else {
            console.error(`Error: ${response.status}`);
            alert("Gagal memuat data pesanan. Silakan coba lagi.");
        }
    }
);


//Fungsi button cetak
document.getElementById('cetakButton').addEventListener('click', function () {
    // Ambil seluruh konten yang ingin dicetak, termasuk infobox dan tabel
    const contentToPrint = document.querySelector('.content').innerHTML;

    // Buat jendela baru untuk cetak
    const printWindow = window.open('', '', 'width=800,height=600');

    // Tulis HTML ke dalam jendela cetak
    printWindow.document.write(`
        <html>
            <head>
                <title>Cetak Laporan Keuangan</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                    }
                    /* Tabel */
                    .table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    .table th, .table td {
                        padding: 8px;
                        border: 1px solid #ddd;
                        text-align: left;
                    }
                    .table-dark {
                        background-color: #343a40;
                        color: #fff;
                    }
                    /* Info-Box Styles */
                    .info-box {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        gap: 10px;
                        border: 1px solid #ddd;
                        padding: 10px;
                        margin-bottom: 15px; /* Jarak antar info-box */
                    }
                    .box-content {
                        text-align: left;
                    }
                    .box-icon {
                        font-size: 40px;
                    }
                    .box-content p {
                        margin: 0;
                    }
                    /* Styling untuk tombol cetak */
                    #cetakButton {
                        display: none;
                    }
                </style>
            </head>
            <body>
                ${contentToPrint} <!-- Konten yang ingin dicetak -->
            </body>
        </html>
    `);

    // Setelah menulis ke dokumen, cetak
    printWindow.document.close(); // Menutup dokumen
    printWindow.print();  // Menampilkan dialog cetak
});
