import { getJSON, postJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import { putJSON } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.3/api.js";

// Array untuk menyimpan data menu
let menus = [];
let currentEditIndex = null; // Untuk menyimpan index menu yang sedang diedit
let currentDeleteIndex = null; // Untuk menyimpan index menu yang akan dihapus
let categories = []; //untuk menyimpan data kategori

// Ambil token dari cookie dengan nama 'login'
const token = getCookie('login');
if (!token) {
    alert('Token tidak ditemukan, harap login terlebih dahulu!');
    throw new Error("Token tidak ditemukan. Harap login ulang.");
}

// Panggil getJSON untuk mengambil data menu
getJSON('https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/menu', "Login", token, (response) => {
    console.log("Respons API menu:", response); // Debugging
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
    const container = document.getElementById('productList');

    // Pastikan elemen container ditemukan
    if (!container) {
        console.error("Elemen dengan id 'productList' tidak ditemukan.");
        return;
    }

    // Bersihkan tampilan sebelumnya
    container.innerHTML = '';

    const githubBaseUrl = 'https://raw.githubusercontent.com/Logiccoffee/img/main/menuImages/';
    const defaultImage = 'https://example.com/path/to/default-image.jpg'; // URL gambar default dari sumber eksternal

    menuData.forEach((item, index) => {
        const category = categories.find(cat => cat.id === item.category_id);
        const categoryName = category ? category.name : 'Tidak ada kategori';

        // Memastikan gambar valid dan mengonversi GitHub blob ke raw URL jika perlu
        let menuImage = item.image && item.image.trim() !== "" && item.image.toLowerCase() !== "null"
            ? (item.image.startsWith('http')
                ? item.image
                : `${githubBaseUrl}${item.image}`)
            : '';

        if (menuImage.includes('github.com') && menuImage.includes('/blob/')) {
            menuImage = menuImage.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
        }

        // Jika gambar tidak valid, gunakan gambar default
        const imageSrc = menuImage ? menuImage : defaultImage;

        console.log("Gambar digunakan:", imageSrc); // Debugging: Cek URL gambar

        // Membuat card untuk setiap menu
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4';
        card.setAttribute('data-index', index); // Tambahkan data-index
        card.setAttribute('data-name', item.name || '');
        card.setAttribute('data-category', item.category_id || '');
        card.setAttribute('data-price', item.price || '');
        card.setAttribute('data-description', item.description || '');
        card.setAttribute('data-status', item.status || '');
        card.setAttribute('data-image', imageSrc);

        // Bagian deskripsi hanya ditambahkan jika ada
        const descriptionHtml = item.description
            ? `<p class="card-text">Deskripsi: ${item.description}</p>`
            : '';
        card.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${menuImage}" class="card-img-top" alt="${item.name}" style="height: 200px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    ${descriptionHtml} <!-- Tambahkan deskripsi hanya jika ada -->
                    <p class="card-text">Kategori: ${categoryName}</p>
                    <p class="card-text">Harga: ${item.price}</p>
                    <p class="card-text">Status: ${item.status || 'Tidak Tersedia'}</p>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
    // Tambahkan event listener untuk tombol "Ubah" setelah menu ditampilkan
    const editButtons = document.querySelectorAll('.btn-edit');
    editButtons.forEach(button => {
        button.addEventListener('click', function () {
            const menuId = button.getAttribute('data-id'); // Ambil ID menu
            openEditMenuPopup(menuId);
        });
    });
}

// Fungsi untuk mendapatkan nilai cookie berdasarkan nama
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null; // Jika cookie tidak ditemukan
}

// Fungsi untuk menampilkan kategori dalam dropdown
function displayCategories(categories) {
    const categorySelect = document.getElementById('productCategory');
    if (!categorySelect) {
        console.error("Elemen dengan id 'productCategory' tidak ditemukan.");
        return;
    }

    if (!Array.isArray(categories)) {
        console.error("Data kategori yang diterima bukan array.");
        return;
    }

    // Mengosongkan kategori yang ada sebelumnya
    categorySelect.innerHTML = '<option value="">Pilih Kategori</option>';

    categories.forEach(category => {
        if (category.name) {
            const option = document.createElement('option');
            option.value = category.id; // id sebagai value
            option.textContent = category.name; // Menampilkan nama kategori
            categorySelect.appendChild(option);
        } else {
            console.warn("Kategori tanpa properti 'name':", category);
        }
    });
}

// Fungsi untuk mengambil kategori dari API
function loadCategories() {
    getJSON('https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/category', "Login", token, (response) => {
        console.log("Respons kategori:", response);  // Debugging untuk memastikan respons API

        // Tambahkan kode pengecekan di sini
        if (response.status === 200 && Array.isArray(response.data.data)) {
            categories = response.data.data;
            displayCategories(categories); // Pastikan kategori yang ditampilkan adalah array
        } else {
            console.error("Kategori gagal dimuat. Menggunakan kategori default.");
            categories = [{ id: 'default', name: 'Umum' }];
            displayCategories(categories); // Tampilkan kategori default
        }
    });
}

// Array untuk menyimpan data status (Tersedia / Tidak Tersedia / Habis)
const statuses = ['Tersedia', 'Tidak Tersedia', 'Habis'];

// Fungsi untuk menampilkan status dalam dropdown
function displayStatuses() {
    const statusSelect = document.getElementById('product-status');
    if (!statusSelect) {
        console.error("Elemen dengan id 'product-status' tidak ditemukan.");
        return;
    }

    // Mengosongkan status yang ada sebelumnya
    statusSelect.innerHTML = '<option value="">Pilih Status</option>';

    // Loop untuk menambahkan pilihan status ke dropdown
    statuses.forEach(status => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = status;
        statusSelect.appendChild(option);
    });

    // Log untuk debugging
    console.log("Dropdown status berhasil diisi:", statuses);
}

// Panggil fungsi displayStatuses saat modal dibuka
document.getElementById('addProductModal').addEventListener('show.bs.modal', function () {
    console.log("Modal terbuka, memuat status...");
    displayStatuses(); // Memuat status saat modal dibuka
    loadCategories(); // Memuat kategori saat modal dibuka
});

// Fungsi untuk menambah menu
function addMenu(event) {
    event.preventDefault(); // Mencegah form submit biasa agar bisa menggunakan JavaScript

    const menuName = document.getElementById('product-name').value.trim();
    const menuCategory = document.getElementById('productCategory').value.trim();
    const menuPrice = document.getElementById('product-price').value.trim();
    const menuDescription = document.getElementById('product-description').value.trim();
    const menuStatus = document.getElementById('product-status').value.trim(); // Ambil status
    console.log("Status yang dipilih:", menuStatus);
    const menuImageInput = document.getElementById('product-image');
    if (!menuImageInput || !menuImageInput.files || menuImageInput.files.length === 0) {
        alert('Harap unggah file gambar!');
        return false;
    }
    const menuImage = menuImageInput.files[0];

    // Validasi input menu
    if (!menuName || !menuCategory || !menuPrice || !menuImage || !menuStatus) {
        alert('Semua data menu harus diisi, kecuali deskripsi!');
        return;
    }

    // Validasi gambar
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(menuImage.type)) {
        alert('Format file tidak didukung. Harap unggah gambar dengan format JPG, PNG, atau GIF.');
        return;
    }

    if (menuStatus === '') {
        alert('Harap pilih status untuk menu!');
        return false;
    }

    // Konversi harga ke float
    const price = parseFloat(menuPrice.replace(/\./g, '').replace(',', '.'));

    // Validasi apakah harga sudah valid
    if (isNaN(price) || price <= 0) {
        alert('Harga harus berupa angka positif!');
        return false;
    }

    // Kirim menu untuk ditambahkan
    submitAddMenu(menuName, menuCategory, price, menuDescription, menuStatus, menuImage);

    // Cek apakah kategori ada, jika tidak, tambahkan kategori baru
    if (!categories.some(category => category.id === menuCategory)) {
        // Jika kategori tidak ada, tambahkan kategori baru melalui API (misalnya, 'postJSON')
        postJSON('https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/category', 'Login', token, { name: menuCategory }, function (response) {
            if (response.status === 200) {
                alert('Kategori baru berhasil ditambahkan!');
                // Reload kategori
                loadCategories();
                // Lanjutkan untuk menambahkan menu
                submitAddMenu(menuName, menuCategory, price, menuDescription, menuStatus, menuImage);
            } else {
                alert('Gagal menambah kategori baru!');
            }
        });
    }
}

// Fungsi untuk mengirim menu baru ke API
function submitAddMenu(menuName, menuCategory, price, menuDescription, menuStatus, menuImage) {
    // Gunakan FormData untuk mengirim data termasuk file gambar
    const formData = new FormData();
    formData.append('name', menuName);
    formData.append('category_id', menuCategory); // Kirim ID kategori, bukan nama
    formData.append('description', menuDescription); // Sertakan deskripsi
    formData.append('price', price);
    formData.append('status', menuStatus);
    formData.append('image', menuImage); // Tambahkan gambar langsung tanpa konversi

    console.log('Menu yang akan ditambahkan (FormData):', Array.from(formData.entries()));

    // Memanggil fungsi postJSON dari library untuk mengirimkan data menu ke API
    postJSON('https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/menu',        // URL API
        'login',       // Nama header untuk token
        token,         // Nilai token dari cookie
        formData,       // Data menu dalam bentuk JSON
        function (response) {
            if (response.status >= 200 && response.status < 300) {
                alert('Menu berhasil ditambahkan!');
                // Ambil data terbaru setelah sukses
                getJSON('https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/menu', "Login", token, (response) => {
                    if (response.status === 200) {
                        menus = response.data.data || []; // Update data menu
                        displayMenus(response); // Tampilkan menu terbaru
                    } else {
                        console.error('Gagal memuat menu:', response);
                    }
                });

                // Mengosongkan input form
                document.getElementById('product-name').value = '';
                document.getElementById('productCategory').value = '';
                document.getElementById('product-description').value = '';
                document.getElementById('product-price').value = '';
                document.getElementById('product-image').value = '';
                document.getElementById('product-status').value = ''; // Mengosongkan status
            } else {
                alert(`Gagal menambah menu: ${response.message || 'Coba lagi.'}`);
            }
        }
    );
}

// Memastikan DOM selesai dimuat
document.addEventListener('DOMContentLoaded', function () {
    // Ambil token dari cookie dengan nama 'login'
    const token = getCookie('login');
    if (!token) {
        alert('Token tidak ditemukan, harap login terlebih dahulu!');
        throw new Error("Token tidak ditemukan. Harap login ulang.");
    }

    // Panggil getJSON untuk mengambil data menu setelah token valid
    getJSON('https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/menu', "Login", token, (response) => {
        if (response.status === 200) {
            menus = response.data.data || []; // Menyimpan data menu yang ada
            displayMenus(response); // Menampilkan data menu yang diambil
        } else {
            console.error(`Error: ${response.status}`);
            alert("Gagal memuat data menu. Silakan coba lagi.");
        }
    });

    // Fungsi untuk menampilkan kategori saat halaman dimuat
    loadCategories();

    // Menambahkan event listener untuk form submit
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', addMenu);
    }
});

// Membuka popup form edit menu
function openEditMenuPopup(menuId) {
    const editModal = document.getElementById('editProductModal');

    // Pastikan modal sudah ada di DOM
    if (!editModal) {
        console.error("Modal untuk edit produk tidak ditemukan.");
        return;
    }

    // Isi input hidden dengan ID menu
    document.getElementById('edit-product-id').value = menuId;

    // Tampilkan modal
    const bootstrapModal = new bootstrap.Modal(editModal);
    bootstrapModal.show();

    getJSON(`https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/menu/${menuId}`, "login", token, function (response) {
        console.log("Response dari API:", response);
        if (response.status === 200) {
            const menu = response.data; // Data menu dari API

            console.log('Menu Data:', menu); // Log untuk cek data menu yang diambil

            // Isi form dengan data menu yang diambil
            document.getElementById('edit-product-name').value = menu.name || '';
            document.getElementById('edit-product-category').value = menu.category_id || '';
            document.getElementById('edit-product-description').value = menu.description || '';
            document.getElementById('edit-product-price').value = menu.price || '';
            document.getElementById('edit-product-status').value = menu.status || 'Tidak Tersedia';
        } else {
            alert('Gagal memuat data menu untuk diedit.');
        }
    });
}

// Fungsi untuk menyimpan perubahan menu
function saveMenuEdits(event) {
    event.preventDefault(); // Mencegah reload halaman

    const menuId = document.getElementById('edit-product-id').value.trim();
    if (!menuId) {
        alert('ID menu tidak ditemukan!');
        return;
    }

    const menuName = document.getElementById('edit-product-name').value.trim();
    const menuCategory = document.getElementById('edit-product-category').value.trim();
    const menuPrice = document.getElementById('edit-product-price').value.trim();
    const menuDescription = document.getElementById('edit-product-description').value.trim();
    const menuStatus = document.getElementById('edit-product-status').value.trim();

    // Validasi input
    if (!menuName || !menuCategory || !menuPrice || !menuStatus) {
        alert('Semua data menu harus diisi!');
        return;
    }

    const price = parseFloat(menuPrice.replace(/\./g, '').replace(',', '.'));
    if (isNaN(price) || price <= 0) {
        alert('Harga harus berupa angka positif!');
        return;
    }

    const updatedMenu = {
        name: menuName,
        category_id: menuCategory,
        price: price,
        description: menuDescription,
        status: menuStatus,
    };

    // Kirim data ke API untuk diperbarui
    putJSON(`https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/menu/${menuId}`, 'login', token, updatedMenu, function (response) {
        if (response.status >= 200 && response.status < 300) {
            alert('Menu berhasil diperbarui!');
            // Refresh data setelah sukses
            loadMenus();
            // Tutup popup
            document.getElementById('editProductModal').classList.remove('show');
        } else {
            alert(`Gagal memperbarui menu: ${response.message || 'Coba lagi.'}`);
        }
    });
}

// Fungsi untuk memuat ulang menu setelah edit
function loadMenus() {
    getJSON('https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/menu', 'login', token, function (response) {
        if (response.status === 200) {
            menus = response.data.data || []; // Perbarui daftar menu
            displayMenus(menus); // Tampilkan menu terbaru
        } else {
            console.error('Gagal memuat menu:', response);
        }
    });
}

