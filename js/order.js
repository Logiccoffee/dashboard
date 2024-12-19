import { getJSON, postJSON, putJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";

// URL API
const API_URL = "https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/orders";

// Ambil token dari cookie dengan nama 'login'
const token = getCookie('login');
if (!token) {
    alert('Token tidak ditemukan, harap login terlebih dahulu!');
    throw new Error("Token tidak ditemukan. Harap login ulang.");
}

// Ambil data pesanan menggunakan getJSON() dari jscroot
getJSON(API_URL, {
    headers: {
        'login': token,
        'Content-Type': 'application/json',
    }
}).then(response => {
    if (response.status === "success") {
        const orders = response.data || []; // Pastikan data diakses dengan benar
        displayOrders(orders); // Tampilkan data pesanan
    } else {
        console.error(`Error: ${response.status}`);
        alert("Gagal memuat data pesanan. Silakan coba lagi.");
    }
}).catch(error => {
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

    container.innerHTML = ''; // Hapus data lama jika ada

    orders.forEach((order) => {
        const row = document.createElement('tr');

        // Kolom Identitas
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
        productInfoCell.innerHTML = order.orders?.map(item => `
            ${item.menu_name || 'Tidak Diketahui'} - ${item.quantity} x Rp ${item.price.toLocaleString('id-ID')}
        `).join('<br>') || '-';
        row.appendChild(productInfoCell);

        // Kolom Total Harga
        const totalPriceCell = document.createElement('td');
        totalPriceCell.textContent = order.total ? `Rp ${order.total.toLocaleString('id-ID')}` : '-';
        row.appendChild(totalPriceCell);

        // Kolom Metode Pembayaran & Status
        const paymentStatusCell = document.createElement('td');
        paymentStatusCell.textContent = `${order.payment_method || '-'} - ${order.status || '-'}`;
        row.appendChild(paymentStatusCell);

        // Kolom Aksi
        const actionCell = document.createElement('td');
        const statusButton = document.createElement('button');
        statusButton.className = 'btn btn-warning btn-sm';
        statusButton.innerHTML = '<i class="fas fa-edit"></i> Status';
        statusButton.addEventListener('click', () => handleStatusUpdate(order, statusButton, paymentStatusCell));
        actionCell.appendChild(statusButton);
        row.appendChild(actionCell);

        container.appendChild(row);
    });
}

// Fungsi untuk menangani perubahan status pesanan
function handleStatusUpdate(order, button, paymentStatusCell) {
    const statusDropdown = document.createElement('select');
    statusDropdown.className = 'form-control form-control-sm';
    const statusOptions = ['diproses', 'terkirim', 'selesai', 'dibatalkan'];
    statusOptions.forEach(status => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = status;
        if (status === order.status) option.selected = true;
        statusDropdown.appendChild(option);
    });

    button.replaceWith(statusDropdown);

    statusDropdown.addEventListener('change', () => {
        const selectedStatus = statusDropdown.value;

        if (selectedStatus === "dibatalkan" && order.status !== "terkirim") {
            alert(`Pesanan tidak dapat dibatalkan karena status saat ini adalah: ${order.status}`);
            statusDropdown.replaceWith(button);
            return;
        }

        // Update status menggunakan putJSON() dari jscroot
        putJSON(`https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/order/${order.id}`, {
            headers: {
                'login': token,
                'Content-Type': 'application/json',
            },
            body: {
                status: selectedStatus,
            }
        }).then(data => {
            if (data.status === 'success') {
                order.status = selectedStatus; // Update status lokal
                paymentStatusCell.textContent = `${order.payment_method || '-'} - ${order.status}`;
                alert(`Status pesanan berhasil diubah menjadi: ${selectedStatus}`);
            } else {
                alert(`Gagal memperbarui status: ${data.message}`);
            }
        }).catch(error => {
            console.error("Error updating status:", error);
            alert("Terjadi kesalahan saat memperbarui status.");
        }).finally(() => {
            statusDropdown.replaceWith(button);
        });
    });
}

// Fungsi untuk mendapatkan nilai cookie berdasarkan nama (sudah tersedia di jscroot)
function getCookie(name) {
    return getCookie(name); // Menggunakan jscroot
}
