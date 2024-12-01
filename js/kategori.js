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
            // Tampilkan data di halaman
            const container = document.getElementById('category-list');
            container.innerHTML = JSON.stringify(data, null, 2); // Format JSON ke teks
        })
        .catch(error => {
            console.error("Terjadi kesalahan:", error);
        });
}

// Fungsi untuk menampilkan daftar kategori
function renderCategoryList() {
    const categoryList = document.getElementById('category-list');
    categoryList.innerHTML = ''; // Hapus daftar yang ada
    categories.forEach((category, index) => {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        const actionCell = document.createElement('td');
        actionCell.classList.add('text-center'); // Mengatur text di tengah

        nameCell.textContent = category.name;

        // Membuat tombol Ubah dan Hapus dengan icon
        const editButton = document.createElement('button');
        editButton.className = 'btn btn-warning me-2';
        editButton.innerHTML = '<i class="fas fa-pen"></i> Ubah';
        editButton.addEventListener('click', () => openEditModal(index)); // Menambahkan event listener untuk tombol Ubah

        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger';
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i> Hapus';
        deleteButton.addEventListener('click', () => openDeleteModal(index)); // Menambahkan event listener untuk tombol Hapus

        // Menambahkan tombol ke dalam actionCell
        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);

        row.appendChild(nameCell);
        row.appendChild(actionCell);
        categoryList.appendChild(row);
    });
}

// Menangani submit form untuk menambah kategori
document.getElementById('add-category-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const categoryName = document.getElementById('category-name').value;

    const dataToAdd = { name: categoryName };

    postJSON(apiUrl, dataToAdd, (response) => {
        if (response.status === 200) {
            categories.push(response.data); // Menambahkan kategori yang baru ke dalam array
            renderCategoryList(); // Render ulang daftar kategori

            // Tampilkan SweetAlert2 setelah kategori berhasil ditambahkan
            Swal.fire({
                title: 'Sukses!',
                text: 'Kategori berhasil ditambahkan.',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                const addCategoryModal = bootstrap.Modal.getInstance(document.getElementById('addCategoryModal'));
                addCategoryModal.hide();
            });
        } else {
            Swal.fire('Gagal', 'Terjadi kesalahan saat menambahkan kategori', 'error');
        }
    });
});

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
    // Logika validasi kategori di sini
    const categoryName = document.getElementById('edit-category-name').value;
    if (!categoryName) {
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
