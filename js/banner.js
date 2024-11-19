function handleAddBanner(event) {
    event.preventDefault(); // Prevent default form submission

    const fileInput = document.getElementById('banner-file');
    const file = fileInput.files[0];

    if (file) {
        // Select the banner list
        const bannerList = document.querySelector('.banner-list');

        // Get current number of banners and set the next banner number
        const currentBanners = bannerList.querySelectorAll('.banner-item').length;
        const nextBannerNumber = currentBanners + 1;

        // Create new banner item
        const bannerItem = document.createElement('div');
        bannerItem.classList.add('banner-item', 'mb-3');

        // Banner title with the next number
        const bannerTitle = document.createElement('h3');
        bannerTitle.classList.add('banner-title');
        bannerTitle.innerText = `Banner ${nextBannerNumber}`; // Set the name with the number

        // Banner image
        const bannerImg = document.createElement('img');
        bannerImg.src = URL.createObjectURL(file); // Preview uploaded image
        bannerImg.alt = `Banner ${nextBannerNumber}`;
        bannerImg.classList.add('img-fluid');

        // Edit and Delete buttons
        const buttonGroup = document.createElement('div');
        buttonGroup.classList.add('button-group', 'mt-2');

        const editButton = document.createElement('button');
        editButton.classList.add('btn', 'btn-warning', 'edit-banner-btn');
        editButton.innerHTML = '<i class="fas fa-pen text-light"></i> <span class="text-light">Ubah</span>';

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.innerHTML = '<i class="fas fa-trash-alt text-light"></i> Hapus';

        // Add buttons to the group
        buttonGroup.appendChild(editButton);
        buttonGroup.appendChild(deleteButton);

        // Add title, image, and buttons to banner item
        bannerItem.appendChild(bannerTitle);
        bannerItem.appendChild(bannerImg);
        bannerItem.appendChild(buttonGroup);

        // Append new banner item to the list
        bannerList.appendChild(bannerItem);

        // Reset the form
        fileInput.value = '';

        // Hide the modal
        const modalElement = document.getElementById('addBannerModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();


        // Manually remove 'show' class and backdrop if still visible
        modalElement.classList.remove('show');
        modalElement.setAttribute('aria-hidden', 'true');
        modalElement.style.display = 'none';

        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
            modalBackdrop.remove();
        }

        // Show success message (optional)
        Swal.fire({
            title: 'Banner Ditambahkan!',
            text: `Banner ${nextBannerNumber} berhasil ditambahkan.`,
            icon: 'success',
            confirmButtonText: 'OK'
        });

        // Tambahkan event listener untuk tombol "Ubah" dan "Hapus" di banner baru
        editButton.addEventListener('click', function () {
            handleEditButtonClick(bannerItem);
        });

        deleteButton.addEventListener('click', function () {
            handleDeleteButtonClick(bannerItem);
        });
    }
}


let editingBanner = null; // Variabel untuk menyimpan banner yang sedang di-edit
let deletingBanner = null; // Variabel untuk menyimpan banner yang sedang dihapus

// Fungsi untuk menangani tombol "Ubah" di setiap banner
function handleEditButtonClick(bannerElement) {
    editingBanner = bannerElement; // Simpan banner yang sedang di-edit

    // Ambil gambar saat ini dari banner yang dipilih
    const currentBannerImage = bannerElement.querySelector('img').src;
    document.getElementById('current-banner-preview').src = currentBannerImage; // Tampilkan di form

    // Tampilkan popup "Ubah Banner"
    const editBannerModal = new bootstrap.Modal(document.getElementById('editBannerModal'));
    editBannerModal.show();
}

// Fungsi untuk menangani tombol "Hapus" di setiap banner
function handleDeleteButtonClick(bannerElement) {
    deletingBanner = bannerElement; // Simpan banner yang sedang dihapus

    // Tampilkan popup "Hapus Banner"
    const deleteBannerModal = new bootstrap.Modal(document.getElementById('deleteBannerModal'));
    deleteBannerModal.show();
}

document.addEventListener('DOMContentLoaded', function () {
    // Tambahkan event listener untuk tombol "Ubah" di setiap banner
    const editButtons = document.querySelectorAll('.edit-banner-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function () {
            const bannerElement = button.closest('.banner-item');
            handleEditButtonClick(bannerElement); // Panggil fungsi edit ketika "Ubah" diklik
        });
    });

    // Tambahkan event listener untuk tombol "Hapus" di setiap banner
    const deleteButtons = document.querySelectorAll('.btn-danger');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const bannerElement = button.closest('.banner-item');
            handleDeleteButtonClick(bannerElement); // Panggil fungsi hapus ketika "Hapus" diklik
        });
    });

    // Fungsi untuk menangani form "Edit Banner"
    function handleEditBanner(event) {
        event.preventDefault();

        const fileInput = document.getElementById('edit-banner-file');
        const file = fileInput.files[0];

        if (file && editingBanner) {
            const bannerImg = editingBanner.querySelector('img');
            if (file) {
                bannerImg.src = URL.createObjectURL(file);
            }

            // Sembunyikan popup setelah selesai edit
            const editBannerModal = bootstrap.Modal.getInstance(document.getElementById('editBannerModal'));
            editBannerModal.hide();

            // Tampilkan notifikasi sukses (optional)
            Swal.fire({
                title: 'Banner Berhasil Diubah!',
                text: 'Banner telah berhasil diperbarui.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        }
    }

    // Event listener untuk submit form "Edit Banner"
    document.getElementById('edit-banner-form').addEventListener('submit', handleEditBanner);
});

// Fungsi untuk mengonfirmasi penghapusan banner
document.getElementById('confirm-delete-btn').addEventListener('click', function () {
    if (deletingBanner) {
        deletingBanner.remove(); // Hapus banner dari DOM

        // Sembunyikan popup setelah selesai hapus
        const deleteBannerModal = bootstrap.Modal.getInstance(document.getElementById('deleteBannerModal'));
        deleteBannerModal.hide();

        // Tampilkan notifikasi sukses (optional)
        Swal.fire({
            title: 'Banner Dihapus!',
            text: 'Banner telah berhasil dihapus.',
            icon: 'success',
            confirmButtonText: 'OK'
        });
    }
});