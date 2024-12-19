import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import { putJSON } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.3/api.js";

// Array untuk menyimpan data menu
let menus = [];
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
    // Validasi apakah response.data.data ada dan valid
    if (!response || !response.data || !Array.isArray(response.data.data)) {
        console.error("Data menu tidak valid atau tidak ditemukan.");
        // HAPUS ALERT berikut karena tidak diperlukan lagi:
        // alert("Data menu tidak valid. Silakan hubungi administrator.");
        return;
    }

    const menuData = response.data.data; // Ambil data menu
    menus = menuData
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
        card.setAttribute('data-id', item.id); // Simpan ID menu
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
                    <!-- Tombol Edit dengan background kuning dan ikon edit -->
                    <button class="btn btn-edit" style="background-color: yellow; color: black; border: none; display: flex; align-items: center;" data-id="${item.id}">
                        <i class="fa fa-edit" style="margin-right: 8px;"></i> Edit
                    </button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
    // Tambahkan event listener untuk tombol "Ubah" setelah menu ditampilkan
    const editButtons = document.querySelectorAll('.btn-edit');
    console.log(`Jumlah tombol edit ditemukan: ${editButtons.length}`);
    editButtons.forEach(button => {
        button.addEventListener('click', function () {
            const menuId = button.getAttribute('data-id'); // Ambil ID menu
            openEditMenuPopup(menuId);
        });
    });
}

document.getElementById('productList').addEventListener('click', function (event) {
    if (event.target.closest('.btn-edit')) {
        const button = event.target.closest('.btn-edit');
        const menuId = button.getAttribute('data-id'); // Ambil ID menu
        console.log(`Tombol Edit diklik untuk menu ID: ${menuId}`);
        openEditMenuPopup(menuId);
    }
});

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
const statuses = ['Tersedia', 'Tidak Tersedia'];

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

    // Tambahkan event listener untuk form edit (hanya sekali)
    const editProductForm = document.getElementById('editProductForm');
    if (editProductForm) {
        editProductForm.addEventListener('submit', function (event) {
            const menuId = document.getElementById('edit-product-id').value; // Ambil ID menu
            editMenu(event, menuId); // Panggil fungsi edit menu
        });
    }
});

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
    const menuImageInput = document.getElementById('product-image');
    console.log(menuImageInput); // Debugging: cek apakah input gambar ditemukan

    // Validasi input
    if (!menuName || !menuCategory || !menuPrice || !menuStatus || !menuImageInput.files.length) {
        alert('Semua field wajib diisi!');
        return;
    }

    if (!statuses.includes(menuStatus)) {
        alert('Status tidak valid!');
        return;
    }

    if (!menuImageInput) {
        alert("Input file gambar tidak ditemukan!");
        return;
    }

    if (!menuImageInput.files || menuImageInput.files.length === 0) {
        alert('Tidak ada file gambar yang dipilih!');
        return;
    }

    console.log(menuImageInput.files); // Debugging untuk memastikan files ada

    const menuImage = menuImageInput.files[0];
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(menuImage.type)) {
        alert('Format gambar tidak didukung. Gunakan JPG, PNG, atau GIF.');
        return;
    }

    // Konversi harga ke float
    const price = parseFloat(menuPrice.replace(/\./g, '').replace(',', '.'));

    // Validasi apakah harga sudah valid
    if (isNaN(price) || price <= 0) {
        alert('Harga harus berupa angka positif!');
        return false;
    }

    // Menyiapkan FormData
    const formData = new FormData();
    formData.append('name', menuName);
    formData.append('category_id', menuCategory);
    formData.append('price', price);
    formData.append('description', menuDescription);
    formData.append('status', menuStatus);
    formData.append('menuImage', menuImage);

    // Kirim data ke API
    fetch('https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/menu', {
        method: 'POST',
        headers: {
            'Login': token
        },
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Gagal menghubungi server: ${response.status}`);
            }
            return response.json();
        })
        .then(response => {
            if (response.status === 200 || response.status === 'success') {
                alert('Menu berhasil ditambahkan!');
                const newMenu = response.data;
                menus.push(newMenu);
                displayMenus({ data: { data: menus } });
                document.getElementById('addProductModal').classList.remove('show');
                document.body.classList.remove('modal-open');
                const backdrop = document.querySelector('.modal-backdrop');
                if (backdrop) backdrop.remove();
            } else {
                throw new Error('Gagal menambahkan menu.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error.message || 'Terjadi kesalahan saat memproses permintaan.');
        });
}

// Event listener untuk form submit
document.getElementById('addProductForm').addEventListener('submit', addMenu);

// Panggil fungsi displayStatuses saat modal dibuka
document.getElementById('editProductModal').addEventListener('show.bs.modal', function () {
    console.log("Modal edit terbuka, memuat status...");
    displayStatuses(); // Memuat status saat modal dibuka
    loadCategories(); // Memuat kategori saat modal dibuka
});

// Membuka popup form edit menu
function openEditMenuPopup(menuId) {
    console.log(`Popup edit terbuka untuk menu ID: ${menuId}`);
    const menu = menus.find(item => item.id == menuId); // Cari menu berdasarkan ID

    if (!menu) {
        console.error(`Menu dengan ID ${menuId} tidak ditemukan di data menus.`);
        alert('Menu tidak ditemukan!');
        return;
    }

    // Log data menu untuk memastikan menu ditemukan
    console.log("Data menu:", menu);

    const modalElement = document.getElementById('editProductModal');
    if (!modalElement) {
        console.error("Modal edit tidak ditemukan.");
        return;
    }

    const modal = new bootstrap.Modal(modalElement);

    // Pastikan opsi kategori dan status terisi
    populateDropdown('edit-product-category', categories); // Isi dropdown kategori
    populateDropdown('edit-product-status', ['Tersedia', 'Tidak Tersedia', 'Habis']); // Isi dropdown status

    // Tambahkan event listener untuk mengisi form saat modal terbuka sepenuhnya
    modalElement.addEventListener('shown.bs.modal', function onModalShown() {
        console.log("Modal edit sudah sepenuhnya terbuka, mengisi form...");

        // Mengisi data menu ke dalam form edit
        document.getElementById('edit-product-id').value = menu.id || ''; // ID
        document.getElementById('edit-product-name').value = menu.name;
        document.getElementById('edit-product-category').value = menu.category_id;
        document.getElementById('edit-product-price').value = parsePrice(menu.price);
        document.getElementById('edit-product-description').value = menu.description;
        document.getElementById('edit-product-status').value = menu.status;
        // Menampilkan URL gambar di input teks
        const imageUrl = menu.image; // URL gambar dari data
        const imageUrlInput = document.getElementById('edit-product-image-url');
        if (imageUrl) {
            imageUrlInput.value = imageUrl; // Tampilkan URL gambar
        } else {
            imageUrlInput.value = ''; // Kosongkan jika tidak ada gambar
        }

        // Menyimpan gambar lama sebagai data-old-image
        document.getElementById('edit-product-image').setAttribute('data-old-image', imageUrl);

        // Pastikan event listener ini hanya berjalan sekali
        modalElement.removeEventListener('shown.bs.modal', onModalShown);
    });

    //tampilkan modal
    modal.show();
}

// Fungsi untuk mengonversi harga dari format "Rp 20.000,00" menjadi angka
function parsePrice(priceString) {
    if (!priceString) return '';
    // Hapus simbol mata uang, titik, dan koma
    return parseFloat(priceString.replace(/[^0-9]/g, ''));
}

// Fungsi untuk mengisi dropdown
function populateDropdown(dropdownId, options) {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) return;

    dropdown.innerHTML = options
        .map(option => {
            if (typeof option === 'object') {
                return `<option value="${option.id}">${option.name}</option>`;
            }
            return `<option value="${option}">${option}</option>`;
        })
        .join('');
}

// Fungsi untuk mengedit menu
function editMenu(event, menuId) {
    event.preventDefault(); // Mencegah form submit biasa agar bisa menggunakan JavaScript

    const menuName = document.getElementById('edit-product-name').value.trim();
    const menuCategory = document.getElementById('edit-product-category').value.trim();
    const menuPrice = document.getElementById('edit-product-price').value.trim();
    const menuDescription = document.getElementById('edit-product-description').value.trim();
    const menuStatus = document.getElementById('edit-product-status').value.trim();
    const menuImageInput = document.getElementById('edit-product-image');
    const menuImageUrl = document.getElementById('edit-product-image-url').value.trim();

    // Validasi input
    if (!menuName || !menuCategory || !menuPrice || !menuStatus) {
        alert('Semua field wajib diisi!');
        return;
    }

    // Validasi status
    const statuses = ['tersedia', 'tidak tersedia', 'habis'];
    if (!statuses.includes(menuStatus.toLowerCase())) {
        alert("Status tidak valid! Gunakan 'tersedia', 'tidak tersedia', atau 'habis'.");
        return;
    }

    if (!statuses.includes(menuStatus)) {
        alert('Status tidak valid!');
        return;
    }

    const menuImage = menuImageInput.files[0];
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(menuImage.type)) {
        alert('Format gambar tidak didukung. Gunakan JPG, PNG, atau GIF.');
        return;
    }

    // Konversi harga ke float
    const price = parseFloat(menuPrice.replace(/\./g, '').replace(',', '.'));

    // Validasi apakah harga sudah valid
    if (isNaN(price) || price <= 0) {
        alert('Harga harus berupa angka positif!');
        return false;
    }

    // Menyiapkan FormData
    const formData = new FormData();
    formData.append('name', menuName);
    formData.append('category_id', menuCategory);
    formData.append('price', price);
    formData.append('description', menuDescription);
    formData.append('status', menuStatus);

    if (menuImageInput.files.length > 0) {
        formData.append('menuImage', menuImageInput.files[0]);
    } else if (menuImageUrl) {
        formData.append('image', menuImageUrl);
    } else {
        alert('Harap unggah gambar baru atau gunakan URL gambar lama.');
        return;
    }

    // Kirim data ke API untuk update menu
    fetch(`https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/menu/${menuId}`, {
        method: 'PUT', // Menggunakan PUT untuk update data
        headers: {
            'Login': token
        },
        body: formData
    })
    .then(async (response) => {
        const responseBody = await response.json();
        if (!response.ok) {
            throw new Error(`Gagal: ${response.status} - ${responseBody.message}`);
        }
        alert('Menu berhasil diperbarui!');
        updateMenuInList(responseBody); // Perbarui data di UI
    })
    .catch((error) => {
        console.error('Error:', error);
        alert(error.message || 'Terjadi kesalahan.');
    });
}

// Fungsi untuk memperbarui menu di tampilan
function updateMenuInList(updatedMenu) {
    const menuIndex = menus.findIndex(item => item.id === updatedMenu.id);
    if (menuIndex !== -1) {
        menus[menuIndex] = updatedMenu;
        displayMenus({ data: { data: menus } }); // Update tampilan daftar menu
    }
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
