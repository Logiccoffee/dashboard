// Fungsi untuk dropdown nama pengguna
document.addEventListener("DOMContentLoaded", function () {
    const profileDropdown = document.getElementById("profileDropdown");
    const dropdownMenu = profileDropdown.nextElementSibling;

    profileDropdown.addEventListener("click", function (event) {
        event.preventDefault();
        dropdownMenu.classList.toggle("show");
    });

    // Tutup dropdown jika klik di luar
    document.addEventListener("click", function (event) {
        if (!profileDropdown.contains(event.target)) {
            dropdownMenu.classList.remove("show");
        }
    });
});

// Fungsi untuk tombol dropdown cetak
document.addEventListener("DOMContentLoaded", function () {
    const cetakQris = document.getElementById("cetakQris");
    const cetakCash = document.getElementById("cetakCash");

    cetakQris.addEventListener("click", function () {
        alert("Fungsi Cetak QRIS diaktifkan!");
        // Tambahkan logika cetak QRIS di sini
    });

    cetakCash.addEventListener("click", function () {
        alert("Fungsi Cetak Cash diaktifkan!");
        // Tambahkan logika cetak Cash di sini
    });
});
