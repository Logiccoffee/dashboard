// Mengimpor modul eksternal
import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import { setInner } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import { redirect } from "https://cdn.jsdelivr.net/gh/jscroot/url@0.0.9/croot.js";

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
        // Periksa status 'success' pada response
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

    // Pastikan elemen container ditemukan
    if (!container) {
        console.error("Elemen dengan ID 'user-list' tidak ditemukan.");
        return;
    }

    // Hapus data lama jika ada
    container.innerHTML = '';

    // Tampilkan data pengguna
    users.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td> <!-- Nomor urut -->
            <td>${user.name || "Nama Tidak Diketahui"}</td>
            <td>${user.email || "Email Tidak Diketahui"}</td>
            <td id="role-user-${user._id || "-"}">${user.role || "Peran Tidak Diketahui"}</td>
            <td>${user.phonenumber || "Nomor Telepon Tidak Diketahui"}</td>
            <td>
                <div class="dropdown">
                    <button class="btn btn-primary dropdown-toggle" type="button"
                        id="dropdownMenuButton-${user._id}" data-bs-toggle="dropdown" aria-expanded="false">
                        Role
                    </button>
                    <ul class="dropdown-menu" id="dropdown-role-${user._id}" aria-labelledby="dropdownMenuButton-${user._id}">
                    </ul>
                </div>
            </td>
        `;
        container.appendChild(row);

        // Tambahkan opsi dropdown untuk role
        const roles = ["user", "admin", "dosen"];
        populateDropdown(user._id, user.role, roles, users);
    });
}

// Fungsi untuk mengisi dropdown dengan opsi peran
function populateDropdown(userId, currentRole, roles, users) {
    const dropdownMenu = document.getElementById(`dropdown-role-${userId}`);
    if (!dropdownMenu) {
        console.error(`Dropdown menu untuk userId ${userId} tidak ditemukan.`);
        return;
    }

    dropdownMenu.innerHTML = ''; // Kosongkan opsi sebelumnya

    // Tentukan opsi berdasarkan currentRole
    let filteredRoles = [];
    if (currentRole === "admin") {
        filteredRoles = roles.filter(role => role === "user" || role === "dosen");
    } else if (currentRole === "user") {
        filteredRoles = roles.filter(role => role === "admin" || role === "dosen");
    } else if (currentRole === "dosen") {
        filteredRoles = roles.filter(role => role === "admin" || role === "user");
    }

    // Tambahkan opsi dropdown
    filteredRoles.forEach((role) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <a class="dropdown-item" href="#" onclick="changeRole('${userId}', '${role}', users)">
                <i class="fas fa-user text-primary"></i> Jadikan Sebagai ${role}
            </a>`;
        dropdownMenu.appendChild(listItem);
    });
}

// Fungsi untuk mengubah peran pengguna
function changeRole(userId, newRole, users) {
    const roleElement = document.getElementById(`role-user-${userId}`);
    if (!roleElement) {
        console.error(`Elemen role untuk userId ${userId} tidak ditemukan.`);
        return;
    }

    roleElement.textContent = newRole; // Perbarui peran di UI

    // Update role di array pengguna
    const userIndex = users.findIndex(user => user._id === userId);
    if (userIndex !== -1) {
        users[userIndex].role = newRole; // Update role pada data pengguna
    }

    alert(`Peran pengguna dengan ID ${userId} telah diubah menjadi ${newRole}`); // Pemberitahuan kepada pengguna

    // Perbarui opsi dropdown
    const roles = ["user", "admin", "dosen"];
    users.forEach(user => {
        populateDropdown(user._id, user.role, roles, users); // Isi ulang dropdown untuk semua pengguna
    });
}
