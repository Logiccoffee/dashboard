import { postJSON } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.4/api.js';
import { onClick } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.4/element.js';


// Fungsi untuk membuka halaman invoice
function openInvoice(index) {
    console.log(`Opening invoice for order index: ${index}`);
    // Arahkan ke halaman invoice
    window.location.href = `invoice.html?orderIndex=${index}`;
}

// Tambahkan event listener untuk item dropdown
document.querySelectorAll('.dropdown-menu a.dropdown-item').forEach((item) => {
    item.addEventListener('click', function (event) {
        event.preventDefault();

        const parentButton = this.closest('.dropdown').querySelector('button');
        if (!parentButton) return;

        const index = parentButton.id.replace('dropdownMenuButton', '').trim(); // Validasi ID
        const action = this.textContent.trim();

        if (action === 'Lihat') {
            openInvoice(index);
        } else if (action === 'Diproses' || action === 'Dikirim' || action === 'Selesai' || action === 'Dibatalkan') {
            updateStatus(index, action);
        }
    });
});


function updateStatus(index, newStatus) {
    // Perbarui elemen status
    const statusCell = document.getElementById(`status-${index}`);
    if (statusCell) {
        statusCell.textContent = newStatus;

        // Kirim data ke backend jika diperlukan
        const targetUrl = 'https://your-backend-api-url.com/update-status'; // URL backend Anda
        const data = { orderIndex: index, status: newStatus };

        postJSON(targetUrl, 'Authorization', 'Bearer your-token', data, (response) => {
            console.log('Status berhasil diperbarui:', response);
        });
    } else {
        console.error(`Element with ID status-${index} not found.`);
    }
}

onClick('update-status-btn', function () {
    const index = 1; // Ganti dengan index yang sesuai
    const newStatus = 'Diproses'; // Ganti dengan status baru yang sesuai
    updateStatus(index, newStatus);
});

window.updateStatus = updateStatus;
