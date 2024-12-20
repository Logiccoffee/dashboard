import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
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
        if (response.status === "success") {
            const orders = response.data || [];
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
    if (!container) {
        console.error("Elemen dengan ID 'transaction-list' tidak ditemukan.");
        return;
    }

    container.innerHTML = ''; // Bersihkan kontainer sebelum render

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

        // Kolom Produk (Nama Produk, Jumlah, dan Harga Satuan)
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
        const total = order.total ? order.total : 0;
        totalPriceCell.textContent = total !== 0 ? `Rp ${total.toLocaleString('id-ID')}` : '-';
        row.appendChild(totalPriceCell);

        // Kolom Metode Pembayaran & Status
        const paymentStatusCell = document.createElement('td');
        paymentStatusCell.textContent = `${order.payment_method || '-'} - ${order.status || '-'}`;
        row.appendChild(paymentStatusCell);

        // Kolom Aksi
        const actionCell = document.createElement('td');

        // Tombol Status (dengan dropdown)
        const statusButton = document.createElement('button');
        statusButton.className = 'btn btn-warning btn-sm';
        statusButton.innerHTML = '<i class="fas fa-edit"></i> Status';
        statusButton.addEventListener('click', () => {
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

            statusButton.replaceWith(statusDropdown);

            statusDropdown.addEventListener('change', () => {
                const selectedStatus = statusDropdown.value;
                if (selectedStatus === "dibatalkan" && order.status !== "terkirim") {
                    alert(`Pesanan tidak dapat dibatalkan karena status saat ini adalah: ${order.status}`);
                    statusDropdown.replaceWith(statusButton);
                    return;
                }

                fetch(`https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/order/${order.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'login': token,
                    },
                    body: JSON.stringify({ status: selectedStatus }),
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'success') {
                            order.status = selectedStatus;
                            paymentStatusCell.textContent = `${order.payment_method || '-'} - ${order.status}`;
                            alert(`Status pesanan berhasil diubah menjadi: ${selectedStatus}`);
                        } else {
                            alert(`Gagal memperbarui status: ${data.message}`);
                        }
                    })
                    .catch(error => {
                        console.error("Error updating status:", error);
                        alert("Terjadi kesalahan saat memperbarui status.");
                    })
                    .finally(() => {
                        statusDropdown.replaceWith(statusButton);
                    });
            });
        });

        actionCell.appendChild(statusButton);
        row.appendChild(actionCell);

        container.appendChild(row);
    });
}
