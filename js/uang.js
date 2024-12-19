import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";

// get data order by user id
getJSON(
  "https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/orders",
  "login",
  getCookie("login"),
  displayOrders
);

// Fungsi untuk menampilkan data pesanan di tabel
function displayOrders(orders) {
  // Pastikan orders.data adalah array
  const data = Array.isArray(orders.data) ? orders.data : [];
  console.log(data); // Debug untuk memastikan data adalah array

  const container = document.querySelector('.table tbody');

  if (!container) {
      console.error("Elemen dengan class 'table' tidak ditemukan.");
      return;
  }
  
    // Hapus data lama jika ada
    container.innerHTML = '';

    // Variabel untuk menyimpan total keuangan
    let totalKeuangan = 0;

    // Tampilkan data pesanan
    orders.forEach((order) => {
        const row = document.createElement('tr');

        // Kolom Tanggal Pesanan
        const orderDateCell = document.createElement('td');
        orderDateCell.textContent = order.orderDate || '-'; // Menampilkan tanggal pesanan
        row.appendChild(orderDateCell);

        // Kolom Metode Pembayaran
        const paymentMethodCell = document.createElement('td');
        paymentMethodCell.textContent = order.paymentMethod || order.payment_method || '-';
        row.appendChild(paymentMethodCell);

        // Kolom Total
        const totalPriceCell = document.createElement('td');

        // Ambil nilai total dari API
        let total = typeof order.total === 'string'
            ? parseInt(order.total.replace(/[^\d,]/g, '').replace(',', '.')) // Hapus simbol selain angka dan ganti koma dengan titik
            : order.total || 0;  // Jika bukan string, langsung ambil nilainya

        // Format angka dengan dua angka desimal (Rp xx.xxx,xx)
        let formattedTotal = total.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        // Menampilkan total dalam format Rp xx.xxx,xx
        totalPriceCell.textContent = total > 0
            ? `Rp ${formattedTotal}`  // Format angka dengan dua angka desimal
            : '-';

        row.appendChild(totalPriceCell);




        // Menambahkan total keuangan
        totalKeuangan += total;


        // let total = order.total ? order.total : 0; // Jika order.total tidak ada, set ke 0
        // console.log("Nilai order.total sebelum format:", order.total); // Debugging untuk nilai awal
        // totalPriceCell.textContent = total !== 0 ? `Rp ${total.toLocaleString('id-ID')}` : '-'; // Menampilkan total harga
        // console.log("TextContent setelah format:", totalPriceCell.textContent); // Debugging untuk hasil akhir
        // row.appendChild(totalPriceCell);


        // Kolom Jumlah (Jumlah produk)
        const quantityCell = document.createElement('td');
        const quantity = order.orders.reduce((acc, item) => acc + item.quantity, 0);  // Menjumlahkan kuantitas produk
        quantityCell.textContent = quantity || '-'; // Menampilkan jumlah produk
        row.appendChild(quantityCell);

        container.appendChild(row);
    });

    // Format total keuangan dan masukkan ke dalam elemen
    const totalKeuanganFormatted = totalKeuangan.toLocaleString('id-ID', { minimumFractionDigits: 0 });
    document.getElementById('totalKeuangan').textContent = `Rp ${totalKeuanganFormatted}`;
}

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
