// Mengimpor modul eksternal
import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import { setInner } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import { redirect } from "https://cdn.jsdelivr.net/gh/jscroot/url@0.0.9/croot.js";

// URL API untuk memperbarui data pengguna
const API_UPDATE_URL = "https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/users";

// Mendapatkan token dari cookie
const token = getCookie("login_token");

// Fungsi untuk mengubah peran pengguna
function changeRole(userId, newRole) {
    const roleElement = document.getElementById(`role-user-${userId}`);
    if (!roleElement) {
        console.error(`Elemen role untuk userId ${userId} tidak ditemukan.`);
        return;
    }

    // Tampilkan loader sementara role sedang diubah
    roleElement.textContent = "Mengubah...";

    // Kirim permintaan PATCH ke server untuk memperbarui role
    fetch(`${API_UPDATE_URL}/${userId}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Pastikan token dikirim jika diperlukan
        },
        body: JSON.stringify({ role: newRole }) // Kirim role baru
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Gagal memperbarui role pengguna");
            }
            return response.json();
        })
        .then(data => {
            // Perbarui UI setelah berhasil
            roleElement.textContent = newRole; // Tampilkan role baru
            alert(`Peran pengguna dengan ID ${userId} telah diubah menjadi ${newRole}`); // Beri notifikasi
            populateDropdown(userId, newRole); // Isi ulang dropdown
        })
        .catch(error => {
            console.error("Terjadi kesalahan:", error);
            roleElement.textContent = "Error"; // Tampilkan pesan error sementara
            alert("Gagal mengubah peran pengguna. Silakan coba lagi.");
        });
}

// Fungsi untuk menampilkan data pengguna di tabel
function displayUsers(users) {
    const container = document.getElementById('user-list');
    if (!container) {
        console.error("Elemen dengan ID 'user-list' tidak ditemukan.");
        return;
    }

    container.innerHTML = ''; // Hapus data lama jika ada

    users.forEach((user, index) => {
        const userId = user._id || "-";
        const userRole = user.role || "Peran Tidak Diketahui";

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td> <!-- Nomor urut -->
            <td>${user.name || "Nama Tidak Diketahui"}</td>
            <td>${user.email || "Email Tidak Diketahui"}</td>
            <td id="role-user-${userId}">${userRole}</td>
            <td>${user.phonenumber || "Nomor Telepon Tidak Diketahui"}</td>
            <td>
                <div class="dropdown">
                    <button class="btn btn-primary dropdown-toggle" type="button"
                        id="dropdownMenuButton-${userId}" data-bs-toggle="dropdown" aria-expanded="false">
                        Role
                    </button>
                    <ul class="dropdown-menu" id="dropdown-role-${userId}" aria-labelledby="dropdownMenuButton-${userId}">
                    </ul>
                </div>
            </td>
        `;
        container.appendChild(row);

        // Tambahkan opsi dropdown untuk role
        populateDropdown(userId, userRole);
    });

    // Pasang event delegation untuk menangani klik pada dropdown
    container.addEventListener('click', (event) => {
        if (event.target.matches('.dropdown-item')) {
            const userId = event.target.dataset.userId;
            const newRole = event.target.dataset.role;

            // Ubah peran pengguna
            changeRole(userId, newRole);
        }
    });
}

// Fungsi untuk mengisi dropdown dengan opsi peran
function populateDropdown(userId, currentRole) {
    const dropdownMenu = document.getElementById(`dropdown-role-${userId}`);
    if (!dropdownMenu) {
        console.error(`Dropdown menu untuk userId ${userId} tidak ditemukan.`);
        return;
    }

    dropdownMenu.innerHTML = ''; // Kosongkan opsi sebelumnya

    // Tentukan opsi berdasarkan currentRole
    const roleMapping = {
        admin: ["user", "dosen"],
        user: ["admin", "dosen"],
        dosen: ["admin", "user"]
    };

    const filteredRoles = roleMapping[currentRole] || [];
    filteredRoles.forEach((role) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <a class="dropdown-item" href="#" data-user-id="${userId}" data-role="${role}">
                <i class="fas fa-user text-primary"></i> Jadikan Sebagai ${role}
            </a>`;
        dropdownMenu.appendChild(listItem);
    });
}
