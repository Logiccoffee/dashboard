import { postJSON } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.4/api.js";

// Array untuk menyimpan data kategori
const categories = [
    { name: 'Signature' },
    { name: 'Manual Brew' },
    { name: 'Coffee' },
    { name: 'Non Coffee' },
    { name: 'Mocktail' },
    { name: 'Mojito' }
];

let currentEditIndex = null; // Untuk menyimpan index kategori yang sedang diedit
let currentDeleteIndex = null // Untuk menyimpan index kategori yang akan diapus

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
    categories.push({ name: categoryName });
    document.getElementById('add-category-form').reset();
    renderCategoryList();

    // Mengirim data kategori baru ke server menggunakan postJSON
    postJSON('https://your-api-endpoint.com/add-category', { name: categoryName })
        .then(response => {
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
        })
        .catch(error => {
            Swal.fire({
                title: 'Error!',
                text: 'Kategori gagal ditambahkan.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
});

// Menangani submit form untuk mengubah kategori
document.getElementById('edit-category-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const categoryName = document.getElementById('edit-category-name').value;
    categories[currentEditIndex].name = categoryName;
    document.getElementById('edit-category-form').reset();
    renderCategoryList();

    // Mengirim data kategori yang diubah ke server menggunakan postJSON
    postJSON('https://your-api-endpoint.com/edit-category', { id: currentEditIndex, name: categoryName })
        .then(response => {
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
        })
        .catch(error => {
            Swal.fire({
                title: 'Error!',
                text: 'Kategori gagal diubah.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
});

// Fungsi untuk menghapus kategori setelah konfirmasi
document.getElementById('confirm-delete-btn').addEventListener('click', () => {
    if (currentDeleteIndex !== null) {
        const deletedCategory = categories[currentDeleteIndex];
        categories.splice(currentDeleteIndex, 1); // Hapus kategori dari array
        renderCategoryList(); // Render ulang daftar kategori

        // Mengirim data kategori yang dihapus ke server menggunakan postJSON
        postJSON('https://your-api-endpoint.com/delete-category', { id: currentDeleteIndex })
            .then(response => {
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
            })
            .catch(error => {
                Swal.fire({
                    title: 'Error!',
                    text: 'Kategori gagal dihapus.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
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
    currentDeleteIndex = index; // Menyimpan index kategori yang akan diapus
    const deleteCategoryModal = new bootstrap.Modal(document.getElementById('deleteCategoryModal'))
    deleteCategoryModal.show()
}

// Event listener untuk tombol Tambah Kategori
document.getElementById('add-category-btn').addEventListener('click', () => {
    const addCategoryModal = new bootstrap.Modal(document.getElementById('addCategoryModal'));
    addCategoryModal.show();
});

// Render daftar kategori saat halaman dimuat
renderCategoryList();

