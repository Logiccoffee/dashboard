// Fungsi untuk memuat daftar pesanan
const loadOrders = async () => {
    try {
        const apiURL = "https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/order";

        // Gantilah token ini dengan cara yang lebih aman
        const token = "v4.public.eyJhbGlhcyI6IlNpbmR5IE1hdWxpbmEiLCJleHAiOiIyMDI0LTEyLTA1VDAxOjE2OjQ5WiIsImlhdCI6IjIwMjQtMTItMDRUMDc6MTY6NDlaIiwiaWQiOiI2MjgzMTk1ODAwMDIyIiwibmJmIjoiMjAyNC0xMi0wNFQwNzoxNjo0OVoifc0-IoeTaYbb8tA78VlO43Soou_BsdMHdGdscbHpJZVUri5wMo3h7Mq9zTSO4Zx8i66vDvt4nvAPEekOMYPskQ4";

        // Menampilkan loading spinner
        const transactionList = document.getElementById("transaction-list");
        transactionList.innerHTML = "<tr><td colspan='8' class='text-center'>Loading...</td></tr>";

        const response = await fetch(apiURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'login': token,
            },
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("Data pesanan berhasil diambil:", result);

        const orders = result.data || []; // Pastikan array ada, jika tidak kosongkan
        transactionList.innerHTML = ""; // Hapus loading spinner

        if (orders.length === 0) {
            Swal.fire("Info", "Tidak ada data pesanan untuk ditampilkan.", "info");
            transactionList.innerHTML = "<tr><td colspan='8' class='text-center'>Tidak ada pesanan</td></tr>";
            return;
        }

        // Membuat baris pesanan
        orders.forEach((order, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${order.kodeTransaksi || "Tidak Ada"}</td>
                <td>${index + 1}</td>
                <td>${order.namaProduk || "Tidak Ada"}</td>
                <td>${order.jumlah} x ${formatRupiah(order.hargaSatuan || 0)}</td>
                <td>${formatRupiah(order.hargaTotal || 0)}</td>
                <td>${order.metodePembayaran || "Tidak Ada"}</td>
                <td>${order.status || "Tidak Ada"}</td>
                <td>
                    <button class="btn btn-primary btn-detail" data-id="${order.id}">Detail</button>
                </td>
            `;

            transactionList.appendChild(row);
        });

        // Tambahkan event listener untuk tombol Detail
        document.querySelectorAll(".btn-detail").forEach((button) => {
            button.addEventListener("click", (event) => {
                const orderId = event.target.getAttribute("data-id");
                showOrderDetail(orderId);
            });
        });
    } catch (error) {
        console.error("Error:", error.message);
        Swal.fire("Error", `Gagal mengambil data pesanan: ${error.message}`, "error");

        // Tampilkan pesan error di tabel
        const transactionList = document.getElementById("transaction-list");
        transactionList.innerHTML = "<tr><td colspan='8' class='text-center text-danger'>Gagal memuat data</td></tr>";
    }
};

// Fungsi untuk memformat angka menjadi format Rupiah
const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
    }).format(angka);
};

// Fungsi untuk menampilkan detail pesanan
const showOrderDetail = (orderId) => {
    Swal.fire("Info", `Menampilkan detail untuk pesanan ID: ${orderId}`, "info");
};

// Panggil fungsi saat halaman selesai dimuat
document.addEventListener("DOMContentLoaded", loadOrders);
