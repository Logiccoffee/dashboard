import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";

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
    
         // Kolom Kode Transaksi (orderNumber)
         const orderNumberCell = document.createElement('td');
         orderNumberCell.textContent = order.orderNumber  || '-'; // Ganti dengan '-' jika kosong
         row.appendChild(orderNumberCell);
         
         // Kolom Nomor Antrian (queueNumber) ...
         const queueNumberCell = document.createElement('td');
         queueNumberCell.textContent = order.queueNumber > 0 ? order.queueNumber: '-';  // Ganti dengan '-' jika 0
         row.appendChild(queueNumberCell);

        // Kolom Nama Produk
        const menuNameCell = document.createElement('td');
        menuNameCell.textContent = order.orders && order.orders.length > 0
            ? order.orders.map(item => item.menu_name || 'Tidak Diketahui').join(', ') // Tangani kasus `menu_name` kosong
            : '-';
        row.appendChild(menuNameCell);

        // Kolom Jumlah + Harga Satuan
        const quantityPriceCell = document.createElement('td');
        quantityPriceCell.textContent = order.orders && order.orders.length > 0
            ? order.orders.map(item => `${item.quantity} x Rp ${item.price.toLocaleString('id-ID')}`).join(', ')
            : '-';
        row.appendChild(quantityPriceCell);

        // Kolom Harga Total
        const totalPriceCell = document.createElement('td');
        totalPriceCell.textContent = order.total 
            ? `Rp ${order.total.toLocaleString('id-ID')}` 
            : '-'; // Gunakan tanda backtick untuk string template
        row.appendChild(totalPriceCell);
        

        // Kolom Metode Pembayaran & Status
        const paymentStatusCell = document.createElement('td');
        paymentStatusCell.textContent = `${order.payment_method || '-'} - ${order.status || '-'}`;
        row.appendChild(paymentStatusCell);

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
