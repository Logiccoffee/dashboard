import { getJSON, postJSON, putJSON, deleteJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";

// Array untuk menyimpan data order
let orders = [];
let currentEditIndex = null;
let currentDeleteIndex = null;

// Ambil token dari cookie
const token = getCookie('login');
if (!token) {
    alert('Token tidak ditemukan, harap login terlebih dahulu!');
    throw new Error("Token tidak ditemukan. Harap login ulang.");
}

// Ambil data order dari API
getJSON('https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/order', "Login", token, (response) => {
    if (response.status === 200) {
        orders = response.data.data || [];
        displayOrders(response);
    } else {
        console.error(`Error: ${response.status}`);
        alert("Gagal memuat data order. Silakan coba lagi.");
    }
});

// Fungsi untuk menampilkan data order di dalam tabel
function displayOrders(response) {
    if (!response || !response.data || !response.data.data) {
        console.error("Data order tidak valid.");
        alert("Data order tidak valid. Silakan hubungi administrator.");
        return;
    }

    const orderData = response.data.data;
    const container = document.getElementById('transaction-list'); // Ubah ID target menjadi 'transaction-list'
    if (!container) {
        console.error("Elemen dengan id 'transaction-list' tidak ditemukan.");
        return;
    }

    container.innerHTML = '';

    orderData.forEach((item, index) => {
        const row = document.createElement('tr');

        // Kolom ID Order
        const idCell = document.createElement('td');
        idCell.textContent = item.id;

        // Kolom Nama Pelanggan
        const customerCell = document.createElement('td');
        customerCell.textContent = item.customer_name;

        // Kolom Total Harga
        const totalCell = document.createElement('td');
        totalCell.textContent = `Rp${item.total_price.toLocaleString()}`;

        // Kolom Status
        const statusCell = document.createElement('td');
        statusCell.textContent = item.status;

        // Kolom Aksi
        const actionCell = document.createElement('td');
        actionCell.classList.add('text-center');

        // Tombol Ubah
        const editButton = document.createElement('button');
        editButton.className = 'btn btn-warning me-2';
        editButton.innerHTML = '<i class="fas fa-pen"></i> Ubah';
        editButton.addEventListener('click', () => {
            currentEditIndex = index;
            openEditModal(index);
        });

        // Tombol Hapus
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger';
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i> Hapus';
        deleteButton.addEventListener('click', () => {
            currentDeleteIndex = index;
            openDeleteModal(index);
        });

        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);

        // Tambahkan kolom ke baris
        row.appendChild(idCell);
        row.appendChild(customerCell);
        row.appendChild(totalCell);
        row.appendChild(statusCell);
        row.appendChild(actionCell);

        // Tambahkan baris ke tabel
        container.appendChild(row);
    });
}

// Fungsi untuk mendapatkan nilai cookie berdasarkan nama
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Fungsi untuk membuka modal edit order
function openEditModal(index) {
    const order = orders[index];
    document.getElementById('edit-order-id').value = order.id;
    document.getElementById('edit-order-status').value = order.status;

    const editOrderModal = new bootstrap.Modal(document.getElementById('editOrderModal'));
    editOrderModal.show();
}

// Fungsi untuk menangani submit form saat mengubah order
document.getElementById('edit-order-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const updatedStatus = document.getElementById('edit-order-status').value;
    if (!updatedStatus) {
        alert('Status tidak boleh kosong!');
        return;
    }

    const targetUrl = `${'https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/order'}/${orders[currentEditIndex].id}`;

    const updatedOrderData = { status: updatedStatus };

    putJSON(targetUrl, 'Login', token, updatedOrderData, (response) => {
        if (response.status >= 200 && response.status < 300) {
            orders[currentEditIndex].status = updatedStatus;
            displayOrders({ data: { data: orders } });

            alert('Order berhasil diubah!');
            const editOrderModal = bootstrap.Modal.getInstance(document.getElementById('editOrderModal'));
            editOrderModal.hide();
            currentEditIndex = null;
        } else {
            console.error('Gagal mengubah order:', response.data);
            alert('Gagal mengubah order!');
        }
    });
});

// Fungsi untuk membuka modal konfirmasi hapus order
function openDeleteModal(index) {
    currentDeleteIndex = index;
    const deleteOrderModal = new bootstrap.Modal(document.getElementById('deleteOrderModal'));
    deleteOrderModal.show();
}

// Fungsi untuk menghapus order setelah konfirmasi
document.getElementById('confirm-delete-order-btn').addEventListener('click', () => {
    if (currentDeleteIndex !== null) {
        const targetUrl = `${'https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/order'}/${orders[currentDeleteIndex].id}`;

        deleteJSON(targetUrl, 'Login', token, {}, (response) => {
            if (response.status === 200) {
                orders.splice(currentDeleteIndex, 1);
                displayOrders({ data: { data: orders } });

                Swal.fire({
                    title: 'Sukses!',
                    text: 'Order berhasil dihapus.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    const deleteOrderModal = bootstrap.Modal.getInstance(document.getElementById('deleteOrderModal'));
                    deleteOrderModal.hide();
                    currentDeleteIndex = null;
                });
            } else {
                Swal.fire('Gagal', 'Terjadi kesalahan saat menghapus order', 'error');
            }
        });
    }
});
