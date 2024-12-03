import { getJSON, postJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import { putJSON, deleteJSON } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.3/api.js";

// Array to store orders data
let orders = [];
let currentEditIndex = null; // Store the index of the order being edited
let currentDeleteIndex = null; // Store the index of the order to be deleted

// Get token from cookies
const token = getCookie('login');
if (!token) {
    alert('Token tidak ditemukan, harap login terlebih dahulu!');
    throw new Error("Token tidak ditemukan. Harap login ulang.");
}

// Fetch orders from the API using getJSON
getJSON('https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/order', "Login", token, (response) => {
    if (response.status === 200) {
        orders = response.data.data || []; // Store the fetched order data
        displayOrders();
    } else {
        console.error(`Error: ${response.status}`);
        alert("Gagal memuat data pesanan. Silakan coba lagi.");
    }
});

// Display orders in the table
function displayOrders() {
    const container = document.getElementById('order-list');
    
    if (!container) {
        console.error("Elemen dengan id 'order-list' tidak ditemukan.");
        return;
    }

    container.innerHTML = ''; // Clear any existing data

    orders.forEach((item, index) => {
        const row = document.createElement('tr');

        const orderNameCell = document.createElement('td');
        orderNameCell.textContent = item.name;

        const statusCell = document.createElement('td');
        statusCell.textContent = item.status;

        const actionCell = document.createElement('td');
        actionCell.classList.add('text-center');

        // Edit button
        const editButton = document.createElement('button');
        editButton.className = 'btn btn-warning me-2';
        editButton.innerHTML = '<i class="fas fa-pen"></i> Ubah';
        editButton.addEventListener('click', () => {
            currentEditIndex = index;
            const modal = new bootstrap.Modal(document.getElementById('editOrderModal'));
            modal.show();
            document.getElementById('edit-order-name').value = orders[index].name;
        });

        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger';
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i> Hapus';
        deleteButton.addEventListener('click', () => {
            currentDeleteIndex = index;
            const deleteOrderModal = new bootstrap.Modal(document.getElementById('deleteOrderModal'));
            deleteOrderModal.show();
        });

        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);

        row.appendChild(orderNameCell);
        row.appendChild(statusCell);
        row.appendChild(actionCell);

        container.appendChild(row);
    });
}

// Get cookie value by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Function to add a new order
function addOrder(event) {
    event.preventDefault();

    const orderName = document.getElementById('order-name').value.trim();
    if (orderName === '') {
        alert('Nama pesanan tidak boleh kosong!');
        return false;
    }

    const newOrder = { name: orderName };

    postJSON('https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/order', 'login', token, newOrder, function (response) {
        const { status } = response;
        if (status >= 200 && status < 300) {
            alert('Pesanan berhasil ditambahkan!');
            const modal = bootstrap.Modal.getInstance(document.getElementById('addOrderModal'));
            modal.hide();

            // Refresh orders after adding new order
            getJSON('https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/order', "Login", token, (response) => {
                if (response.status === 200) {
                    orders = response.data.data || [];
                    displayOrders();
                } else {
                    alert("Gagal memuat data pesanan. Silakan coba lagi.");
                }
            });

            document.getElementById('order-name').value = '';
        } else {
            alert('Gagal menambah pesanan!');
        }
    });
}

// Event listener for add order form submission
document.getElementById('add-order-form').addEventListener('submit', addOrder);

// Edit order form submission
document.getElementById('edit-order-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const updatedOrderName = document.getElementById('edit-order-name').value.trim();
    if (updatedOrderName === '') {
        alert('Nama pesanan tidak boleh kosong!');
        return;
    }

    const targetUrl = `https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/order/${orders[currentEditIndex].id}`;

    const updatedOrderData = { name: updatedOrderName };

    putJSON(targetUrl, 'Login', token, updatedOrderData, function (response) {
        if (response.status >= 200 && response.status < 300) {
            orders[currentEditIndex].name = updatedOrderName;
            displayOrders();
            alert('Pesanan berhasil diubah!');
            const editOrderModal = bootstrap.Modal.getInstance(document.getElementById('editOrderModal'));
            editOrderModal.hide();
            currentEditIndex = null;
        } else {
            alert('Gagal mengubah pesanan!');
        }
    });
});

// Delete order after confirmation
document.getElementById('confirm-delete-btn').addEventListener('click', () => {
    if (currentDeleteIndex !== null) {
        const targetUrl = `https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/order/${orders[currentDeleteIndex].id}`;

        deleteJSON(targetUrl, 'Login', token, {}, (response) => {
            if (response.status === 200) {
                orders.splice(currentDeleteIndex, 1);
                displayOrders();
                Swal.fire({
                    title: 'Sukses!',
                    text: 'Pesanan berhasil dihapus.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    const deleteOrderModal = bootstrap.Modal.getInstance(document.getElementById('deleteOrderModal'));
                    deleteOrderModal.hide();
                    currentDeleteIndex = null;
                });
            } else {
                Swal.fire('Gagal', 'Terjadi kesalahan saat menghapus pesanan', 'error');
            }
        });
    }
});

// Open modal to edit order
function openEditModal(index) {
    currentEditIndex = index;
    const order = orders[index];
    document.getElementById('edit-order-name').value = order.name;

    const editOrderModal = new bootstrap.Modal(document.getElementById('editOrderModal'));
    editOrderModal.show();
}

// Open modal to delete order
function openDeleteModal(index) {
    currentDeleteIndex = index;
    const deleteOrderModal = new bootstrap.Modal(document.getElementById('deleteOrderModal'));
    deleteOrderModal.show();
}

// Event listener for the add order button
document.getElementById('add-order-btn').addEventListener('click', () => {
    const addOrderModal = new bootstrap.Modal(document.getElementById('addOrderModal'));
    addOrderModal.show();
});
