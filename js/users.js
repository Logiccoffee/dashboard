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
        row.innerHTML = `
            <td>${index + 1}</td>
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
                    <ul class="dropdown-menu" id="dropdown-role-${user._id}" aria-labelledby="dropdownMenuButton-${user._id}"></ul>
                </div>
            </td>
        `;
        container.appendChild(row);

        // Tambahkan opsi dropdown
        const roles = ["user", "admin", "dosen"];
        populateDropdown(user._id, user.role, roles, users);
    });
}

// Fungsi untuk mengisi dropdown
function populateDropdown(userId, currentRole, roles, users) {
    const dropdownMenu = document.getElementById(`dropdown-role-${userId}`);
    if (!dropdownMenu) return;

    dropdownMenu.innerHTML = ''; // Kosongkan opsi sebelumnya

    const filteredRoles = roles.filter(role => role !== currentRole);
    filteredRoles.forEach((role) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <a class="dropdown-item" href="#">
                <i class="fas fa-user text-primary"></i> Jadikan Sebagai ${role}
            </a>`;
        listItem.addEventListener('click', (e) => {
            e.preventDefault();
            changeRole(userId, role, users);
        });
        dropdownMenu.appendChild(listItem);
    });
}

// Buat fungsi global untuk mengubah role
window.changeRole = function(userId, newRole, users) {
    const roleElement = document.getElementById(`role-user-${userId}`);
    if (!roleElement) return;

    roleElement.textContent = newRole;

    const userIndex = users.findIndex(user => user._id === userId);
    if (userIndex !== -1) {
        users[userIndex].role = newRole;
    }

    alert(`Peran pengguna dengan ID ${userId} telah diubah menjadi ${newRole}`);
    const roles = ["user", "admin", "dosen"];
    users.forEach(user => {
        populateDropdown(user._id, user.role, roles, users);
    });
};
