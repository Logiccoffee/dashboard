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

// Fungsi untuk menghasilkan dropdown menu dengan nama tombol di aksi "Ubah Peran"
function generateDropdownMenu(userId, currentRole) {
    const roles = ['admin', 'dosen', 'user'];
    const options = roles
        .filter(role => role !== currentRole)
        .map(role => `<li><a class="dropdown-item" href="#" onclick="handleRoleChange('${userId}', '${role}')">${role}</a></li>`)
        .join('');

    return `
        <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu-${userId}" data-bs-toggle="dropdown" aria-expanded="false">
                Ubah Peran
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenu-${userId}">
                ${options}
            </ul>
        </div>
    `;
}

// Fungsi untuk menangani perubahan role pengguna
function handleRoleChange(userId, newRole) {
    console.log(`User ID: ${userId}, Role Baru: ${newRole}`);

    const updatedData = { role: newRole };

    fetch(`https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'login': token // Sertakan token di header
        },
        body: JSON.stringify(updatedData)
    })
    .then(response => {
        if (!response.ok) {
            console.error('Error response:', response);
            throw new Error('Gagal memperbarui role pengguna');
        }
        return response.json();
    })
    .then(data => {
        console.log('Role berhasil diperbarui:', data);

        // Cari indeks user yang diupdate
        const userIndex = users.findIndex(user => user._id === userId);
        if (userIndex !== -1) {
            // Update role di tabel DOM
            const userRow = document.getElementById(`user-row-${userId}`);
            if (userRow) {
                const roleCell = userRow.querySelector(`#role-user-${userId}`);
                if (roleCell) {
                    roleCell.textContent = newRole;
                }
            }
        }
    })
    .catch(error => {
        console.error('Terjadi kesalahan saat memperbarui role:', error);
        alert('Gagal memperbarui role. Coba lagi nanti.');
    });
}