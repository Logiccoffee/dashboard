// Array untuk menyimpan data kategori
let categories = [];
let currentEditIndex = null; // Untuk menyimpan index kategori yang sedang diedit
let currentDeleteIndex = null; // Untuk menyimpan index kategori yang akan dihapus

const apiUrl = 'https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/category';

// Fungsi untuk mendapatkan data kategori dari API
function fetchCategory() {
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Pastikan data diambil sesuai struktur JSON
            const categoryData = data.data; // Array kategori dalam data JSON

            // Tampilkan data di dalam tabel
            const container = document.getElementById('category-list');
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
                    // Tambahkan logika modal untuk edit di sini
                    console.log(`Edit kategori dengan index: ${index}`);
                });

                // Tombol Hapus
                const deleteButton = document.createElement('button');
                deleteButton.className = 'btn btn-danger';
                deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i> Hapus';
                // Event listener untuk tombol Hapus
                deleteButton.addEventListener('click', () => {
                    // Tambahkan logika modal untuk hapus di sini
                    console.log(`Hapus kategori dengan index: ${index}`);
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
        })
        .catch(error => {
            console.error("Terjadi kesalahan:", error);
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

    // Mengirimkan data ke API
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Login': token // Tambahkan token ke header
        },
        body: JSON.stringify(newCategory)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Log respons dari API untuk memeriksa apakah data berhasil ditambahkan
        console.log('Respons dari API:', data);
        alert('Kategori berhasil ditambahkan!');
        
        // Menutup modal setelah kategori ditambahkan
        const modal = bootstrap.Modal.getInstance(document.getElementById('addCategoryModal'));
        modal.hide(); // Menutup modal
        
        // Memperbarui daftar kategori setelah penambahan
        fetchCategory(); // Memanggil fetchCategory untuk memperbarui daftar kategori
        
        // Mengosongkan input form
        document.getElementById('category-name').value = '';
    })
    .catch(error => {
        console.error("Terjadi kesalahan:", error);
        alert('Terjadi kesalahan saat menambah kategori.');
    });
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

// Menangani submit form untuk mengubah kategori
document.getElementById('edit-category-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const categoryName = document.getElementById('edit-category-name').value;

    const dataToUpdate = { name: categoryName };
    const targetUrl = `${apiUrl}/${categories[currentEditIndex].id}`;

    putJSON(targetUrl, dataToUpdate, (response) => {
        if (response.status === 200) {
            categories[currentEditIndex].name = categoryName; // Memperbarui nama kategori di array
            renderCategoryList(); // Render ulang daftar kategori

            // Tampilkan SweetAlert2 setelah kategori berhasil diubah
            Swal.fire({
                title: 'Sukses!',
                text: 'Kategori berhasil diubah.',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                const editCategoryModal = bootstrap.Modal.getInstance(document.getElementById('editCategoryModal'));
                editCategoryModal.hide();
            });
        } else {
            Swal.fire('Gagal', 'Terjadi kesalahan saat mengubah kategori', 'error');
        }
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
    currentEditIndex = index; // Menyimpan index kategori yang akan diedit
    document.getElementById('edit-category-name').value = categories[index].name;
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

// Render daftar kategori saat halaman dimuat
fetchCategory(); // Menambahkan pemanggilan untuk fetchCategory
