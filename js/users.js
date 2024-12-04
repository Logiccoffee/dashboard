// Data pengguna
const users = [
    {
        id: 1,
        username: "Johndoe",
        email: "johndoe@example.com",
        phone: "(123) 456-7890",
        role: "User",
        // image: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    // Tambahkan data pengguna lainnya di sini...
];

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
