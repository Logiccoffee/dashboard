import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
// import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
// Mengimpor modul eksternal
import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import { setInner } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import { redirect } from "https://cdn.jsdelivr.net/gh/jscroot/url@0.0.9/croot.js";
import {deleteCookie} from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import { postJSON } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.4/api.js";

// Fungsi untuk mengecek status login
function checkLoginStatus() {
    const loginToken = getCookie("login");
    
    // Jika tidak ada cookie login, arahkan ke halaman login
    if (!loginToken) {
        window.location.href = "https://logiccoffee.id.biz.id/login"; // Ganti dengan URL halaman login
    } else {
        console.log("Pengguna sudah login");
        // Lanjutkan untuk menampilkan data pengguna jika diperlukan
    }
}

// Panggil fungsi checkLoginStatus() di awal
checkLoginStatus();

// Cek apakah cookie login ada, jika tidak arahkan ke halaman utama
if (getCookie("login") === "") {
    console.log("Cookie login tidak ditemukan. Mengarahkan ke halaman utama.");
    redirect("/");
}

// Ambil data pengguna menggunakan API
getJSON("https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/user", "login", getCookie("login"), responseFunction);

// Fungsi untuk menangani respons API
function responseFunction(result) {
    try {
        if (result.status === 404) {
            console.log("Pengguna tidak ditemukan. Mengarahkan ke halaman pendaftaran.");
            setInner("content", "Silahkan lakukan pendaftaran terlebih dahulu.");
            redirect("/register");
            return; // Menghentikan eksekusi setelah redirect
        }

        // Menampilkan nama pengguna dan peran pengguna di elemen yang telah disediakan
        const userNameElement = document.getElementById("user-name");
        const userRoleElement = document.getElementById("user-role");

        if (userNameElement && userRoleElement) {
            userNameElement.textContent = result.data.name || "Nama Tidak Diketahui";
            userRoleElement.textContent = result.data.role || "Peran Tidak Diketahui";
        }

        console.log("Data pengguna:", result.data);
    } catch (error) {
        console.error("Terjadi kesalahan saat memproses respons:", error.message);
        setInner("content", "Terjadi kesalahan saat memproses data.");
    }
}

// Fungsi logout
function logout(event) {
    event.preventDefault(); // Mencegah perilaku default link
  
    // Hapus cookie dengan nama "login"
    deleteCookie("login");
  
    // Cek apakah cookie berhasil dihapus
    if (document.cookie.indexOf("login=") === -1) {
        console.log("Cookie 'login' berhasil dihapus. Mengarahkan ke halaman utama.");
        redirect("/");
    } else {
        console.error("Cookie 'login' gagal dihapus.");
    }
  }
  
  // Menjalankan logout saat tombol diklik
  document.addEventListener("DOMContentLoaded", function () {
    const logoutButton = document.querySelector(".logout-btn");
    if (logoutButton) {
        logoutButton.addEventListener("click", logout);
    } else {
        console.error("Tombol logout tidak ditemukan.");
    }
  });






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
let total = order.total ? order.total : 0; // Jika order.total tidak ada, set ke 0

// Format angka dengan pemisah ribuan
let formattedTotal = total.toLocaleString('id-ID');

// Pastikan hanya satu "Rp" yang ditambahkan
totalPriceCell.textContent = total !== 0
    ? ` ${formattedTotal}` // Menambahkan "Rp" hanya sekali
    : '-'; // Jika kosong atau tidak valid, tampilkan "-"

row.appendChild(totalPriceCell);


        
// Kolom Metode Pembayaran & Status
const paymentStatusCell = document.createElement('td');
paymentStatusCell.textContent = `${order.payment_method || '-'} - ${order.status || '-'}`;
row.appendChild(paymentStatusCell);

// Kolom aksi
const actionCell = document.createElement('td');

// Tombol Status (dengan ikon ubah/edit)
const statusButton = document.createElement('button');
statusButton.className = 'btn btn-warning btn-sm';
statusButton.innerHTML = '<i class="fas fa-edit"></i> Status';
statusButton.addEventListener('click', () => {
    // Dropdown status
    const statusDropdown = document.createElement('select');
    statusDropdown.className = 'form-control form-control-sm';
    const statusOptions = ['diproses', 'terkirim', 'selesai', 'dibatalkan'];
    statusOptions.forEach(status => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = status;
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

        // Validasi status sebelum mengirimkan permintaan ke backend
        if (selectedStatus === "dibatalkan" && order.status !== "terkirim") {
            alert(`Pesanan tidak dapat dibatalkan karena status saat ini adalah: ${order.status}`);
            statusDropdown.replaceWith(statusButton); // Kembalikan ke tombol semula
            return;
        }

        // Kirim data perubahan status ke server
        fetch(`https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/order/${order.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'login': token,
            },
            body: JSON.stringify({
                status: selectedStatus,
            }),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data); // Log data dari server
                if (data.status === 'success') {
                    // Update status di objek lokal dan kolom status pada tabel
                    order.status = selectedStatus; // Perbarui status di objek lokal
                    paymentStatusCell.textContent = `${order.payment_method || '-'} - ${order.status}`; // Update status di kolom

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
                // Kembalikan dropdown ke tombol setelah perubahan
                statusDropdown.replaceWith(statusButton);
            });
    });

    // Jika pengguna ingin membatalkan perubahan, cukup klik di luar dropdown
    document.addEventListener('click', function handleOutsideClick(event) {
        if (!statusDropdown.contains(event.target) && event.target !== statusButton) {
            statusDropdown.replaceWith(statusButton);
            document.removeEventListener('click', handleOutsideClick);
        }
    });
});

actionCell.appendChild(statusButton);
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