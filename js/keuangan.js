import { postJSON } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.4/api.js';
import { onClick } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.4/element.js';


document.addEventListener('DOMContentLoaded', function () {
    const cetakQrisButton = document.getElementById('cetakQris');
    const cetakCashButton = document.getElementById('cetakCash');

    function cetakLaporan(filterMethod) {
        const laporanKeuangan = document.querySelector('.table');
        if (laporanKeuangan) {
            // Filter baris berdasarkan metode transaksi
            const rows = Array.from(laporanKeuangan.querySelectorAll('tbody tr'));
            const filteredRows = rows.filter(row => {
                const metodeTransaksi = row.cells[2].textContent.trim(); // Ambil kolom metode transaksi
                return metodeTransaksi === filterMethod;
            });

            // Buat tabel baru hanya dengan baris yang difilter
            const filteredTable = document.createElement('table');
            filteredTable.classList.add('table', 'table-striped');
            filteredTable.innerHTML = `
                <thead>${laporanKeuangan.querySelector('thead').innerHTML}</thead>
                <tbody>${filteredRows.map(row => row.outerHTML).join('')}</tbody>
            `;

            // Cetak tabel yang difilter
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Cetak Laporan Keuangan</title>
                        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css">
                        <style>
                            body {
                                font-family: 'Signika', sans-serif;
                                padding: 20px;
                            }
                            h2 {
                                text-align: center;
                                margin-bottom: 20px;
                            }
                        </style>
                    </head>
                    <body>
                        <h2>Laporan Keuangan (${filterMethod})</h2>
                        ${filteredTable.outerHTML}
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        } else {
            console.error("Tabel dengan class 'table' tidak ditemukan!");
        }
    }

    if (cetakQrisButton) {
        cetakQrisButton.addEventListener('click', () => cetakLaporan('Qris'));
    }

    if (cetakCashButton) {
        cetakCashButton.addEventListener('click', () => cetakLaporan('Cash'));
    }
});

