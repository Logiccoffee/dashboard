import { postJSON } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.4/api.js';
import { onClick } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.4/element.js';


function updateStatus(index, newStatus) {
    // Perbarui status di elemen tampilan
    const statusCell = document.getElementById(`status-${index}`);
    if (statusCell) {
        statusCell.textContent = newStatus;

        // Opsional: Kirim data ke backend jika diperlukan
        console.log(`Status pesanan index ${index} diperbarui menjadi ${newStatus}`);
    }
}

// Tambahkan event listener ke elemen dropdown-item secara dinamis
document.querySelectorAll('.dropdown-menu a.dropdown-item').forEach((item) => {
    item.addEventListener('click', function (event) {
        event.preventDefault();

        // Cari index pesanan dari atribut atau elemen terkait
        const parentButton = this.closest('.dropdown').querySelector('button');
        const index = parentButton.id.replace('dropdownMenuButton', ''); // Ambil index dari ID button

        // Ambil status baru dari teks elemen yang diklik
        const newStatus = this.textContent.trim();

        // Perbarui status menggunakan fungsi
        updateStatus(index, newStatus);
    });
});
