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

document.addEventListener("DOMContentLoaded", function () {
    const dropdownItems = document.querySelectorAll(".dropdown-menu .dropdown-item");

    dropdownItems.forEach((item) => {
        item.addEventListener("click", function (event) {
            event.preventDefault(); // Hindari tindakan default
            if (this.id === "cetakQris") {
                alert("Fungsi Cetak QRIS diaktifkan!");
                // Logika cetak QRIS bisa ditambahkan di sini
                cetakLaporan("QRIS");
            } else if (this.id === "cetakCash") {
                alert("Fungsi Cetak Cash diaktifkan!");
                // Logika cetak Cash bisa ditambahkan di sini
                cetakLaporan("Cash");
            }
        });
    });

    // Fungsi cetak laporan
    function cetakLaporan(jenis) {
        console.log(`Mencetak laporan untuk metode: ${jenis}`);
        // Tambahkan logika cetak di sini (misalnya, generate PDF atau buka halaman print)
    }
});


// document.addEventListener("DOMContentLoaded", function () {
//     const dropdownItems = document.querySelectorAll(".dropdown-menu .dropdown-item");

//     dropdownItems.forEach((item) => {
//         item.addEventListener("click", function (event) {
//             event.preventDefault(); // Hindari tindakan default tombol
//             console.log(`Clicked: ${this.id}`); // Debugging
//             if (this.id === "cetakQris") {
//                 alert("Fungsi Cetak QRIS diaktifkan!");
//                 // Tambahkan logika cetak QRIS di sini
//             } else if (this.id === "cetakCash") {
//                 alert("Fungsi Cetak Cash diaktifkan!");
//                 // Tambahkan logika cetak Cash di sini
//             }
//         });
//     });
// });
