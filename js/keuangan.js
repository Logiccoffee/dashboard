import { onClick } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.4/element.js';


// Hapus aksi setelah klik pada item dropdown
document.querySelectorAll('.dropdown-menu a.dropdown-item').forEach((item) => {
    item.addEventListener('click', function (event) {
        event.preventDefault();  // Mencegah aksi default, misalnya reload atau navigasi
        
        // Di sini tidak ada aksi yang dilakukan, jadi bisa kosong
        console.log("Dropdown item diklik, tapi tidak ada aksi.");
    });
});


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

    // Gunakan onClick dari jscroot
    onClick('#cetakQris', () => cetakLaporan('Qris'));
    onClick('#cetakCash', () => cetakLaporan('Cash'));
});
