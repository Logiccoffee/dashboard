import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";

// Array untuk menyimpan data pesanan
let orders = [];

// URL API
// URL API
const API_URL = "https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/order";

// Ambil token dari cookie dengan nama 'login'
const token = getCookie('login');
if (!token) {
    alert('Token tidak ditemukan, harap login terlebih dahulu!');
    throw new Error("Token tidak ditemukan. Harap login ulang.");
}

// Panggil API untuk mengambil data pesanan menggunakan fetch()
fetch(API_URL, {
    method: 'GET',
    headers: {
        'login': token, 
        'Content-Type': 'application/json',
    }
})
    .then(response => response.json()) // Parse JSON dari respons
    .then(response => {
        // Periksa status 'success' pada response
        if (response.status === "success") {
            const orders = response.data || []; // Pastikan data diakses dengan benar
            displayOrders(orders); // Tampilkan data pesanan
        } else {
            console.error(`Error: ${response.status}`);
            alert("Gagal memuat data pesanan. Silakan coba lagi.");
        }
    })
    .catch(error => {
        console.error("Error fetching data: ", error);
        alert("Terjadi kesalahan saat memuat data pesanan.");
    });

// Fungsi untuk menampilkan data pesanan di tabel
function displayOrders(orders) {
    const container = document.getElementById('transaction-list');

    // Pastikan elemen container ditemukan
    if (!container) {
        console.error("Elemen dengan ID 'transaction-list' tidak ditemukan.");
        return;
    }

    // Hapus data lama jika ada
    container.innerHTML = '';

    // Tampilkan data pesanan
    orders.forEach((order) => {
        const row = document.createElement('tr');

        // Kolom Kode Transaksi
        const transactionCodeCell = document.createElement('td');
        transactionCodeCell.textContent = order.orderNumber || '-';
        row.appendChild(transactionCodeCell);

        // Kolom Nomor Antrian
        const queueNumberCell = document.createElement('td');
        queueNumberCell.textContent = order.queueNumber || '-';
        row.appendChild(queueNumberCell);

        // Kolom Nama Produk
        const MenuNameCell = document.createElement('td');
        MenuNameCell.textContent = order.orders && order.orders.length > 0
            ? order.orders.map(item => item.menu_name).join(', ') // Sesuaikan dengan 'menu_name'
            : '-';
        row.appendChild(MenuNameCell);

        // Kolom Jumlah + Harga Satuan
        const quantityPriceCell = document.createElement('td');
        quantityPriceCell.textContent = order.orders && order.orders.length > 0
            ? order.orders.map(item => `${item.quantity} x ${item.price}`).join(', ')
            : '-';
        row.appendChild(quantityPriceCell);

        // Kolom Harga Total
        const totalPriceCell = document.createElement('td');
        totalPriceCell.textContent = order.total ? `Rp ${order.total.toLocaleString()}` : '-';
        row.appendChild(totalPriceCell);

        // Kolom Metode Pembayaran
        const PaymentMethodCell = document.createElement('td');
        PaymentMethodCell.textContent = order.payment_method || '-'; // Sesuaikan dengan 'payment_method'
        row.appendChild(PaymentMethodCell);

        // Kolom Status
        const statusCell = document.createElement('td');
        statusCell.textContent = order.status || '-';
        row.appendChild(statusCell);

        // Kolom Aksi
        const actionCell = document.createElement('td');
        const viewButton = document.createElement('button');
        viewButton.className = 'btn btn-primary btn-sm';
        viewButton.textContent = 'Lihat';
        viewButton.addEventListener('click', () => {
            alert(`Detail pesanan:\n\n${JSON.stringify(order, null, 2)}`);
        });
        actionCell.appendChild(viewButton);
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
    return null; // Jika cookie tidak ditemukan
}
