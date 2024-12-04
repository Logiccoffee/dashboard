// Mengimpor modul eksternal
import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import { setInner } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import { redirect } from "https://cdn.jsdelivr.net/gh/jscroot/url@0.0.9/croot.js";

// Cek apakah cookie login ada, jika tidak arahkan ke halaman utama
if (getCookie("login") === "") {
    console.log("Cookie login tidak ditemukan. Mengarahkan ke halaman utama.");
    redirect("/");
}

// Fungsi untuk menangani respons API
function responseFunction(result) {
    try {
        if (result.status === 404) {
            console.log("Pengguna tidak ditemukan. Mengarahkan ke halaman pendaftaran.");
            setInner("content", "Silahkan lakukan pendaftaran terlebih dahulu.");
            redirect("/register");
            return;
        }

        // Menampilkan data pengguna di tabel
        const userList = document.getElementById("user-list");

        if (userList) {
            // Pastikan result.data adalah array
            const userData = Array.isArray(result.data) ? result.data : [result.data];

            // Tambahkan pengguna ke tabel
            userData.forEach((user, index) => addUserRow(user, index));
        }

        console.log("Data pengguna berhasil ditambahkan:", result.data);
    } catch (error) {
        console.error("Terjadi kesalahan saat memproses respons:", error.message);
        setInner("content", "Terjadi kesalahan saat memproses data.");
    }
}

// Fungsi untuk menambahkan baris pengguna ke tabel
function addUserRow(userData, index) {
    const userList = document.getElementById("user-list");
    const roles = ["User", "Dosen", "Admin"];

    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${index + 1}</td> <!-- Nomor urut berdasarkan indeks -->
        <td>${userData.name || "Nama Tidak Diketahui"}</td>
        <td>${userData.email || "Email Tidak Diketahui"}</td>
        <td id="role-user-${userData.id || "-"}">${userData.role || "Peran Tidak Diketahui"}</td>
        <td>${userData.phone || "Nomor Telepon Tidak Diketahui"}</td>
        <td>
            <div class="dropdown">
                <button class="btn btn-primary dropdown-toggle" type="button"
                    id="dropdownMenuButton-${userData.id}" data-bs-toggle="dropdown" aria-expanded="false">
                    Role
                </button>
                <ul class="dropdown-menu" id="dropdown-role-${userData.id}" aria-labelledby="dropdownMenuButton-${userData.id}">
                    <!-- Opsi akan ditambahkan melalui JavaScript -->
                </ul>
            </div>
        </td>
    `;

    userList.appendChild(row);

    // Tambahkan opsi ke dropdown
    populateDropdown(userData.id, userData.role, roles);
}

// Fungsi untuk mengisi dropdown dengan opsi peran
function populateDropdown(userId, currentRole, roles) {
    const dropdownMenu = document.getElementById(`dropdown-role-${userId}`);
    dropdownMenu.innerHTML = ""; // Kosongkan opsi sebelumnya

    roles.forEach((role) => {
        if (role !== currentRole) {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <a class="dropdown-item" href="#" onclick="changeRole(${userId}, '${role}')">
                    <i class="fas fa-user text-primary"></i> Jadikan Sebagai ${role}
                </a>`;
            dropdownMenu.appendChild(listItem);
        }
    });
}

// Fungsi untuk mengubah peran pengguna
function changeRole(userId, newRole) {
    const roleElement = document.getElementById(`role-user-${userId}`);
    roleElement.textContent = newRole; // Perbarui peran di UI
    alert(`Peran pengguna dengan ID ${userId} telah diubah menjadi ${newRole}`);

    // Perbarui opsi dropdown
    const roles = ["User", "Dosen", "Admin"];
    populateDropdown(userId, newRole, roles);
}

// Ambil data pengguna menggunakan API
getJSON("https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/users", "login", getCookie("login"), responseFunction);
