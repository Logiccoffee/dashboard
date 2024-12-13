// Mengimpor modul eksternal
import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";

// URL API
const API_URL = "https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/users";

// Ambil token dari cookie dengan nama 'login'
const token = getCookie('login');
if (!token) {
    alert('Token tidak ditemukan, harap login terlebih dahulu!');
    throw new Error("Token tidak ditemukan. Harap login ulang.");
}

// Panggil API untuk mengambil data pengguna menggunakan fetch()
fetch(API_URL, {
    method: 'GET',
    headers: {
        'login': token,
        'Content-Type': 'application/json',
    }
})
    .then(response => response.json()) // Parse JSON dari respons
    .then(response => {
        if (response.status === "success") {
            const users = response.data || []; // Pastikan data diakses dengan benar
            generateUserTable(users); // Tampilkan data pengguna
        } else {
            console.error(`Error: ${response.status}`);
            alert("Gagal memuat data pengguna. Silakan coba lagi.");
        }
    })
    .catch(error => {
        console.error("Error fetching data: ", error);
        alert("Terjadi kesalahan saat memuat data pengguna.");
    });

// Fungsi utama untuk menghasilkan tabel pengguna
function generateUserTable(users) {
    const container = document.getElementById('user-list');
    if (!container) {
        console.error("Elemen dengan ID 'user-list' tidak ditemukan.");
        return;
    }

    container.innerHTML = ''; // Kosongkan data lama

    users.forEach((user, index) => {
        const row = document.createElement('tr');

        // Buat dropdown opsi role
        const dropdownMenu = generateDropdownMenu(user._id, user.role);

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.name || "Nama Tidak Diketahui"}</td>
            <td>${user.email || "Email Tidak Diketahui"}</td>
            <td id="role-user-${user._id || "-"}">${user.role || "Peran Tidak Diketahui"}</td>
            <td>${user.phonenumber || "Nomor Telepon Tidak Diketahui"}</td>
            <td>
                ${dropdownMenu}
            </td>
        `;
        container.appendChild(row);
    });
}

// Fungsi untuk menambahkan dropdown menu di setiap baris pengguna
function generateDropdownMenu(userId, currentRole) {
    const roles = ['admin', 'dosen', 'user'];
    const options = roles
        .filter(role => role !== currentRole)
        .map(role => `<li><a class="dropdown-item" href="#" data-user-id="${userId}" onclick="handleRoleChange('${userId}', '${role}')">${role}</a></li>`)
        .join('');

    return `
        <div class="dropdown">
            <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenu-${userId}" data-bs-toggle="dropdown" aria-expanded="false">
                Role
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenu-${userId}">
                ${options}
            </ul>
        </div>
    `;
}

// Ambil elemen tbody di dalam table
const userList = document.getElementById('user-list');

// Anggap `users` adalah array objek pengguna yang sudah diambil dari server
users.forEach((user, index) => {
    const userRow = document.createElement('tr');
    userRow.id = `user-row-${user._id}`;
    userRow.innerHTML = `
        <td>${index + 1}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td id="role-user-${user._id}">${user.role}</td>
        <td>${user.phone}</td>
        <td>${generateDropdownMenu(user._id, user.role)}</td>
    `;
    userList.appendChild(userRow);
});

// Fungsi untuk menangani perubahan role pengguna
export function handleRoleChange(userId, newRole) {
    console.log(`Mengubah role untuk user ${userId} menjadi ${newRole}`);
    
    // Contoh: Kirim permintaan ke server untuk memperbarui role pengguna
    fetch(`https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/users${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
    })
        .then((response) => {
            if (response.ok) {
                alert(`Role berhasil diubah menjadi ${newRole}`);
            } else {
                throw new Error('Gagal mengubah role');
            }
        })
        .catch((error) => {
            console.error('Terjadi kesalahan:', error);
            alert('Terjadi kesalahan saat mengubah role.');
        });
}

// Pastikan fungsi tersedia untuk dipanggil di elemen HTML
window.handleRoleChange = handleRoleChange;