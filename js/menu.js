import { getJSON, postJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import { putJSON, deleteJSON } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.3/api.js";

// Array untuk menyimpan data menu
let menus = [];
let currentEditIndex = null; // Untuk menyimpan index menu yang sedang diedit
let currentDeleteIndex = null; // Untuk menyimpan index menu yang akan dihapus

// Ambil token dari cookie dengan nama 'login'
const token = getCookie('login');
if (!token) {
    alert('Token tidak ditemukan, harap login terlebih dahulu!');
    throw new Error("Token tidak ditemukan. Harap login ulang.");
}

// Panggil getJSON untuk mengambil data menu
getJSON('https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/menu', "Login", token, (response) => {
    if (response.status === 200) {
        menus = response.data.data || []; // Menyimpan data menu yang ada
        displayMenus(response);
    } else {
        console.error(`Error: ${response.status}`);
        alert("Gagal memuat data menu. Silakan coba lagi.");
    }
});

// Fungsi untuk menampilkan daftar menu dalam bentuk card
function displayMenus(response) {
    // Validasi apakah response.data.data ada
    if (!response || !response.data || !response.data.data) {
        console.error("Data menu tidak ditemukan di respons API.");
        alert("Data menu tidak valid. Silakan hubungi administrator.");
        return;
    }

    const menuData = response.data.data; // Ambil data menu dari respons
    const container = document.getElementById('menu-list');

    // Pastikan elemen container ditemukan
    if (!container) {
        console.error("Elemen dengan id 'menu-list' tidak ditemukan.");
        return;
    }

    // Bersihkan tampilan sebelumnya
    container.innerHTML = '';

    menuData.forEach((item, index) => {
        // Membuat card untuk setiap menu
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4';
        card.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${item.image || 'path/to/default-image.jpg'}" class="card-img-top" alt="${item.name}" style="height: 200px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                </div>
                <div class="card-footer text-center">
                    <button class="btn btn-warning btn-edit" onclick="openEditMenuPopup(${index})">
                        <i class="fas fa-pen"></i> Ubah
                    </button>
                    <button class="btn btn-danger btn-delete" onclick="confirmDelete(${index})">
                        <i class="fas fa-trash-alt"></i> Hapus
                    </button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Fungsi untuk mendapatkan nilai cookie berdasarkan nama
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null; // Jika cookie tidak ditemukan
}

// Fungsi untuk menambah menu
function addMenu(event) {
    event.preventDefault(); // Mencegah form submit biasa agar bisa menggunakan JavaScript

    const menuName = document.getElementById('menu-name').value.trim();

    // Validasi input menu
    if (menuName === '') {
        alert('Nama menu tidak boleh kosong!');
        return false;
    }

    // Membuat objek menu baru
    const newMenu = {
        name: menuName
    };

    // Ambil token dari cookie dengan nama 'login'
    const token = getCookie('login');
    if (!token) {
        alert('Token tidak ditemukan, harap login terlebih dahulu!');
        return;
    }

    // Log untuk memeriksa data yang akan dikirim
    console.log('Menu yang akan ditambahkan:', newMenu);

    // Memanggil fungsi postJSON dari library untuk mengirimkan data menu ke API
    postJSON('https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/menu',        // URL API
        'login',       // Nama header untuk token
        token,         // Nilai token dari cookie
        newMenu,       // Data menu dalam bentuk JSON
        function (response) {
            const { status, data } = response;

            if (status >= 200 && status < 300) {
                console.log('Respons dari API:', data);
                alert('Menu berhasil ditambahkan!');

                // Menutup modal setelah menu ditambahkan
                const modal = bootstrap.Modal.getInstance(document.getElementById('addMenuModal'));
                modal.hide(); // Menutup modal

                // Setelah menu berhasil ditambahkan, ambil data terbaru dari API
                getJSON('https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/menu', "Login", token, (response) => {
                    if (response.status === 200) {
                        menus = response.data.data || []; // Update data menu
                        displayMenus(response); // Tampilkan menu terbaru
                    } else {
                        console.error(`Error: ${response.status}`);
                        alert("Gagal memuat data menu. Silakan coba lagi.");
                    }
                });

                // Mengosongkan input form
                document.getElementById('menu-name').value = '';
            } else {
                console.error('Gagal menambah menu:', data);
                alert('Gagal menambah menu!');
            }
        }
    );
}

// Menunggu hingga DOM selesai dimuat
document.addEventListener('DOMContentLoaded', function () {
    // Menambahkan event listener untuk form submit setelah DOM dimuat sepenuhnya
    document.getElementById(addProductModal).addEventListener('submit', addMenu);
});

// Fungsi untuk menangani submit form saat mengubah menu
document.getElementById('editProductModal').addEventListener('submit', (event) => {
    event.preventDefault(); // Mencegah form submit default

    const updatedMenuName = document.getElementById('edit-menu-name').value.trim(); // Nama menu baru
    if (updatedMenuName === '') {
        alert('Nama menu tidak boleh kosong!');
        return;
    }

    const targetUrl = `${'https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/menu'}/${menus[currentEditIndex].id}`; // Endpoint API dengan ID menu

    // Data yang akan diupdate
    const updatedMenuData = { name: updatedMenuName };

    // Ambil token dari cookie
    const token = getCookie('login');
    if (!token) {
        alert('Token tidak ditemukan, harap login terlebih dahulu!');
        return;
    }

    // Log untuk memeriksa data yang akan dikirim
    console.log('Menu yang akan diubah:', updatedMenuData);

    // Kirim data ke API untuk mengubah menu menggunakan putJSON
    putJSON(targetUrl, 'Login', token, updatedMenuData, function (response) {
        const { status, data } = response;

        if (status >= 200 && status < 300) {
            console.log('Menu berhasil diubah:', data);

            // Perbarui data menu di array setelah berhasil diubah
            menus[currentEditIndex].name = updatedMenuName;

            // Render ulang daftar menu
            displayMenus({ data: { data: menus } }); // Menampilkan data terbaru

            // Tampilkan notifikasi
            alert('Menu berhasil diubah!');

            // Tutup modal edit
            const editMenuModal = bootstrap.Modal.getInstance(document.getElementById('editMenuModal'));
            editMenuModal.hide();
        } else {
            console.error('Gagal mengubah menu:', data);
            alert('Gagal mengubah menu!');
        }
    });
});

// Fungsi untuk menghapus menu
document.getElementById('confirm-delete').addEventListener('click', () => {
    if (currentDeleteIndex === null) return;

    const menuToDelete = menus[currentDeleteIndex];
    const targetUrl = `${'https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/menu'}/${menuToDelete.id}`;

    // Ambil token dari cookie
    const token = getCookie('login');
    if (!token) {
        alert('Token tidak ditemukan, harap login terlebih dahulu!');
        return;
    }

    // Menghapus menu menggunakan deleteJSON
    deleteJSON(targetUrl, 'Login', token, function (response) {
        const { status, data } = response;

        if (status >= 200 && status < 300) {
            console.log('Menu berhasil dihapus:', data);

            // Menghapus menu dari array
            menus.splice(currentDeleteIndex, 1);

            // Render ulang daftar menu
            displayMenus({ data: { data: menus } });

            // Tampilkan notifikasi
            alert('Menu berhasil dihapus!');

            // Tutup modal hapus
            const deleteMenuModal = bootstrap.Modal.getInstance(document.getElementById('deleteMenuModal'));
            deleteMenuModal.hide();
        } else {
            console.error('Gagal menghapus menu:', data);
            alert('Gagal menghapus menu!');
        }
    });
});
