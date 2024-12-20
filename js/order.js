import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";

// URL API
const API_URL = "https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/orders";

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

        // Kolom Identitas / Customer Info
        const customerInfoCell = document.createElement('td');
        customerInfoCell.innerHTML = `
            Order Number: ${order.orderNumber || '-'}<br>
            Queue Number: ${order.queueNumber > 0 ? order.queueNumber : '-'}<br>
            Name: ${order.user_info?.name || '-'}<br>
            Whatsapp: ${order.user_info?.whatsapp || '-'}<br>
            Note: ${order.user_info?.note || '-'}
        `;
        row.appendChild(customerInfoCell);

        // Kolom Produk
        const productInfoCell = document.createElement('td');
        if (order.orders && order.orders.length > 0) {
            productInfoCell.innerHTML = order.orders.map(item => {
                return `${item.menu_name || 'Tidak Diketahui'} - ${item.quantity} x Rp ${item.price.toLocaleString('id-ID')}`;
            }).join('<br>');
        } else {
            productInfoCell.textContent = '-';
        }
        row.appendChild(productInfoCell);

        // Kolom Harga Total
        const totalPriceCell = document.createElement('td');
        const total = order.total || 0;
        totalPriceCell.textContent = total !== 0 ? total.toLocaleString('id-ID') : '-';
        row.appendChild(totalPriceCell);

        // Kolom Metode Pembayaran & Status
        const paymentStatusCell = document.createElement('td');
        paymentStatusCell.textContent = `${order.payment_method || '-'} - ${order.status || '-'}`;
        row.appendChild(paymentStatusCell);

        // Kolom Aksi
        const actionCell = document.createElement('td');
        const statusButton = document.createElement('button');
        statusButton.className = 'btn btn-warning btn-sm dropdown-toggle';
        statusButton.innerHTML = '<i class="fas fa-edit"></i> Ubah Status';
        statusButton.setAttribute('data-bs-toggle', 'dropdown');
        const dropdownMenu = document.createElement('ul');
        dropdownMenu.className = 'dropdown-menu';

        // Tambahkan opsi status ke dropdown
        const statuses = ['Pending', 'Processing', 'Completed', 'Cancelled'];
        statuses.forEach(status => {
            const dropdownItem = document.createElement('li');
            const dropdownLink = document.createElement('a');
            dropdownLink.className = 'dropdown-item';
            dropdownLink.textContent = status;
            dropdownLink.addEventListener('click', () => updateOrderStatus(order.orderNumber, status));
            dropdownItem.appendChild(dropdownLink);
            dropdownMenu.appendChild(dropdownItem);
        });

        actionCell.appendChild(statusButton);
        actionCell.appendChild(dropdownMenu);
        row.appendChild(actionCell);

        container.appendChild(row);
    });
}

// Fungsi untuk memperbarui status pesanan
function updateOrderStatus(orderNumber, newStatus) {
    const updateUrl = `${API_URL}/${orderNumber}/status`; // Endpoint untuk update status
    fetch(updateUrl, {
        method: 'PUT',
        headers: {
            'login': token,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
    })
        .then(response => response.json())
        .then(response => {
            if (response.status === "success") {
                alert(`Status pesanan ${orderNumber} berhasil diubah menjadi ${newStatus}.`);
                location.reload(); // Muat ulang halaman untuk memperbarui data
            } else {
                console.error(`Error: ${response.status}`);
                alert("Gagal memperbarui status. Silakan coba lagi.");
            }
        })
        .catch(error => {
            console.error("Error updating status: ", error);
            alert("Terjadi kesalahan saat memperbarui status pesanan.");
        });
}
