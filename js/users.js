
// Data pengguna
const users = [
    {
        id: 1,
        username: "Johndoe",
        email: "johndoe@example.com",
        phone: "(123) 456-7890",
        role: "User",
        image: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    // Tambahkan data pengguna lainnya di sini...
];

let deleteIndex = null; // Variable to store the index of the user to be deleted
let editIndex = null; // Variable to store the index of the user being edited
let changePasswordIndex = null; // Variable to store the index of the user whose password is being changed


function openEditModal(index) {
    const user = users[index];
    document.getElementById('edit-pengguna-id').value = user.id;
    document.getElementById('edit-pengguna-username').value = user.username;
    document.getElementById('edit-pengguna-email').value = user.email;
    document.getElementById('edit-pengguna-telepon').value = user.phone;
    document.getElementById('edit-pengguna-role').value = user.role;
    // Setel nilai foto ke input
    document.getElementById('file-name').textContent = user.image; // Menampilkan foto saat ini
    // Reset input file foto, tidak perlu mengisinya
    document.getElementById('edit-pengguna-foto').value = '';
    // Simpan indeks pengguna yang sedang diedit
    editIndex = index; // Pastikan editIndex diatur di sini

    const modal = new bootstrap.Modal(document.getElementById('editUsersModal'));
    modal.show();
}

function openDeleteModal(index) {
    deleteIndex = index; // Store the index of the user to be deleted
    const modal = new bootstrap.Modal(document.getElementById('deleteUsersModal'));
    modal.show();
}

// Fungsi untuk menghapus pengguna
function deleteUser() {
    if (deleteIndex !== null) {
        // Hapus pengguna dari array
        users.splice(deleteIndex, 1);

        // Perbarui tampilan tabel
        renderUserList();

        // Reset deleteIndex
        deleteIndex = null;

        // Tampilkan pemberitahuan sukses dengan SweetAlert2
        Swal.fire({
            title: 'Pengguna Dihapus!',
            text: 'Data pengguna berhasil dihapus.',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            // Tutup modal setelah menekan OK di SweetAlert2
            const modal = bootstrap.Modal.getInstance(document.getElementById('deleteUsersModal'));
            modal.hide();
        });
    }
}

// Fungsi untuk memperbarui pengguna
function ValidateUser(event) {
    event.preventDefault(); // Mencegah pengiriman form default

    if (editIndex !== null) {  // Pastikan editIndex digunakan di sini
        // Ambil data dari form edit
        users[editIndex].username = document.getElementById('edit-pengguna-username').value;
        users[editIndex].email = document.getElementById('edit-pengguna-email').value;
        users[editIndex].phone = document.getElementById('edit-pengguna-telepon').value;

        // Simpan foto baru jika ada yang dipilih
        const newPhotoInput = document.getElementById('edit-pengguna-foto');
        if (newPhotoInput.files.length > 0) {
            // Anda dapat menambahkan logika untuk mengupload foto
            users[editIndex].image = URL.createObjectURL(newPhotoInput.files[0]); // Simulasi pemuatan gambar
        }

        // Perbarui tampilan tabel setelah data pengguna diedit
        renderUserList();

        // Tampilkan pemberitahuan sukses dengan SweetAlert2
        Swal.fire({
            title: 'Sukses!',
            text: 'Data pengguna berhasil diubah!',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            // Tutup modal setelah menekan OK di SweetAlert2
            const modal = bootstrap.Modal.getInstance(document.getElementById('editUsersModal'));
            modal.hide();
        });

        // Reset editIndex
        editIndex = null;
    }

    return false; // Mencegah pengiriman form default
}


// Fungsi untuk menampilkan daftar pengguna di tabel
// Fungsi untuk menampilkan daftar pengguna di tabel
function renderUserList() {
    const userList = document.getElementById('user-list');
    userList.innerHTML = ''; // Kosongkan tabel sebelum memperbarui

    users.forEach((user, index) => {
        userList.innerHTML += `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td id="role-user-${user.id}">${user.role}</td>
                <td>${user.phone}</td>
                <td><img src="${user.image}" alt="Foto" class="img-fluid"></td>
                <td>
                    <div class="dropdown">
                        <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">Aksi</button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <li><a class="dropdown-item" href="#" onclick="openEditModal(${index})"><i class="fas fa-pen text-warning"></i> Ubah</a></li>
                            <li><a class="dropdown-item" href="#" onclick="openDeleteModal(${index})"><i class="fas fa-trash-alt text-danger"></i> Hapus</a></li>
                            <li><a class="dropdown-item" href="#" onclick="openChangePasswordModal(${index})"><i class="fas fa-key text-success"></i> Ganti Kata Sandi</a></li>
                            <li><a class="dropdown-item" href="#" onclick="upgradeToAdmin(${user.id})"><i class="fas fa-user-shield text-primary"></i> Jadikan Sebagai Admin</a></li>
                        </ul>
                    </div>
                </td>
            </tr>
        `;
    });
}


// upgrade to admin
function upgradeToAdmin(userId) {
    // Ambil elemen role berdasarkan ID pengguna yang di-click
    var roleElement = document.getElementById(`role-user-${userId}`);

    // Cek apakah elemen ditemukan
    if (roleElement) {
        // Cek apakah perannya saat ini adalah "User"
        if (roleElement.textContent.trim() === 'User') {
            // Ubah teks menjadi "Admin"
            roleElement.textContent = 'Admin';

            // Tampilkan pesan sukses
            alert(`Pengguna dengan ID ${userId} telah di-upgrade menjadi Admin.`);
        } else if (roleElement.textContent.trim() === 'Admin') {
            // Tampilkan pesan bahwa pengguna sudah admin
            alert(`Pengguna dengan ID ${userId} sudah merupakan Admin.`);
        }
    } else {
        // Jika elemen role tidak ditemukan
        alert(`Tidak dapat menemukan pengguna dengan ID ${userId}.`);
    }
}


// Panggil renderUserList() ketika halaman dimuat
document.addEventListener('DOMContentLoaded', renderUserList);

// Event listener untuk tombol konfirmasi hapus
document.getElementById('confirm-delete-btn').addEventListener('click', deleteUser);

document.getElementById('edit-pengguna-foto').addEventListener('change', updateFileName);


function updateFileName() {
    const fileInput = document.getElementById('edit-pengguna-foto');
    const fileNameDisplay = document.getElementById('file-name');

    if (fileInput.files.length > 0) {
        fileNameDisplay.textContent = fileInput.files[0].name; // Menampilkan nama file
    } else {
        fileNameDisplay.textContent = ''; // Kosongkan jika tidak ada file yang dipilih
    }
}

function openChangePasswordModal(index) {
    changePasswordIndex = index; // Simpan indeks pengguna yang kata sandinya akan diubah
    const modal = new bootstrap.Modal(document.getElementById('changePasswordModal'));
    modal.show();
}

function changePassword() {
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (newPassword === confirmPassword) {
        // Proses perubahan kata sandi (di sini bisa ditambahkan logika untuk menyimpan kata sandi baru)

        // Tampilkan SweetAlert2 setelah kata sandi berhasil diubah
        Swal.fire({
            title: 'Sukses!',
            text: 'Kata sandi berhasil diubah.',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            // Tutup modal setelah menekan OK di SweetAlert2
            const modal = bootstrap.Modal.getInstance(document.getElementById('changePasswordModal'));
            modal.hide();

            // Reset input kata sandi setelah modal ditutup
            document.getElementById('new-password').value = '';
            document.getElementById('confirm-password').value = '';
        });

        return false; // Mencegah pengiriman form default
    } else {
        // Jika kata sandi tidak cocok, tampilkan alert
        Swal.fire({
            title: 'Gagal!',
            text: 'Kata sandi tidak cocok.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }

    return false; // Mencegah pengiriman form default
}


// Fungsi untuk menampilkan/menyembunyikan password
function togglePasswordVisibility(fieldId) {
    const passwordField = document.getElementById(fieldId);
    const eyeIcon = document.getElementById('eye-' + fieldId);

    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        passwordField.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');

    }
}

// Event listener untuk mencegah penempelan (paste) pada input password
document.getElementById('register-password').addEventListener('paste', function (e) {
    e.preventDefault();
    alert("Penempelan password tidak diizinkan.");
});
document.getElementById('register-confirm-password').addEventListener('paste', function (e) {
    e.preventDefault();
    alert("Penempelan password tidak diizinkan.");
});
