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

// Variabel untuk menyimpan data pengguna
let users = [];

// Fungsi untuk memuat data pengguna
async function fetchUsers() {
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'login': token,
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();
        if (response.ok && result.status === "success") {
            users = result.data || [];
            generateUserTable(users);
        } else {
            console.error(`Gagal memuat data pengguna. Status: ${result.status}`);
            alert("Gagal memuat data pengguna. Silakan coba lagi.");
        }
    } catch (error) {
        console.error("Error fetching users:", error);
        alert("Terjadi kesalahan saat memuat data pengguna.");
    }
}

// Fungsi untuk membuat tabel pengguna
function generateUserTable(users) {
    const container = document.getElementById('user-list');
    if (!container) {
        console.error("Elemen dengan ID 'user-list' tidak ditemukan.");
        return;
    }

    container.innerHTML = '';
    users.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.name || "Nama Tidak Diketahui"}</td>
            <td>${user.email || "Email Tidak Diketahui"}</td>
            <td id="role-user-${user._id}">${user.role || "Peran Tidak Diketahui"}</td>
            <td>${user.phonenumber || "Nomor Telepon Tidak Diketahui"}</td>
            <td>${generateDropdownMenu(user._id, user.role)}</td>
        `;
        container.appendChild(row);
    });
}

// Fungsi untuk membuat dropdown menu di setiap baris pengguna
function generateDropdownMenu(userId, currentRole) {
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

// Delegasi event untuk perubahan role pengguna
document.addEventListener('click', event => {
    const target = event.target;
    if (target.matches('a[data-user-id]')) {
        event.preventDefault();
        const userId = target.getAttribute('data-user-id');
        const newRole = target.getAttribute('data-role');
        handleRoleChange(userId, newRole);
    }
});

// Fungsi untuk menangani perubahan role
async function handleRoleChange(userId, newRole) {
    const user = users.find(user => user._id === userId);
    if (!user) {
        console.error(`Pengguna dengan ID ${userId} tidak ditemukan.`);
        alert("Pengguna tidak ditemukan.");
        return;
    }

    try {
        const response = await fetch(UPDATE_ROLE_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'login': token,
            },
            body: JSON.stringify({
                email: user.email,
                role: newRole,
            }),
        });

        const result = await response.json();
        if (response.ok) {
            document.getElementById(`role-user-${userId}`).textContent = newRole;
            alert(`Role berhasil diubah menjadi ${newRole}`);
        } else {
            console.error('Gagal mengubah role:', result);
            throw new Error(result.message || 'Gagal mengubah role');
        }
    } catch (error) {
        console.error('Error updating role:', error);
        alert(`Terjadi kesalahan saat mengubah role: ${error.message}`);
    }
}

// Inisialisasi saat DOM siap
document.addEventListener('DOMContentLoaded', fetchUsers);
