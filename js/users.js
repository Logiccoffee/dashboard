// Mengimpor modul eksternal
import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import { setInner } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import { redirect } from "https://cdn.jsdelivr.net/gh/jscroot/url@0.0.9/croot.js";

// Cek apakah cookie login ada, jika tidak arahkan ke halaman utama
if (getCookie("login") === "") {
    console.log("Cookie login tidak ditemukan. Mengarahkan ke halaman utama.");
    redirect("/");
}

// Mulai pengambilan data pengguna menggunakan API
console.log("Memulai pengambilan data pengguna...");
fetch("https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/users", {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        login: getCookie("login"), // Kirim cookie sebagai header
    },
})
    .then((response) => {
        console.log("Status respons API:", response.status);
        if (!response.ok) {
            throw new Error(`Gagal mengambil data. Status: ${response.status}`);
        }
        return response.json();
    })
    .then((result) => {
        console.log("Respons API diterima:", result);

        // Cek jika pengguna tidak ditemukan
        if (result.status === 404) {
            console.log("Pengguna tidak ditemukan. Mengarahkan ke halaman pendaftaran.");
            setInner("content", "Silahkan lakukan pendaftaran terlebih dahulu.");
            redirect("/register");
            return;
        }

        // Proses data pengguna
        processUserData(result.data);
    })
    .catch((error) => {
        console.error("Terjadi kesalahan saat memproses data pengguna:", error.message);
        setInner("content", "Terjadi kesalahan saat memproses data.");
    });

// Fungsi untuk memproses data pengguna
function processUserData(userData) {
    try {
        if (!userData) {
            throw new Error("Data pengguna tidak ditemukan!");
        }

        console.log("Memproses data pengguna:", userData);

        if (Array.isArray(userData)) {
            console.log("Data pengguna adalah array.");
            userData.forEach((user, index) => {
                addUserRow(user, index); // Tambahkan baris untuk setiap pengguna
            });
        } else if (typeof userData === "object" && userData !== null) {
            console.log("Data pengguna adalah objek tunggal.");
            addUserRow(userData, 0); // Tambahkan satu baris untuk objek pengguna tunggal
        } else {
            throw new Error("Data pengguna bukan array atau objek!");
        }
    } catch (error) {
        console.error("Kesalahan saat memproses data pengguna:", error.message);
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
