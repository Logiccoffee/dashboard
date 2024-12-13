import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
// import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";


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

// Kolom aksi
const actionCell = document.createElement('td');

// Tombol Status (dengan ikon ubah/edit)
const statusButton = document.createElement('button');
statusButton.className = 'btn btn-warning btn-sm'; // CSS untuk tombol status
statusButton.innerHTML = '<i class="fas fa-edit"></i> Status'; // Menambahkan ikon "edit" (menggunakan FontAwesome)
statusButton.addEventListener('click', () => {
    // Dropdown status
    const statusDropdown = document.createElement('select');
    statusDropdown.className = 'form-control form-control-sm'; // Tampilan dropdown

    // Pilihan status
    const statusOptions = ['Diproses', 'Terkirim', 'Dibatalkan'];
    statusOptions.forEach(status => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = status;

        // Tandai status yang cocok dengan `order.status` sebagai default
        if (status === order.status) {
            option.selected = true;
        }
        statusDropdown.appendChild(option);
    });

    // Ganti tombol dengan dropdown
    statusButton.replaceWith(statusDropdown);

    // Event listener untuk perubahan status
    statusDropdown.addEventListener('change', () => {
        const selectedStatus = statusDropdown.value;

        // Kirim data perubahan status ke server
        fetch(`https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/order/${order.id}`, {
            method: 'PUT', // Gunakan metode PUT untuk pembaruan
            headers: {
                'Content-Type': 'application/json',
                'login': token, // Tambahkan token autentikasi
            },
            body: JSON.stringify({
                status: selectedStatus,
                updated_by: "kasir1", // Ganti dengan user ID atau nama pengguna
                updated_by_role: "admin", // Role pengguna
                updated_at: new Date().toISOString() // Tanggal dan waktu saat ini
            }),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.message || 'Gagal memperbarui status');
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                alert(`Status pesanan berhasil diubah menjadi: ${selectedStatus}`);
                order.status = selectedStatus; // Perbarui status di objek lokal
                paymentStatusCell.textContent = `${order.payment_method || '-'} - ${order.status}`;
            } else {
                alert(`Gagal memperbarui status: ${data.message}`);
            }
        })
        .catch(error => {
            console.error("Error updating status:", error);
            alert("Terjadi kesalahan saat memperbarui status.");
        })
        .finally(() => {
            // Kembalikan dropdown ke tombol setelah perubahan
            statusDropdown.replaceWith(statusButton);
        });
    });

    // Jika pengguna ingin membatalkan perubahan, cukup klik di luar dropdown
    document.addEventListener('click', function handleOutsideClick(event) {
        if (!statusDropdown.contains(event.target)) {
            // Ganti kembali ke tombol status
            statusDropdown.replaceWith(statusButton);
            document.removeEventListener('click', handleOutsideClick);
        }
    });
});

// Kolom untuk menampilkan tombol status
actionCell.appendChild(statusButton);

// Tambahkan baris ke tabel
row.appendChild(actionCell);
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
