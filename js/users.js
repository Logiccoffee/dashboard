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

        // Buat opsi dropdown berdasarkan role pengguna
        const dropdownOptions = generateDropdownOptions(user.role);

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.name || "Nama Tidak Diketahui"}</td>
            <td>${user.email || "Email Tidak Diketahui"}</td>
            <td id="role-user-${user._id || "-"}">${user.role || "Peran Tidak Diketahui"}</td>
            <td>${user.phonenumber || "Nomor Telepon Tidak Diketahui"}</td>
            <td>
                <select onchange="handleRoleChange('${user._id}', this.value)">
                    ${dropdownOptions}
                </select>
            </td>
        `;
        container.appendChild(row);
    });
}

// Fungsi untuk menghasilkan opsi dropdown berdasarkan role
function generateDropdownOptions(currentRole) {
    const roles = ['admin', 'dosen', 'user'];
    return roles
        .filter(role => role !== currentRole) // Hapus role yang sama dengan pengguna saat ini
        .map(role => `<option value="${role}">${role}</option>`) // Buat opsi
        .join('');
}

// Fungsi untuk menangani perubahan role pengguna
function handleRoleChange(userId, newRole) {
    // Log perubahan untuk debugging
    console.log(`User ID: ${userId}, Role Baru: ${newRole}`);

    // Data yang akan dikirim ke server
    const updatedData = {
        role: newRole
    };

    // Kirim permintaan PUT ke server
    fetch(`https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Gagal memperbarui role pengguna');
        }
        return response.json();
    })
    .then(data => {
        console.log('Role berhasil diperbarui:', data);

        // Perbarui tampilan role di tabel jika perlu
        const roleCell = document.getElementById(`role-user-${userId}`);
        if (roleCell) {
            roleCell.textContent = newRole;
        }
    })
    .catch(error => {
        console.error('Terjadi kesalahan saat memperbarui role:', error);
        alert('Gagal memperbarui role. Coba lagi nanti.');
    });
}
