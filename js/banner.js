let editingBanner = null;
let deletingBanner = null;


document.addEventListener('DOMContentLoaded', function () {
    // Fungsi untuk menangani form "Tambah Banner"
    function handleAddBanner(event) {
        event.preventDefault(); // Prevent default form submission

        // Ambil input file dan nama banner
        const fileInput = document.getElementById('banner-file');
        const nameInput = document.getElementById('banner-name');
        const file = fileInput.files[0];
        const bannerName = nameInput.value.trim();

        if (file && bannerName) {
            // Pilih elemen banner list
            const bannerList = document.querySelector('.banner-list');

            // Dapatkan jumlah banner saat ini dan tentukan nomor banner berikutnya
            const currentBanners = bannerList.querySelectorAll('.banner-item').length;
            const nextBannerNumber = currentBanners + 1;

            // Buat elemen banner baru
            const bannerItem = document.createElement('div');
            bannerItem.classList.add('banner-item', 'mb-3');

            // Banner title dengan nomor berikutnya dan nama
            const bannerTitle = document.createElement('h3');
            bannerTitle.classList.add('banner-title');
            bannerTitle.innerText = `${bannerName} - Banner ${nextBannerNumber}`; // Gabungkan nama dan nomor banner

            // Gambar banner
            const bannerImg = document.createElement('img');
            bannerImg.src = URL.createObjectURL(file); // Preview gambar yang diunggah
            bannerImg.alt = `Banner ${nextBannerNumber}`;
            bannerImg.classList.add('img-fluid');

            // Tombol Edit dan Hapus
            const buttonGroup = document.createElement('div');
            buttonGroup.classList.add('button-group', 'mt-2');

            const editButton = document.createElement('button');
            editButton.classList.add('btn', 'btn-warning', 'edit-banner-btn');
            editButton.innerHTML = '<i class="fas fa-pen text-light"></i> <span class="text-light">Ubah</span>';

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('btn', 'btn-danger');
            deleteButton.innerHTML = '<i class="fas fa-trash-alt text-light"></i> Hapus';

            // Tambahkan tombol ke grup
            buttonGroup.appendChild(editButton);
            buttonGroup.appendChild(deleteButton);

            // Tambahkan title, gambar, dan tombol ke dalam banner item
            bannerItem.appendChild(bannerTitle);
            bannerItem.appendChild(bannerImg);
            bannerItem.appendChild(buttonGroup);

            // Tambahkan item banner ke dalam daftar
            bannerList.appendChild(bannerItem);

            // Reset form dan input
            fileInput.value = '';
            nameInput.value = '';

            // Tutup modal
            const modalElement = document.getElementById('addBannerModal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();

            // Pastikan backdrop modal dihapus
            document.body.classList.remove('modal-open'); // Hapus class 'modal-open'
            document.body.style = ''; // Reset style pada body

            // Hapus elemen modal-backdrop jika masih ada
            const modalBackdrops = document.querySelectorAll('.modal-backdrop');
            modalBackdrops.forEach(backdrop => backdrop.remove());

            // Hapus class 'show' dan backdrop jika modal masih terlihat
            modalElement.classList.remove('show');
            modalElement.setAttribute('aria-hidden', 'true');
            modalElement.style.display = 'none';

            const modalBackdrop = document.querySelector('.modal-backdrop');
            if (modalBackdrop) {
                modalBackdrop.remove();
            }

            // Tampilkan pesan sukses (optional)
            Swal.fire({
                title: 'Banner Ditambahkan!',
                text: `Banner ${nextBannerNumber} berhasil ditambahkan.`,
                icon: 'success',
                confirmButtonText: 'OK'
            });

            // Tambahkan event listener untuk tombol Edit dan Hapus
            editButton.addEventListener('click', function () {
                handleEditButtonClick(bannerItem);
            });

            deleteButton.addEventListener('click', function () {
                handleDeleteButtonClick(bannerItem);
            });
        } else {
            // Jika tidak ada file atau nama banner kosong
            Swal.fire({
                title: 'Gagal',
                text: 'Mohon isi semua informasi banner.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }

    function handleEditButtonClick(bannerElement) {
        editingBanner = bannerElement;

        // Ambil data dari elemen banner untuk ditampilkan
        const bannerTitle = bannerElement.querySelector('.banner-title').innerText.split(' - ')[0];
        const bannerImgSrc = bannerElement.querySelector('img').src;

        // Isi nilai input di modal edit
        document.getElementById('edit-banner-name').value = bannerTitle;
        document.getElementById('current-banner-preview').src = bannerImgSrc;

        // Tampilkan modal edit
        const editBannerModal = new bootstrap.Modal(document.getElementById('editBannerModal'));
        editBannerModal.show();
    }

    // Fungsi untuk menangani tombol "Hapus" pada banner
    function handleDeleteButtonClick(bannerElement) {
        deletingBanner = bannerElement; // Simpan elemen banner yang akan dihapus

        // Tampilkan modal hapus
        const deleteBannerModal = new bootstrap.Modal(document.getElementById('deleteBannerModal'));
        deleteBannerModal.show();
    }

    // Event listener untuk form tambah banner
    const addBannerForm = document.getElementById('add-banner-form');
    addBannerForm.addEventListener('submit', handleAddBanner);

    // Event listener untuk tombol "Ubah" di setiap banner
    const editButtons = document.querySelectorAll('.edit-banner-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function () {
            const bannerElement = button.closest('.banner-item');
            handleEditButtonClick(bannerElement);
        });
    });

    // Tambahkan event listener untuk tombol "Hapus" di setiap banner
    const bannerList = document.querySelector('.banner-list');
    bannerList.addEventListener('click', function (event) {
        if (event.target.closest('.btn-danger')) {
            const bannerElement = event.target.closest('.banner-item');
            handleDeleteButtonClick(bannerElement);
        }
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