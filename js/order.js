// Mengimpor modul untuk HTTP request
import { getJSON, postJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import { putJSON, deleteJSON } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.3/api.js";

// Mengambil data token dari cookie
const token = getCookie('login');
if (!token) {
    alert('Token tidak ditemukan, harap login terlebih dahulu!');
    throw new Error("Token tidak ditemukan. Harap login ulang.");
}

// Data kategori yang diambil dari API
let orders = [];
let currentEditIndex = null; // Menyimpan index order yang sedang diedit
let currentDeleteIndex = null; // Menyimpan index order yang akan dihapus

// Ambil data order dari API
getJSON('https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/order', "Login", token, (response) => {
    if (response.status === 200) {
        orders = response.data.data || []; // Menyimpan data order yang ada
        displayOrders(response);
    } else {
        console.error(`Error: ${response.status}`);
        alert("Gagal memuat data order. Silakan coba lagi.");
    }
});

// Fungsi untuk menampilkan data order di dalam tbody dengan id 'transaction-list'
function displayOrders(response) {
    const orderData = response.data.data; // Ambil data order dari response
    const container = document.getElementById('transaction-list');

    if (!container) {
        console.error("Elemen dengan id 'transaction-list' tidak ditemukan.");
        return;
    }

    container.innerHTML = ''; // Hapus data lama jika ada

    orderData.forEach((item, index) => {
        // Membuat baris untuk setiap order
        const row = document.createElement('tr');

        // Kolom Nama Produk
        const nameCell = document.createElement('td');
        nameCell.textContent = item.product_name;

        // Kolom Jumlah
        const quantityCell = document.createElement('td');
        quantityCell.textContent = item.quantity;

        // Kolom Harga
        const priceCell = document.createElement('td');
        priceCell.textContent = item.price;

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
        // Event listener untuk tombol Ubah
        editButton.addEventListener('click', () => {
            currentEditIndex = index;
            const modal = new bootstrap.Modal(document.getElementById('editOrderModal'));
            modal.show();
            document.getElementById('edit-order-status').value = orders[index].status;
        });

        // Tombol Hapus
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger';
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i> Hapus';
        // Event listener untuk tombol Hapus
        deleteButton.addEventListener('click', () => {
            currentDeleteIndex = index;
            const deleteOrderModal = new bootstrap.Modal(document.getElementById('deleteOrderModal'));
            deleteOrderModal.show();
        });

        // Menambahkan tombol ke kolom aksi
        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);

        // Menambahkan kolom ke dalam baris
        row.appendChild(nameCell);
        row.appendChild(quantityCell);
        row.appendChild(priceCell);
        row.appendChild(statusCell);
        row.appendChild(actionCell);

        // Menambahkan baris ke dalam container
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

// Fungsi untuk menambah order
function addOrder(event) {
    event.preventDefault(); // Mencegah form submit biasa agar bisa menggunakan JavaScript

    const orderProductName = document.getElementById('order-product-name').value.trim();
    const orderQuantity = document.getElementById('order-quantity').value.trim();
    const orderPrice = document.getElementById('order-price').value.trim();

    // Validasi input order
    if (orderProductName === '' || orderQuantity === '' || orderPrice === '') {
        alert('Semua field harus diisi!');
        return false;
    }

    const newOrder = {
        product_name: orderProductName,
        quantity: orderQuantity,
        price: orderPrice
    };

    postJSON('https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/order', 'Login', token, newOrder, function (response) {
        const { status, data } = response;

        if (status >= 200 && status < 300) {
            alert('Order berhasil ditambahkan!');

            const modal = bootstrap.Modal.getInstance(document.getElementById('addOrderModal'));
            modal.hide();

            getJSON('https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/order', "Login", token, (response) => {
                if (response.status === 200) {
                    orders = response.data.data || [];
                    displayOrders(response);
                } else {
                    console.error(`Error: ${response.status}`);
                    alert("Gagal memuat data order. Silakan coba lagi.");
                }
            });

            document.getElementById('order-product-name').value = '';
            document.getElementById('order-quantity').value = '';
            document.getElementById('order-price').value = '';
        } else {
            alert('Gagal menambah order!');
        }
    });
}

// Menunggu hingga DOM selesai dimuat
document.addEventListener('DOMContentLoaded', function () {
    const addOrderForm = document.getElementById('add-order-form');
    const editOrderForm = document.getElementById('edit-order-form');
    const deleteOrderForm = document.getElementById('delete-order-form');

    // Mengecek apakah elemen ada sebelum menambahkan event listener
    if (addOrderForm) {
        addOrderForm.addEventListener('submit', addOrder);
    } else {
        console.error("Element with id 'add-order-form' not found.");
    }

    if (editOrderForm) {
        editOrderForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const updatedOrderStatus = document.getElementById('edit-order-status').value.trim();

            if (updatedOrderStatus === '') {
                alert('Status order tidak boleh kosong!');
                return;
            }

            const targetUrl = `https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/order/${orders[currentEditIndex].id}`;
            const updatedOrderData = { status: updatedOrderStatus };

            putJSON(targetUrl, 'Login', token, updatedOrderData, function (response) {
                const { status, data } = response;

                if (status >= 200 && status < 300) {
                    orders[currentEditIndex].status = updatedOrderStatus;
                    displayOrders({ data: { data: orders } });

                    alert('Status order berhasil diubah!');

                    const editOrderModal = bootstrap.Modal.getInstance(document.getElementById('editOrderModal'));
                    editOrderModal.hide();
                } else {
                    alert('Gagal mengubah status order!');
                }
            });
        });
    } else {
        console.error("Element with id 'edit-order-form' not found.");
    }

    if (deleteOrderForm) {
        deleteOrderForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const token = getCookie('login');
            if (!token) {
                alert('Token tidak ditemukan, harap login terlebih dahulu!');
                return;
            }

            const orderIdToDelete = orders[currentDeleteIndex].id;

            deleteJSON(`https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/order/${orderIdToDelete}`, 'Login', token, (response) => {
                const { status, data } = response;

                if (status >= 200 && status < 300) {
                    orders.splice(currentDeleteIndex, 1);
                    displayOrders({ data: { data: orders } });

                    alert('Order berhasil dihapus!');

                    const deleteOrderModal = bootstrap.Modal.getInstance(document.getElementById('deleteOrderModal'));
                    deleteOrderModal.hide();
                } else {
                    alert('Gagal menghapus order!');
                }
            });
        });
    } else {
        console.error("Element with id 'delete-order-form' not found.");
    }
});
