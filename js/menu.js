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
const editButtons = document.querySelectorAll(".edit-button"); // Pastikan tombol memiliki class ini

// Tambahkan event listener ke setiap tombol
editButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
        // Ambil data dari atribut tombol atau elemen card
        const card = button.closest(".card"); // Pastikan tombol ada dalam card
        const productName = card.querySelector(".product-name").textContent;
        const productPrice = card.querySelector(".product-price").textContent;
        const productDescription = card.querySelector(".product-description").textContent;

        // Isi data ke form popup
        document.getElementById("edit-product-name").value = productName.trim();
        document.getElementById("edit-product-price").value = productPrice.trim();
        document.getElementById("edit-product-description").value = productDescription.trim();

        // Jika ada kategori dan status, isi juga (opsional)
        const productCategory = card.getAttribute("data-category");
        const productStatus = card.getAttribute("data-status");

        if (productCategory) {
            document.getElementById("edit-productCategory").value = productCategory;
        }

        if (productStatus) {
            document.getElementById("product-status").value = productStatus;
        }
    });
});


// Fungsi untuk membuka pop-up edit menu
function openEditMenuPopup(index) {
    const menu = menus[index]; // Ambil menu berdasarkan index
    const editForm = document.getElementById('editProductForm'); // Pastikan form edit ada

    if (editForm) {
        // Isi data menu yang ada ke dalam form
        document.getElementById('edit-product-name').value = menu.name;
        document.getElementById('edit-productCategory').value = menu.category_id;
        document.getElementById('edit-product-price').value = menu.price;
        document.getElementById('edit-product-description').value = menu.description;
        document.getElementById('edit-product-status').value = menu.status;

        // Tampilkan modal edit form
        $('#editProductModal').modal('show');
    }
}

// Pastikan fungsi tersedia di global scope
window.openEditMenuPopup = openEditMenuPopup;

// Fungsi untuk menyimpan perubahan pada menu
function saveMenuChanges(event) {
    event.preventDefault(); // Mencegah form submit biasa

    const updatedMenuName = document.getElementById('edit-product-name').value.trim();
    const updatedMenuCategory = document.getElementById('edit-productCategory').value.trim();
    const updatedMenuPrice = document.getElementById('edit-product-price').value.trim();
    const updatedMenuDescription = document.getElementById('edit-product-description').value.trim();
    const updatedMenuStatus = document.getElementById('edit-product-status').value.trim();

    if (!updatedMenuName || !updatedMenuCategory || !updatedMenuPrice) {
        alert('Semua data menu harus diisi!');
        return false;
    }

    // Konversi harga ke float
    const updatedPrice = parseFloat(updatedMenuPrice.replace(/\./g, '').replace(',', '.'));

    if (isNaN(updatedPrice) || updatedPrice <= 0) {
        alert('Harga harus berupa angka positif!');
        return false;
    }

    // Kirim perubahan data menu ke API
    submitEditMenu(updatedMenuName, updatedMenuCategory, updatedPrice, updatedMenuDescription, updatedMenuStatus);
}
// Fungsi untuk mengirim perubahan menu ke API
function submitEditMenu(name, category, price, description, status) {
    const updatedMenu = {
        name: name,
        category_id: category,
        price: price,
        description: description,
        status: status
    };

    // Kirim permintaan PUT ke API untuk memperbarui menu
    postJSON('https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/menu', 'Login', token, updatedMenu, function (response) {
        if (response.status === 200) {
            alert('Menu berhasil diperbarui!');
            // Update data menu setelah perubahan berhasil
            getJSON('https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/menu', 'Login', token, (response) => {
                if (response.status === 200) {
                    menus = response.data.data || [];
                    displayMenus(response); // Tampilkan menu terbaru
                } else {
                    alert('Gagal memuat data menu.');
                }
            });
        } else {
            alert(`Gagal memperbarui menu: ${response.message}`);
        }
    });
}

// Panggil fungsi loadCategories dan displayStatuses saat modal dibuka
$('#addProductModal').on('show.bs.modal', function () {
    loadCategories();
    displayStatuses();
});


// Tangani submit form edit menu
document.getElementById('editProductForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Mencegah reload halaman

    if (currentEditIndex === null) {
        alert("Tidak ada menu yang sedang diedit.");
        return;
    }

    // Ambil data dari form
    const updatedMenu = {
        category_id: document.getElementById('edit-product-category').value,
        name: document.getElementById('edit-product-name').value,
        price: parseFloat(document.getElementById('edit-product-price').value),
        // Gambar tidak langsung diupdate di sini (memerlukan upload terpisah)
    };

    if (!updatedMenu.name || isNaN(updatedMenu.price) || updatedMenu.price <= 0) {
        alert("Data menu tidak valid. Pastikan semua field terisi dengan benar.");
        return;
    }

    // Kirim data yang diperbarui ke API
    const menuId = menus[currentEditIndex].id; // ID menu yang sedang diedit
    putJSON(`https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/menu/${menuId}`, "Login", token, updatedMenu, (response) => {
        if (response.status === 200) {
            alert("Menu berhasil diperbarui!");
            menus[currentEditIndex] = response.data.data; // Update data menu
            displayMenus({ data: { data: menus } }); // Refresh tampilan
        } else {
            alert("Gagal memperbarui menu.");
        }
    });

    // Tutup modal
    const editProductModal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
    editProductModal.hide();
});

// Fungsi untuk menangani submit form saat mengubah menu
function editMenu(event) {
    event.preventDefault(); // Mencegah form submit default

    const updatedMenuName = document.getElementById('edit-product-name').value.trim(); // Nama menu baru
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
            displayMenus({ data: { data: menus } });

            // Menutup modal setelah perubahan berhasil
            const modal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
            modal.hide(); // Menutup modal

            // Reset form
            document.getElementById('edit-product-name').value = '';
        } else {
            console.error('Gagal mengubah menu:', data);
            alert('Gagal mengubah menu!');
        }
    });
}

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
