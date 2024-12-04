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

// Ambil data pengguna menggunakan API
getJSON("https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/user","login", getCookie("login"), responseFunction);

// Fungsi untuk menangani respons API
function responseFunction(result) {
    try {
        if (result.status === 404) {
            console.log("Pengguna tidak ditemukan. Mengarahkan ke halaman pendaftaran.");
            setInner("content", "Silahkan lakukan pendaftaran terlebih dahulu.");
            redirect("/register");
            return; // Menghentikan eksekusi setelah redirect
        }

        // Validasi dan proses data pengguna
        const userData = result.data;
        if (!userData) {
            throw new Error("Data pengguna tidak ditemukan!");
        }

        if (Array.isArray(userData)) {
            console.log("Data pengguna adalah array.");
            userData.forEach((user, index) => {
                console.log("Menambahkan pengguna:", user); // Debug untuk setiap pengguna
                addUserRow(user, index); // Tambahkan baris untuk setiap pengguna
            });
        } else if (typeof userData === "object" && userData !== null) {
            console.log("Data pengguna adalah objek tunggal.");
            addUserRow(userData, 0); // Tambahkan satu baris untuk objek pengguna tunggal
        } else {
            throw new Error("Data pengguna bukan array atau objek!");
        }

        console.log("Data pengguna berhasil diproses:", userData);
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
        <td id="role-user-${userData._id || "-"}">${userData.role || "Peran Tidak Diketahui"}</td>
        <td>${userData.phonenumber || "Nomor Telepon Tidak Diketahui"}</td>
        <td>
            <div class="dropdown">
                <button class="btn btn-primary dropdown-toggle" type="button"
                    id="dropdownMenuButton-${userData._id}" data-bs-toggle="dropdown" aria-expanded="false">
                    Role
                </button>
                <ul class="dropdown-menu" id="dropdown-role-${userData._id}" aria-labelledby="dropdownMenuButton-${userData._id}">
                    <!-- Opsi akan ditambahkan melalui JavaScript -->
                </ul>
            </div>
        </td>
    `;

    userList.appendChild(row); // Pastikan baris ditambahkan ke tabel

    // Tambahkan opsi ke dropdown
    populateDropdown(userData._id, userData.role, roles);
}

// Fungsi untuk mengisi dropdown dengan opsi peran
function populateDropdown(userId, currentRole, roles) {
    const dropdownMenu = document.getElementById(`dropdown-role-${userId}`);
    dropdownMenu.innerHTML = ""; // Kosongkan opsi sebelumnya

    // Menambahkan opsi ke dropdown jika peran berbeda
    roles.forEach((role) => {
        if (role !== currentRole) { // Jangan menambahkan peran yang sudah dipilih
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <a class="dropdown-item" href="#" onclick="changeRole('${userId}', '${role}')">
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
    alert(`Peran pengguna dengan ID ${userId} telah diubah menjadi ${newRole}`); // Pemberitahuan kepada pengguna

    // Perbarui opsi dropdown
    const roles = ["User", "Dosen", "Admin"];
    populateDropdown(userId, newRole, roles); // Isi dropdown kembali dengan peran yang tersedia
}
