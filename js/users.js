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
getJSON("https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/user", "login", getCookie("login"), responseFunction);

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
            const userData = result.data;

            // Baris tabel HTML untuk pengguna
            const userRow = `
                <tr>
                    <td>${userData.id || "-"}</td>
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
                                <li><a class="dropdown-item" href="#">Admin</a></li>
                                <li><a class="dropdown-item" href="#">User</a></li>
                            </ul>
                        </div>
                    </td>
                </tr>
            `;

            // Tambahkan baris ke tabel
            userList.innerHTML += userRow;
        }

        console.log("Data pengguna berhasil ditambahkan:", result.data);
    } catch (error) {
        console.error("Terjadi kesalahan saat memproses respons:", error.message);
        setInner("content", "Terjadi kesalahan saat memproses data.");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const roles = ["User", "Dosen", "Admin"];
    
    // Iterate over all rows to populate dropdown dynamically
    document.querySelectorAll("tbody tr").forEach((row) => {
        const userId = row.querySelector("td:nth-child(1)").textContent.trim(); // Get ID
        const currentRole = row.querySelector(`#role-user-${userId}`).textContent.trim(); // Get Current Role
        const dropdownMenu = document.querySelector(`#dropdown-role-${userId}`); // Dropdown Menu Element

        // Generate options based on current role
        roles.forEach((role) => {
            if (role !== currentRole) { // Exclude current role from dropdown
                const listItem = document.createElement("li");
                listItem.innerHTML = `
                    <a class="dropdown-item" href="#" onclick="changeRole(${userId}, '${role}')">
                        <i class="fas fa-user text-primary"></i> Jadikan Sebagai ${role}
                    </a>`;
                dropdownMenu.appendChild(listItem);
            }
        });
    });
});

// Function to handle role change
function changeRole(userId, newRole) {
    const roleElement = document.querySelector(`#role-user-${userId}`);
    roleElement.textContent = newRole; // Update role in UI
    alert(`Peran pengguna dengan ID ${userId} telah diubah menjadi ${newRole}`);

    // Update dropdown options dynamically after role change
    const dropdownMenu = document.querySelector(`#dropdown-role-${userId}`);
    dropdownMenu.innerHTML = ""; // Clear existing options
    const roles = ["User", "Dosen", "Admin"];
    roles.forEach((role) => {
        if (role !== newRole) { // Exclude new role from dropdown
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <a class="dropdown-item" href="#" onclick="changeRole(${userId}, '${role}')">
                    <i class="fas fa-user text-primary"></i> Jadikan Sebagai ${role}
                </a>`;
            dropdownMenu.appendChild(listItem);
        }
    });
}
