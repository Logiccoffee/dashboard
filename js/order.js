import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";

// Array untuk menyimpan data pesanan
let orders = [];

// URL API
const API_URL = "https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/order";

// Ambil token dari cookie
const token = getCookie('login');
if (!token) {
    alert('Token tidak ditemukan, harap login terlebih dahulu!');
    throw new Error("Token tidak ditemukan. Harap login ulang.");
}

// Panggil API untuk mengambil data pesanan
fetch(API_URL, {
    method: 'GET',
    headers: {
        'login': token,
        'Content-Type': 'application/json',
    }
})
    .then(response => response.json())
    .then(response => {
        if (response.status === "success") {
            orders = response.data || [];
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

    if (!container) {
        console.error("Elemen dengan ID 'transaction-list' tidak ditemukan.");
        return;
    }

    container.innerHTML = ''; // Bersihkan data lama

    orders.forEach((order, index) => {
        const row = document.createElement('tr');

        // Kolom Kode Transaksi
        const transactionCodeCell = document.createElement('td');
        transactionCodeCell.textContent = order.orderNumber || '-';
        row.appendChild(transactionCodeCell);

        // Kolom Nomor Antrian
        const queueNumberCell = document.createElement('td');
        queueNumberCell.textContent = order.queueNumber || '-';
        row.appendChild(queueNumberCell);

        // Kolom Nama Menu
        const menuNameCell = document.createElement('td');
        menuNameCell.textContent = order.orders
            ? order.orders.map(item => item.MenuName).join(', ')
            : '-';
        row.appendChild(menuNameCell);

        // Kolom Jumlah + Harga Satuan
        const quantityPriceCell = document.createElement('td');
        quantityPriceCell.textContent = order.orders
            ? order.orders.map(item => `${item.quantity} x Rp ${item.price.toLocaleString()}`).join(', ')
            : '-';
        row.appendChild(quantityPriceCell);

        // Kolom Harga Total
        const totalPriceCell = document.createElement('td');
        totalPriceCell.textContent = order.total ? `Rp ${order.total.toLocaleString()}` : '-';
        row.appendChild(totalPriceCell);

        // Kolom Metode Pembayaran
        const paymentMethodCell = document.createElement('td');
        paymentMethodCell.textContent = order.PaymentMethod || '-';
        row.appendChild(paymentMethodCell);

        // Kolom Status
        const statusCell = document.createElement('td');
        statusCell.id = `status-${index}`;
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

        const dropdown = createActionDropdown(index);
        actionCell.appendChild(dropdown);

        row.appendChild(actionCell);

        // Tambahkan baris ke tabel
        container.appendChild(row);
    });
}

// Fungsi untuk membuat dropdown aksi
function createActionDropdown(index) {
    const dropdown = document.createElement('div');
    dropdown.className = 'dropdown';

    const button = document.createElement('button');
    button.className = 'btn btn-secondary btn-sm dropdown-toggle';
    button.id = `dropdownMenuButton${index}`;
    button.setAttribute('data-toggle', 'dropdown');
    button.textContent = 'Aksi';
    dropdown.appendChild(button);

    const menu = document.createElement('div');
    menu.className = 'dropdown-menu';

    const actions = ['Diproses', 'Dikirim', 'Selesai', 'Dibatalkan'];
    actions.forEach(action => {
        const item = document.createElement('a');
        item.className = 'dropdown-item';
        item.href = '#';
        item.textContent = action;
        item.addEventListener('click', function (event) {
            event.preventDefault();
            updateStatus(index, action);
        });
        menu.appendChild(item);
    });

    dropdown.appendChild(menu);
    return dropdown;
}

// Fungsi untuk memperbarui status pesanan
function updateStatus(index, newStatus) {
    const order = orders[index];
    const statusCell = document.getElementById(`status-${index}`);
    if (statusCell) {
        statusCell.textContent = newStatus;

        // Kirim data ke backend
        const targetUrl = `${API_URL}/update-status`; // Sesuaikan URL
        const data = {
            id: order.id,
            status: newStatus,
        };

        fetch(targetUrl, {
            method: 'POST',
            headers: {
                'login': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(response => {
                if (response.status === "success") {
                    console.log('Status berhasil diperbarui:', response);
                } else {
                    console.error('Gagal memperbarui status:', response);
                    alert("Gagal memperbarui status pesanan.");
                }
            })
            .catch(error => {
                console.error('Error updating status:', error);
                alert("Terjadi kesalahan saat memperbarui status.");
            });
    }
}

// Fungsi untuk mendapatkan nilai cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}
