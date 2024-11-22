import { postJSON } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.4/api.js';
import { onClick } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.4/element.js';
import { getCookie } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.3/cookie.js';


function updateStatus(index, newStatus) {
    // Perbarui status di elemen tampilan
    const statusCell = document.getElementById(`status-${index}`);
    if (statusCell) {
        statusCell.textContent = newStatus;

        // Kirim data ke backend jika diperlukan (menggunakan postJSON)
        const targetUrl = 'https://your-backend-api-url.com/update-status'; // Ganti dengan URL backend Anda
        const tokenKey = 'Authorization'; // Ganti jika diperlukan
        const tokenValue = 'Bearer your-token'; // Ganti dengan token Anda jika diperlukan
        const data = {
            orderIndex: index,
            status: newStatus
        };

        // Kirim pembaruan status ke backend
        postJSON(targetUrl, tokenKey, tokenValue, data, (response) => {
            console.log('Status berhasil diperbarui:', response);
        });
    } else {
        console.error(`Element with ID status-${index} not found.`);
    }
}

// Tambahkan event listener ke elemen dropdown-item secara dinamis
document.querySelectorAll('.dropdown-menu a.dropdown-item').forEach((item) => {
    item.addEventListener('click', function (event) {
        event.preventDefault();

        const parentButton = this.closest('.dropdown').querySelector('button');
        if (!parentButton) return;

        const index = parentButton.id.replace('dropdownMenuButton', '').trim(); // Validasi ID
        const newStatus = this.textContent.trim();

        updateStatus(index, newStatus);
    });
});


onClick('update-status-btn', function () {
    const index = 1; // Ganti dengan index yang sesuai
    const newStatus = 'Diproses'; // Ganti dengan status baru yang sesuai
    updateStatus(index, newStatus);
});

window.updateStatus = updateStatus;
