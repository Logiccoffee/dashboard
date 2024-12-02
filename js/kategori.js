import {getJSON} from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import {postJSON} from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";

// Array untuk menyimpan data kategori
let categories = [];
let currentEditIndex = null; // Untuk menyimpan index kategori yang sedang diedit
let currentDeleteIndex = null; // Untuk menyimpan index kategori yang akan dihapus

const apiUrl = 'https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/category';

// Ambil token dari cookie dengan nama 'login'
const token = getCookie('login');
if (!token) {
    alert('Token tidak ditemukan, harap login terlebih dahulu!');
    throw new Error("Token tidak ditemukan. Harap login ulang.");
}

// Panggil getJSON untuk mengambil data kategori
getJSON(apiUrl, "Login", token, (response) => {
    if (response.status === 200) {
        displayCategories(response);
    } else {
        console.error(`Error: ${response.status}`);
        alert("Gagal memuat data kategori. Silakan coba lagi.");
    }
});

// Fungsi untuk menampilkan data kategori di dalam tabel
function displayCategories(response) {
    // Validasi apakah response.data.data ada
    if (!response || !response.data || !response.data.data) {
        console.error("Data kategori tidak ditemukan di respons API.");
        alert("Data kategori tidak valid. Silakan hubungi administrator.");
        return;
    }

    const categoryData = response.data.data; // Ambil data kategori dari respons
    const container = document.getElementById('category-list');

    // Pastikan elemen container ditemukan
    if (!container) {
        console.error("Elemen dengan id 'category-list' tidak ditemukan.");
        return;
    }
    // Tampilkan data di dalam tabel
    container.innerHTML = ''; // Hapus data lama jika ada

    categoryData.forEach((item, index) => {
        // Membuat baris untuk setiap kategori
        const row = document.createElement('tr');

        // Kolom Nama Kategori
        const nameCell = document.createElement('td');
        nameCell.textContent = item.name;

        // Kolom Aksi
        const actionCell = document.createElement('td');
        actionCell.classList.add('text-center');

        // Tombol Ubah
        const editButton = document.createElement('button');
        editButton.className = 'btn btn-warning me-2';
        editButton.innerHTML = '<i class="fas fa-pen"></i> Ubah';
        // Event listener untuk tombol Ubah
        editButton.addEventListener('click', () => {
            console.log(`Edit kategori dengan index: ${index}`);
            // Logika untuk membuka modal edit di sini
        });

        // Tombol Hapus
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger';
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i> Hapus';
        // Event listener untuk tombol Hapus
        deleteButton.addEventListener('click', () => {
            console.log(`Hapus kategori dengan index: ${index}`);
            // Logika untuk membuka modal hapus di sini
        });

        // Tambahkan tombol ke kolom aksi
        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);

        // Tambahkan kolom ke dalam baris
        row.appendChild(nameCell);
        row.appendChild(actionCell);

        // Tambahkan baris ke dalam container
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

// Fungsi untuk menambah kategori
function addCategory(event) {
    event.preventDefault(); // Mencegah form submit biasa agar bisa menggunakan JavaScript

    const categoryName = document.getElementById('category-name').value.trim();

    // Validasi input kategori
    if (categoryName === '') {
        alert('Nama kategori tidak boleh kosong!');
        return false;
    }

    // Membuat objek kategori baru
    const newCategory = {
        name: categoryName
    };

    // Ambil token dari cookie dengan nama 'login'
    const token = getCookie('login');
    if (!token) {
        alert('Token tidak ditemukan, harap login terlebih dahulu!');
        return;
    }

    // Log untuk memeriksa data yang akan dikirim
    console.log('Kategori yang akan ditambahkan:', newCategory);

    // Memanggil fungsi postJSON dari library untuk mengirimkan data kategori ke API
    postJSON(
        apiUrl,        // URL API
        'login',       // Nama header untuk token
        token,         // Nilai token dari cookie
        newCategory,   // Data kategori dalam bentuk JSON
        function(response) {
            const { status, data } = response;
            
            if (status >= 200 && status < 300) {
                console.log('Respons dari API:', data);
                alert('Kategori berhasil ditambahkan!');
                
                // Menutup modal setelah kategori ditambahkan
                const modal = bootstrap.Modal.getInstance(document.getElementById('addCategoryModal'));
                modal.hide(); // Menutup modal
                
                // Memperbarui daftar kategori setelah penambahan
                fetchCategory(); // Memanggil fetchCategory untuk memperbarui daftar kategori
                
                // Mengosongkan input form
                document.getElementById('category-name').value = '';
            } else {
                console.error('Gagal menambah kategori:', data);
                alert('Gagal menambah kategori!');
            }
        }
    );
}


// // Menangani submit form untuk menambah kategori
// document.getElementById('add-category-form').addEventListener('submit', (event) => {
//     event.preventDefault();
//     const categoryName = document.getElementById('category-name').value;

//     const dataToAdd = { name: categoryName };

//     postJSON(apiUrl, dataToAdd, (response) => {
//         if (response.status === 200) {
//             categories.push(response.data); // Menambahkan kategori yang baru ke dalam array
//             renderCategoryList(); // Render ulang daftar kategori

//             // Tampilkan SweetAlert2 setelah kategori berhasil ditambahkan
//             Swal.fire({
//                 title: 'Sukses!',
//                 text: 'Kategori berhasil ditambahkan.',
//                 icon: 'success',
//                 confirmButtonText: 'OK'
//             }).then(() => {
//                 const addCategoryModal = bootstrap.Modal.getInstance(document.getElementById('addCategoryModal'));
//                 addCategoryModal.hide();
//             });
//         } else {
//             Swal.fire('Gagal', 'Terjadi kesalahan saat menambahkan kategori', 'error');
//         }
//     });
// });

// Fungsi untuk menangani submit form saat mengubah kategori
document.getElementById('edit-category-form').addEventListener('submit', (event) => {
    event.preventDefault(); // Mencegah form submit default

    const updatedCategoryName = document.getElementById('edit-category-name').value.trim(); // Nama kategori baru
    if (updatedCategoryName === '') {
        alert('Nama kategori tidak boleh kosong!');
        return;
    }

    const targetUrl = `${apiUrl}/${categories[currentEditIndex].id}`; // Endpoint API dengan ID kategori

    // Data yang akan diupdate
    const updatedCategoryData = { name: updatedCategoryName };

    // Ambil token dari cookie
    const token = getCookie('login');
    if (!token) {
        alert('Token tidak ditemukan, harap login terlebih dahulu!');
        return;
    }

    // Kirim data ke API untuk mengubah kategori
    fetch(targetUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Login': token // Header token login
        },
        body: JSON.stringify(updatedCategoryData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Perbarui data kategori di array setelah berhasil diubah
            categories[currentEditIndex].name = updatedCategoryName;

            // Render ulang daftar kategori
            fetchCategory();

            // Tampilkan notifikasi
            alert('Kategori berhasil diubah!');

            // Tutup modal edit
            const editCategoryModal = bootstrap.Modal.getInstance(document.getElementById('editCategoryModal'));
            editCategoryModal.hide();

            // Reset index edit
            currentEditIndex = null;
        })
        .catch(error => {
            console.error('Terjadi kesalahan:', error);
            alert('Terjadi kesalahan saat mengubah kategori.');
        });
});

// Fungsi untuk menghapus kategori setelah konfirmasi
document.getElementById('confirm-delete-btn').addEventListener('click', () => {
    if (currentDeleteIndex !== null) {
        const targetUrl = `${apiUrl}/${categories[currentDeleteIndex].id}`;

        deleteJSON(targetUrl, {}, (response) => {
            if (response.status === 200) {
                categories.splice(currentDeleteIndex, 1); // Hapus kategori dari array
                renderCategoryList(); // Render ulang daftar kategori

                // Tampilkan SweetAlert2 setelah kategori berhasil dihapus
                Swal.fire({
                    title: 'Sukses!',
                    text: 'Kategori berhasil dihapus.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    const deleteCategoryModal = bootstrap.Modal.getInstance(document.getElementById('deleteCategoryModal'));
                    deleteCategoryModal.hide(); // Tutup modal hapus
                    currentDeleteIndex = null; // Reset index setelah penghapusan
                });
            } else {
                Swal.fire('Gagal', 'Terjadi kesalahan saat menghapus kategori', 'error');
            }
        });
    }
});

// Fungsi untuk membuka modal edit kategori
function openEditModal(index) {
    currentEditIndex = index; // Simpan index kategori yang sedang diedit
    const category = categories[index]; // Ambil data kategori berdasarkan index
    document.getElementById('edit-category-name').value = category.name; // Isi input dengan nama kategori saat ini

    // Tampilkan modal edit
    const editCategoryModal = new bootstrap.Modal(document.getElementById('editCategoryModal'));
    editCategoryModal.show();
}

// Fungsi untuk menghapus kategori
function openDeleteModal(index) {
    currentDeleteIndex = index; // Menyimpan index kategori yang akan dihapus
    const deleteCategoryModal = new bootstrap.Modal(document.getElementById('deleteCategoryModal'));
    deleteCategoryModal.show();
}

function validateCategory() {
    const categoryName = document.getElementById('category-name').value;
    if (categoryName === '') {
        alert('Nama kategori tidak boleh kosong');
        return false;
    }
    return true;
}


// Event listener untuk tombol Tambah Kategori
document.getElementById('add-category-btn').addEventListener('click', () => {
    const addCategoryModal = new bootstrap.Modal(document.getElementById('addCategoryModal'));
    addCategoryModal.show();
});