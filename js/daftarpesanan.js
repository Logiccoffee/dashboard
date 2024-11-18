import { postJSON } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.4/api.js';
import { onClick } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.4/element.js';


 // Fungsi untuk memperbarui status
 function updateStatus(index, newStatus) {
    const statusCell = document.getElementById(`status-${index}`);
    statusCell.textContent = newStatus;
    transactions[index].status = newStatus; // Perbarui status dalam array
}