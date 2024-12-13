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
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.name || "Nama Tidak Diketahui"}</td>
            <td>${user.email || "Email Tidak Diketahui"}</td>
            <td id="role-user-${user._id || "-"}">${user.role || "Peran Tidak Diketahui"}</td>
            <td>${user.phonenumber || "Nomor Telepon Tidak Diketahui"}</td>
            <td>
                <select class="form-select" aria-label="Aksi" onchange="updateRole('${user._id}', this.value)">
                    ${getRoleOptions(user.role)}
                </select>
            </td>
        `;
        container.appendChild(row);
    });
}

// Fungsi untuk mendapatkan opsi role berdasarkan role pengguna saat ini
function getRoleOptions(currentRole) {
    const roles = ["admin", "dosen", "user"];
    return roles
        .filter(role => role !== currentRole) // Hapus role saat ini dari opsi
        .map(role => `<option value="${role}">${capitalize(role)}</option>`) // Buat opsi dropdown
        .join('');
}

// Fungsi untuk mengubah role pengguna di server
function updateRole(userId, newRole) {
    fetch(`${API_URL}/${userId}`, {
        method: 'PUT',
        headers: {
            'login': token,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole })
    })
        .then(response => response.json())
        .then(response => {
            if (response.status === "success") {
                alert("Role berhasil diperbarui!");
                location.reload(); // Muat ulang halaman untuk memperbarui tampilan
            } else {
                console.error(`Error: ${response.status}`);
                alert("Gagal memperbarui role. Silakan coba lagi.");
            }
        })
        .catch(error => {
            console.error("Error updating role: ", error);
            alert("Terjadi kesalahan saat memperbarui role.");
        });
}

// Fungsi untuk mengubah teks menjadi kapitalisasi huruf pertama
function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
