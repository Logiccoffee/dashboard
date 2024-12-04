import { getJSON, postJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import { putJSON, deleteJSON } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.3/api.js";

// Get token from cookie
const token = getCookie('login');
if (!token) {
    alert('Token tidak ditemukan, harap login terlebih dahulu!');
    throw new Error("Token tidak ditemukan. Harap login ulang.");
}

// Variable to store orders data
let orders = [];

// Fetch order data from API
getJSON('https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/order', "Login", token, (response) => {
    if (response.status === 200) {
        orders = response.data.data || [];
        displayOrders(orders);
    } else {
        console.error(`Error: ${response.status}`);
        alert("Gagal memuat data order. Silakan coba lagi.");
    }
});

// Function to display orders in the table
function displayOrders(orderData) {
    const container = document.getElementById('transaction-list');
    if (!container) {
        console.error("Element dengan id 'transaction-list' tidak ditemukan.");
        return;
    }

    container.innerHTML = ''; // Clear previous data

    orderData.forEach((item, index) => {
        const row = document.createElement('tr');

        // Product name
        const nameCell = document.createElement('td');
        nameCell.textContent = item.product_name;

        // Quantity and price
        const quantityCell = document.createElement('td');
        quantityCell.textContent = item.quantity;

        const priceCell = document.createElement('td');
        priceCell.textContent = item.price;

        // Status
        const statusCell = document.createElement('td');
        statusCell.textContent = item.status;

        // Action buttons
        const actionCell = document.createElement('td');
        actionCell.classList.add('text-center');

        const editButton = document.createElement('button');
        editButton.className = 'btn btn-warning me-2';
        editButton.innerHTML = '<i class="fas fa-pen"></i> Ubah';
        editButton.addEventListener('click', () => {
            alert("Edit order feature to be added.");
        });

        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger';
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i> Hapus';
        deleteButton.addEventListener('click', () => {
            alert("Delete order feature to be added.");
        });

        // Append buttons to action column
        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);

        // Append columns to row
        row.appendChild(nameCell);
        row.appendChild(quantityCell);
        row.appendChild(priceCell);
        row.appendChild(statusCell);
        row.appendChild(actionCell);

        // Append row to table body
        container.appendChild(row);
    });
}

// Function to get cookie value by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}
