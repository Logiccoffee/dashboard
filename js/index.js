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


  // Fungsi untuk menampilkan data pesanan di tabel
function displayOrders(orders) {
    const container = document.getElementById('transaction-list');
    const totalOrdersElement = document.querySelector('.info-box .big'); // Menyasar elemen yang menampilkan jumlah pesanan

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
        let total = order.total ? order.total : 0; // Pastikan order.total adalah angka valid
        let formattedTotal = total.toLocaleString('id-ID');
        totalPriceCell.textContent = total !== 0 ? `Rp ${formattedTotal}` : '-';

        row.appendChild(totalPriceCell);

        // Kolom Metode Pembayaran & Status
        const paymentStatusCell = document.createElement('td');
        paymentStatusCell.textContent = `${order.payment_method || '-'} - ${order.status || '-'}`;
        row.appendChild(paymentStatusCell);

        // Kolom aksi
        const actionCell = document.createElement('td');
        const statusButton = document.createElement('button');
        statusButton.className = 'btn btn-warning btn-sm';
        statusButton.innerHTML = '<i class="fas fa-edit"></i> Status';
        actionCell.appendChild(statusButton);
        row.appendChild(actionCell);

        container.appendChild(row);
    });

    // Hitung jumlah baris yang ada di dalam tabel
    const totalRows = container.getElementsByTagName('tr').length;
    
    // Tampilkan jumlah baris pada elemen info-box
    if (totalOrdersElement) {
        totalOrdersElement.textContent = totalRows; // Menampilkan jumlah baris (jumlah pesanan)
    }
}
