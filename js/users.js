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
            displayUsers(users); // Tampilkan data pengguna
        } else {
            console.error(`Error: ${response.status}`);
            alert("Gagal memuat data pengguna. Silakan coba lagi.");
        }
    })
    .catch(error => {
        console.error("Error fetching data: ", error);
        alert("Terjadi kesalahan saat memuat data pengguna.");
    });

// Fungsi untuk menampilkan data pengguna di tabel
function displayUsers(users) {
    const container = document.getElementById('user-list');
    if (!container) {
        console.error("Elemen dengan ID 'user-list' tidak ditemukan.");
        return;
    }

    container.innerHTML = ''; // Kosongkan data lama

    users.forEach((user, index) => {
        const row = document.createElement('tr');

        // Buat opsi dropdown berdasarkan role pengguna
        const dropdownOptions = generateDropdownOptions(user.role, user._id);

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.name || "Nama Tidak Diketahui"}</td>
            <td>${user.email || "Email Tidak Diketahui"}</td>
            <td id="role-user-${user._id || "-"}">${user.role || "Peran Tidak Diketahui"}</td>
            <td>${user.phonenumber || "Nomor Telepon Tidak Diketahui"}</td>
            <td>
                <button class="btn btn-primary" onclick="toggleDropdown('${user._id}')">Role</button>
                <div id="dropdown-${user._id}" class="dropdown-menu" style="display: none;">
                    ${dropdownOptions}
                </div>
            </td>
        `;
        container.appendChild(row);
    });
}

// Fungsi untuk menghasilkan opsi dropdown berdasarkan role
function generateDropdownOptions(currentRole, userId) {
    const roleMap = {
        admin: ['dosen', 'user'],
        dosen: ['admin', 'user'],
        user: ['admin', 'dosen']
    };

    const options = roleMap[currentRole] || [];

    return options
        .map(role => `<button class='dropdown-item' onclick="handleRoleChange('${userId}', '${role}')">${role}</button>`) // Buat opsi
        .join('');
}

// Fungsi untuk menangani perubahan role pengguna
function handleRoleChange(userId, newRole) {
    // Logika untuk mengupdate role pengguna
    console.log(`User ID: ${userId}, Role Baru: ${newRole}`);
    // Tambahkan logika pengiriman data ke server jika diperlukan
}

// Fungsi untuk menampilkan atau menyembunyikan dropdown
function toggleDropdown(userId) {
    const dropdown = document.getElementById(`dropdown-${userId}`);
    if (dropdown.style.display === "none") {
        dropdown.style.display = "block";
    } else {
        dropdown.style.display = "none";
    }
}
