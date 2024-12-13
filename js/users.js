// Import modul eksternal
import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";

const API_URL = "https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/users";

// Ambil token dari cookie
const token = getCookie('login');
if (!token) {
    alert('Token tidak ditemukan, harap login terlebih dahulu!');
    throw new Error("Token tidak ditemukan. Harap login ulang.");
}

// Fungsi untuk menangani perubahan role pengguna
function handleRoleChange(userEmail, newRole) {
    console.log(`Mengubah role untuk email ${userEmail} menjadi ${newRole}`);

    fetch('https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/updateUserRole', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'login': token,
        },
        body: JSON.stringify({ email: userEmail, role: newRole }),
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorDetails => {
                    console.error("Detail error:", errorDetails);
                    throw new Error(`Gagal mengubah role: ${response.status}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log("Respons API berhasil:", data);
            alert(`Role berhasil diubah menjadi ${newRole}`);
            // Perbarui tabel di UI
            document.querySelector(`[data-email="${userEmail}"]`).textContent = newRole;
        })
        .catch(error => {
            console.error('Terjadi kesalahan:', error);
            alert('Terjadi kesalahan saat mengubah role.');
        });
}

// Fungsi untuk menghasilkan tabel pengguna
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
            <td data-email="${user.email}">${user.role || "Peran Tidak Diketahui"}</td>
            <td>${user.phonenumber || "Nomor Telepon Tidak Diketahui"}</td>
            <td>${generateDropdownMenu(user.email, user.role)}</td>
        `;
        container.appendChild(row);
    });
}

// Fungsi untuk menambahkan dropdown menu di setiap baris pengguna
function generateDropdownMenu(userEmail, currentRole) {
    const roles = ['admin', 'dosen', 'user'];
    const options = roles
        .filter(role => role !== currentRole)
        .map(role => `<li><a class="dropdown-item" href="#" data-email="${userEmail}" data-role="${role}">${role}</a></li>`)
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
    const target = event.target;
    if (target.matches('a[data-email]')) {
        event.preventDefault();
        const userEmail = target.getAttribute('data-email');
        const newRole = target.getAttribute('data-role');
        handleRoleChange(userEmail, newRole);
    }
});
