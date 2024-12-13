document.addEventListener('DOMContentLoaded', function () {
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

            // Tampilkan tabel hasil filter di modal
            const modalBody = document.querySelector('#cetakModal .modal-body');
            modalBody.innerHTML = '';
            modalBody.appendChild(filteredTable);

            // Tampilkan modal
            const cetakModal = new bootstrap.Modal(document.getElementById('cetakModal'));
            cetakModal.show();
        }
    }

    // Tambahkan event listener langsung ke tombol cetak
    const cetakQrisButton = document.getElementById('cetakQris');
    if (cetakQrisButton) {
        cetakQrisButton.addEventListener('click', () => cetakLaporan('Qris'));
    }

    const cetakCashButton = document.getElementById('cetakCash');
    if (cetakCashButton) {
        cetakCashButton.addEventListener('click', () => cetakLaporan('Cash'));
    }
});
