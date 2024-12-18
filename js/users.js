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
            users = response.data || []; // Simpan data pengguna di memori
            console.log("Data pengguna berhasil dimuat:", users); // Log data pengguna
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
        return;
    }

    container.innerHTML = '';
    users.forEach((user, index) => {
        // Periksa apakah user._id tersedia
        if (!user._id) {
            console.warn(`User dengan index ${index} tidak memiliki _id. Data pengguna:`, user);
            user._id = `generated-id-${index}`; // ID sementara untuk debugging
        }

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

// Fungsi untuk menambahkan dropdown menu di setiap baris pengguna
function generateDropdownMenu(userId, currentRole) {
    if (!userId) {
        console.warn("User ID tidak ditemukan, menggunakan placeholder.");
        userId = "placeholder-id"; // Placeholder untuk debugging
    }

    const roles = ['admin', 'dosen', 'user'];
    const options = roles
        .filter(role => role !== currentRole) // Hapus role saat ini dari opsi
        .map(role => {
            return `<li><a class="dropdown-item" href="#" data-user-id="${userId}" data-role="${role}">${role}</a></li>`;
        })
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
userList.addEventListener('click', event => {
    const target = event.target.closest('a[data-user-id]');
    if (target) {
        const userId = target.getAttribute('data-user-id');
        const newRole = target.getAttribute('data-role');
        handleRoleChange(userId, newRole);
    }
});

// Fungsi untuk menangani perubahan role pengguna
async function handleRoleChange(userId, newRole) {
    const user = users.find(user => user._id === userId);
    if (!user) {
        console.error(`Pengguna dengan ID ${userId} tidak ditemukan.`);
        alert("Pengguna tidak ditemukan.");
        return;
    }

    const userEmail = user.email; // Email ditemukan dari array users

    try {
        const response = await fetch(UPDATE_ROLE_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'login': token,
            },
            body: JSON.stringify({
                email: userEmail,
                role: newRole,
            }),
        });

        const responseData = await response.json(); // Parse respons JSON
        if (response.ok) {
            document.getElementById(`role-user-${userId}`).textContent = newRole;
            alert(`Role berhasil diubah menjadi ${newRole}`);
        } else {
            console.error('Status HTTP:', response.status);
            console.error('Respons API:', responseData);
            throw new Error(responseData.message || 'Gagal mengubah role');
        }
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
        alert(`Terjadi kesalahan saat mengubah role: ${error.message}`);
    }
}
