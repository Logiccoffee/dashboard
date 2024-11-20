import { postJSON } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.4/api.js';
import { onClick } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.4/element.js';


function updateStatus(index, newStatus) {
    const statusCell = document.getElementById(`status-${index}`);
    statusCell.textContent = newStatus;
    transactions[index].status = newStatus; // Perbarui status dalam array
}

// Jika perlu, pastikan updateStatus dipanggil pada setiap klik
document.querySelectorAll('.dropdown-item').forEach((item, index) => {
    item.addEventListener('click', () => {
        updateStatus(index, item.textContent.trim());
    });
});