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

                // Kolom Produk (Nama Produk, Jumlah dan Harga Satuan)
        const productInfoCell = document.createElement('td');

        // Cek apakah ada data dalam order.orders
        if (order.orders && order.orders.length > 0) {
            // Gabungkan Nama Produk, Kuantitas dan Harga Satuan dalam satu kolom
            productInfoCell.innerHTML = order.orders.map(item => {
                return `${item.menu_name || 'Tidak Diketahui'} - ${item.quantity} x Rp ${item.price.toLocaleString('id-ID')}`;
            }).join('<br>'); // Menggunakan <br> untuk memisahkan tiap item dalam baris baru
        } else {
            productInfoCell.textContent = '-'; // Tampilkan '-' jika tidak ada data
        }

            row.appendChild(productInfoCell)



      // Kolom Harga Total
const totalPriceCell = document.createElement('td');

// Pastikan order.total adalah angka valid
let total = order.total ? order.total.toString().replace(/[^\d]/g, '') : '-'; // Hanya angka
totalPriceCell.textContent = total !== '-' 
    ? ` ${parseInt(total, 10).toLocaleString('id-ID')}` // Tambahkan kembali "Rp" jika valid
    : '-'; // Jika kosong, tampilkan "-"

row.appendChild(totalPriceCell);

        

row.appendChild(totalPriceCell);


        

        // Kolom Metode Pembayaran & Status
        const paymentStatusCell = document.createElement('td');
        paymentStatusCell.textContent = `${order.payment_method || '-'} - ${order.status || '-'}`;
        row.appendChild(paymentStatusCell);



         // Membuat kolom aksi untuk tabel
const actionCell = document.createElement('td');

// Tombol Status (dengan ikon ubah/edit)
const statusButton = document.createElement('button');
statusButton.className = 'btn btn-warning btn-sm'; // CSS untuk tombol status
statusButton.innerHTML = '<i class="fas fa-edit"></i> Status'; // Menambahkan ikon "edit" (menggunakan FontAwesome)

// Event Listener untuk Tombol Status
statusButton.addEventListener('click', () => {
    // Membuat dropdown untuk pilihan status
    const statusDropdown = document.createElement('select');
    statusDropdown.className = 'form-control form-control-sm'; // Tampilan dropdown

    // Pilihan status
    const statusOptions = ['Diproses', 'Selesai'];
    statusOptions.forEach(status => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = status;
        if (order.status === status) option.selected = true; // Set default value sesuai data order
        statusDropdown.appendChild(option);
    });

    // Ganti tombol dengan dropdown
    statusButton.replaceWith(statusDropdown);

    // Event Listener untuk Dropdown
    statusDropdown.addEventListener('change', () => {
        const selectedStatus = statusDropdown.value;

        // Update status di objek order
        order.status = selectedStatus;

        // Kirim perubahan ke server (contoh menggunakan fetch)
        fetch(`/api/update-order-status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: order.id, // Kirim ID order
                status: selectedStatus, // Kirim status yang baru
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(`Status pesanan berhasil diubah menjadi: ${selectedStatus}`);
                } else {
                    alert(`Gagal mengubah status: ${data.message}`);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Terjadi kesalahan saat mengubah status.');
            });

        // Ganti kembali dropdown dengan tombol status
        statusDropdown.replaceWith(statusButton);
    });
});

// Tambahkan tombol ke kolom aksi
actionCell.appendChild(statusButton);

// Tambahkan kolom aksi ke baris
row.appendChild(actionCell);
    });
}

// Fungsi untuk mendapatkan nilai cookie berdasarkan nama
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null; // Jika cookie tidak ditemukan
}
