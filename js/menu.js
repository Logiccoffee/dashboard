import { getJSON, postJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import { putJSON, deleteJSON } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.3/api.js";

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

    menuData.forEach((item, index) => {
        // Cari nama kategori berdasarkan category_id
        const category = categories.find(cat => cat.id === item.category_id);
        const categoryName = category ? category.name : 'Tidak ada kategori';

        // Membuat card untuk setiap menu
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4';
        card.setAttribute('data-index', index); // Tambahkan data-index
        card.setAttribute('data-name', item.name || '');
        card.setAttribute('data-category', item.category_id || '');
        card.setAttribute('data-price', item.price || '');
        card.setAttribute('data-description', item.description || '');
        card.setAttribute('data-status', item.status || '');
        card.setAttribute('data-image', item.image || 'path/to/default-image.jpg');

        // Bagian deskripsi hanya ditambahkan jika ada
        const descriptionHtml = item.description
            ? `<p class="card-text">Deskripsi: ${item.description}</p>`
            : '';
        card.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${item.image || 'path/to/default-image.jpg'}" class="card-img-top" alt="${item.name}" style="height: 200px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    ${descriptionHtml} <!-- Tambahkan deskripsi hanya jika ada -->
                    <p class="card-text">Kategori: ${categoryName}</p>
                    <p class="card-text">Harga: ${item.price}</p>
                    <p class="card-text">Status: ${item.status || 'Tidak Tersedia'}</p>
                </div>
                <div class="card-footer text-center">
                    <button class="btn btn-warning btn-edit" data-index="${index}">
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
    // Tambahkan event listener untuk tombol "Ubah" setelah menu ditampilkan
    const editButtons = document.querySelectorAll('.btn-edit');
    editButtons.forEach(button => {
        button.addEventListener('click', function () {
            const index = button.getAttribute('data-index');
            openEditMenuPopup(index);
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

// Array untuk menyimpan data status (Tersedia / Tidak Tersedia)
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
    // Konversi gambar ke Base64 jika diperlukan oleh API
    const reader = new FileReader();
    reader.onload = function () {
        const imageData = reader.result; // Data Base64 dari gambar
        console.log('Gambar dalam format Base64:', imageData);

        const menuData = {
            name: menuName,
            category_id: menuCategory, // Kirim ID kategori, bukan nama
            description: menuDescription, // Sertakan deskripsi
            price: price,
            status: menuStatus,
            image: imageData // Sertakan data gambar dalam Base64
        };

        console.log('Menu yang akan ditambahkan:', menuData);

        // Memanggil fungsi postJSON dari library untuk mengirimkan data menu ke API
        postJSON('https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/menu',        // URL API
            'login',       // Nama header untuk token
            token,         // Nilai token dari cookie
            menuData,       // Data menu dalam bentuk JSON
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
                    document.getElementById('product-status').value = '';  // Mengosongkan status
                } else {
                    alert(`Gagal menambah menu: ${response.message || 'Coba lagi.'}`);
                }
            }
        );
    };
    // Membaca file gambar sebagai Base64
    reader.readAsDataURL(menuImage);
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

// Ambil semua tombol "Ubah" dari setiap card
const editButtons = document.querySelectorAll(".edit-button");

editButtons.forEach((button) => {
    button.addEventListener("click", () => {
        // Ambil card terkait tempat tombol "Ubah" ditekan
        const card = button.closest(".card");

        // Pastikan card ditemukan
        if (!card) {
            console.error("Card tidak ditemukan.");
            return;
        }

        // Ambil data dari card (pastikan selector sesuai dengan struktur HTML)
        const productName = card.querySelector(".product-name")?.textContent.trim() || '';
        const productPrice = card.querySelector(".product-price")?.textContent.trim() || '';
        const productDescription = card.querySelector(".product-description")?.textContent.trim() || '';
        const productCategory = card.getAttribute("data-category") || ''; // Ambil data kategori
        const productImage = card.querySelector(".product-image")?.src || ''; // Ambil URL gambar
        const productStatus = card.getAttribute("data-status") || ''; // Ambil data status

        // Periksa apakah elemen-elemen ini ada
        if (!productName || !productPrice || !productDescription) {
            console.error("Beberapa data tidak ditemukan pada card.");
            return;
        }

        // Isi data ke dalam form edit modal
        document.getElementById("edit-product-name").value = productName;
        document.getElementById("edit-product-price").value = productPrice;
        document.getElementById("edit-product-description").value = productDescription;
        document.getElementById("edit-product-category").value = productCategory;
        document.getElementById("edit-product-image").src = productImage; // Masukkan gambar
        document.getElementById("edit-product-status").value = productStatus;

        // Tampilkan modal edit
        const editProductModal = new bootstrap.Modal(document.getElementById('editProductModal'));
        editProductModal.show();

        // Set kategori dan status jika ada
        if (productCategory) {
            document.getElementById("edit-product-category").value = productCategory;
        }
        if (productStatus) {
            document.getElementById("product-status").value = productStatus;
        }
    });
});

// Form submit logic untuk menyimpan perubahan
document.getElementById("editProductForm").addEventListener("submit", function (event) {
    event.preventDefault();  // Mencegah halaman reload

    // Ambil nilai yang diubah dari form
    const updatedProductName = document.getElementById("edit-product-name").value;
    const updatedProductPrice = document.getElementById("edit-product-price").value;
    const updatedProductDescription = document.getElementById("edit-product-description").value;
    const updatedProductCategory = document.getElementById("edit-product-category").value;
    const updatedProductStatus = document.getElementById("edit-product-status").value;

    // Proses pembaruan data (misalnya mengirim data ke server, atau memperbarui elemen card)
    console.log("Data yang diperbarui:", {
        updatedProductName,
        updatedProductPrice,
        updatedProductDescription,
        updatedProductCategory,
        updatedProductStatus
    });

    // Jika perlu, kirim data ke server atau lakukan update pada DOM
    alert("Perubahan berhasil disimpan!");
});

function openEditMenuPopup(index) {
    // Pastikan index valid
    if (index === undefined || index === null) {
        console.error("Index menu tidak valid.");
        return;
    }

    // Mengisi data menu yang akan diedit ke dalam modal
    const menu = menus[index];
    currentEditIndex = index; // Simpan indeks menu yang sedang diedit

    // Isi field di dalam modal dengan data menu
    document.getElementById('edit-product-name').value = menu.name || '';
    document.getElementById('edit-product-price').value = menu.price || '';
    document.getElementById('edit-product-description').value = menu.description || '';
    document.getElementById('edit-product-image').value = ''; // Kosongkan karena input file tidak dapat diisi secara program
    document.getElementById('edit-product-status').value = menu.status || '';

    // Isi dropdown kategori
    const categoryDropdown = document.getElementById('edit-product-category');
    categoryDropdown.innerHTML = '<option value="" disabled>Pilih Kategori</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        if (category.id === menu.category_id) {
            option.selected = true;
        }
        categoryDropdown.appendChild(option);
    });

    // Tampilkan modal
    const editModal = new bootstrap.Modal(document.getElementById('editProductModal'));
    editModal.show();
}

// Fungsi untuk menyimpan perubahan setelah diedit
document.getElementById('editProductForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Ambil data dari form
    const updatedMenu = {
        name: document.getElementById('edit-product-name').value,
        price: parseFloat(document.getElementById('edit-product-price').value),
        description: document.getElementById('edit-product-description').value,
        image: document.getElementById('edit-product-image').files[0], // Ambil file gambar
        status: document.getElementById('edit-product-status').value,
        category_id: document.getElementById('edit-product-category').value,
    };

    // Validasi data
    if (!updatedMenu.name || !updatedMenu.price || !updatedMenu.status || !updatedMenu.category_id) {
        alert('Harap lengkapi semua field yang wajib diisi.');
        return;
    }

    // Buat form data untuk upload gambar (jika ada)
    const formData = new FormData();
    formData.append('name', updatedMenu.name);
    formData.append('price', updatedMenu.price);
    formData.append('description', updatedMenu.description);
    if (updatedMenu.image) {
        formData.append('image', updatedMenu.image);
    }
    formData.append('status', updatedMenu.status);
    formData.append('category_id', updatedMenu.category_id);

    // Kirim request ke API untuk memperbarui menu
    const menuId = menus[currentEditIndex].id; // ID menu yang diedit
    putJSON(`https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/menu/${menuId}`, formData, token, (response) => {
        if (response.status === 200) {
            alert('Menu berhasil diperbarui!');
            // Perbarui data di array menus
            menus[currentEditIndex] = { ...menus[currentEditIndex], ...updatedMenu };
            displayMenus({ data: { data: menus } }); // Refresh tampilan menu
            const editModal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
            editModal.hide(); // Tutup modal
        } else {
            console.error(`Gagal memperbarui menu: ${response.message}`);
            alert('Gagal memperbarui menu. Silakan coba lagi.');
        }
    });
});
