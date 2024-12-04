// Fungsi untuk memuat daftar pesanan
// Fungsi untuk memuat daftar pesanan
const loadOrders = async () => {
    try {
        // URL API
        const apiURL = "https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/order";

        // Token login
        const token = "v4.public.eyJhbGlhcyI6IlNpbmR5IE1hdWxpbmEiLCJleHAiOiIyMDI0LTEyLTA1VDAxOjE2OjQ5WiIsImlhdCI6IjIwMjQtMTItMDRUMDc6MTY6NDlaIiwiaWQiOiI2MjgzMTk1ODAwMDIyIiwibmJmIjoiMjAyNC0xMi0wNFQwNzoxNjo0OVoifc0-IoeTaYbb8tA78VlO43Soou_BsdMHdGdscbHpJZVUri5wMo3h7Mq9zTSO4Zx8i66vDvt4nvAPEekOMYPskQ4";

        // Melakukan permintaan GET ke API dengan header login
        const response = await fetch(apiURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'login': token, // Mengirim token sebagai header login
            },
        });

        // Cek status respons
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        // Parsing respons JSON
        const orders = await response.json();
        console.log("Data pesanan berhasil diambil:", orders);

        const transactionList = document.getElementById("transaction-list");
        transactionList.innerHTML = ""; // Kosongkan daftar sebelumnya

        // Cek jika tidak ada data pesanan
        if (orders.length === 0) {
            Swal.fire("Info", "Tidak ada data pesanan untuk ditampilkan.", "info");
            return;
        }

        // Loop melalui data pesanan dan tampilkan dalam tabel
        orders.forEach((order, index) => {
            const row = `
                <tr>
                    <td>${order.kodeTransaksi || "Tidak Ada"}</td>
                    <td>${index + 1}</td>
                    <td>${order.namaProduk || "Tidak Ada"}</td>
                    <td>${order.jumlah} x ${order.hargaSatuan || 0}</td>
                    <td>${order.hargaTotal || 0}</td>
                    <td>${order.metodePembayaran || "Tidak Ada"}</td>
                    <td>${order.status || "Tidak Ada"}</td>
                    <td>
                        <button class="btn btn-primary">Detail</button>
                    </td>
                </tr>
            `;
            transactionList.innerHTML += row;
        });
    } catch (error) {
        console.error("Error:", error.message);
        Swal.fire("Error", `Gagal mengambil data pesanan: ${error.message}`, "error");
    }
};

// Memuat daftar pesanan saat halaman selesai dimuat
document.addEventListener("DOMContentLoaded", loadOrders);
