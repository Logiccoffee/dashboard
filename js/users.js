// Import modul eksternal
import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";

const API_URL = "https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/users";
const UPDATE_ROLE_URL = "https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/updateUserRole";

// Ambil token dari cookie dengan nama 'login'
const token = getCookie('login');
if (!token) {
    alert('Token tidak ditemukan, harap login terlebih dahulu!');
    throw new Error("Token tidak ditemukan. Harap login ulang.");
}

// Panggil API untuk mengambil data pengguna
fetch(API_URL, {
    method: 'GET',
    headers: {
        'login': token,
        'Content-Type': 'application/json',
    },
})
    .then(response => response.json())
    .then(response => {
        if (response.status === "success") {
            const users = response.data || [];
            console.log("Data pengguna:", users); // Log data pengguna untuk debugging
            generateUserTable(users);
        } else {
            console.error(`Error: ${response.status}`);
            alert("Gagal memuat data pengguna. Silakan coba lagi.");
        }
    })
    .catch(error => {
        console.error("Error fetching data: ", error);
        alert("Terjadi kesalahan saat memuat data pengguna.");
    });

// Fungsi untuk menghasilkan tabel pengguna
function generateUserTable(users) {
    const container = document.getElementById('user-list');
    if (!container) {
        console.error("Elemen dengan ID 'user-list' tidak ditemukan.");
        throw new Error("Gagal memuat tabel pengguna. Elemen tidak ditemukan.");
    }

    container.innerHTML = '';
    users.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.name || "Nama Tidak Diketahui"}</td>
            <td id="email-user-${user._id}">${user.email || "Email Tidak Diketahui"}</td>
            <td id="role-user-${user._id}">${user.role || "Peran Tidak Diketahui"}</td>
            <td>${user.phonenumber || "Nomor Telepon Tidak Diketahui"}</td>
            <td>${generateDropdownMenu(user._id, user.role)}</td>
        `;
        container.appendChild(row);
    });
}

// Fungsi untuk menambahkan dropdown menu di setiap baris pengguna
function generateDropdownMenu(userId, currentRole) {
    if (!userId) return '<span>Role tidak tersedia</span>'; // Penanganan jika ID tidak valid

    const roles = ['admin', 'dosen', 'user'];
    const options = roles
        .filter(role => role !== currentRole)
        .map(role => `<li><a class="dropdown-item" href="#" data-user-id="${userId}" data-role="${role}">${role}</a></li>`)
        .join('');

    return `
        <div class="dropdown">
            <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                Role
            </button>
            <ul class="dropdown-menu">
                ${options}
            </ul>
        </div>
    `;
}

// Delegasi event untuk dropdown role
const userList = document.getElementById('user-list');
if (!userList) {
    console.error("Elemen dengan ID 'user-list' tidak ditemukan.");
    throw new Error("Gagal memuat daftar pengguna. Elemen tidak ditemukan.");
}

userList.addEventListener('click', event => {
    const target = event.target;
    if (target.matches('a[data-user-id]')) {
        event.preventDefault();
        const userId = target.getAttribute('data-user-id');
        const newRole = target.getAttribute('data-role');
        handleRoleChange(userId, newRole);
    }
});

// Fungsi untuk menangani perubahan role pengguna
function handleRoleChange(userId, newRole) {
    if (!userId) {
        console.error('User ID tidak valid.');
        alert('Terjadi kesalahan. User ID tidak valid.');
        return;
    }

    const emailElement = document.getElementById(`email-user-${userId}`);
    if (!emailElement) {
        console.error('Email pengguna tidak ditemukan.');
        alert('Terjadi kesalahan. Email pengguna tidak ditemukan.');
        return;
    }

    const userEmail = emailElement.textContent;

    console.log(`Mengubah role untuk user ${userEmail} menjadi ${newRole}`);

    fetch(UPDATE_ROLE_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'login': token,
        },
        body: JSON.stringify({
            email: userEmail,
            role: newRole,
        }),
    })
        .then(response => {
            if (response.ok) {
                document.getElementById(`role-user-${userId}`).textContent = newRole;
                alert(`Role berhasil diubah menjadi ${newRole}`);
            } else {
                return response.json().then(err => {
                    throw new Error(err.message || 'Gagal mengubah role');
                });
            }
        })
        .catch(error => {
            console.error('Terjadi kesalahan:', error);
            alert(`Terjadi kesalahan saat mengubah role: ${error.message}`);
        });
}
