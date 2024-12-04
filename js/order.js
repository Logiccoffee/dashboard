import { getJSON, postJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";

// Array untuk menyimpan data kategori
let order = [];

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
    method: 'GET', // Menggunakan GET jika API sesuai
    headers: {
        'Authorization': `Bearer ${token}`, // Pastikan menggunakan 'Authorization' sebagai header untuk token
        'Content-Type': 'application/json',
    }
})
    .then(response => response.json()) // Parse JSON dari respons
    .then(response => {
        if (response.status === 200) {
            const orders = response.data || []; // Memastikan data diakses dengan benar
            displayOrders(orders);
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
        const productNameCell = document.createElement('td');
        productNameCell.textContent = order.orders
            ? order.orders.map(item => item.productName).join(', ')
            : '-';
        row.appendChild(productNameCell);

        // Kolom Jumlah + Harga Satuan
        const quantityPriceCell = document.createElement('td');
        quantityPriceCell.textContent = order.orders
            ? order.orders.map(item => `${item.quantity} x Rp ${item.price}`).join(', ')
            : '-';
        row.appendChild(quantityPriceCell);

        // Kolom Harga Total
        const totalPriceCell = document.createElement('td');
        totalPriceCell.textContent = order.total ? `Rp ${order.total.toLocaleString()}` : '-';
        row.appendChild(totalPriceCell);

        // Kolom Metode Pembayaran
        const paymentMethodCell = document.createElement('td');
        paymentMethodCell.textContent = order.paymentMethod || '-';
        row.appendChild(paymentMethodCell);

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
