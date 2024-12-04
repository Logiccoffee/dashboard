// Pastikan SweetAlert2 sudah dimuat dengan benar di HTML
import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11';

// Fungsi untuk mengambil dan menampilkan data pesanan
const loadOrders = async () => {
    try {
        // Gantilah API URL sesuai dengan URL yang benar
        const apiURL = "https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/order";

        // Lakukan permintaan GET ke API
        const response = await fetch(apiURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Jika API memerlukan header autentikasi, masukkan di sini
                // 'Authorization': 'Bearer <API_KEY>' 
            },
        });

        // Jika response tidak berhasil, lemparkan error
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        // Ambil data dalam format JSON
        const orders = await response.json();
        console.log("Data pesanan berhasil diambil:", orders);

        // Ambil elemen tbody untuk menampilkan data pesanan
        const transactionList = document.getElementById("transaction-list");
        transactionList.innerHTML = "";  // Bersihkan data sebelumnya

        if (orders.length === 0) {
            Swal.fire("Info", "Tidak ada data pesanan untuk ditampilkan.", "info");
            return;
        }

        // Loop untuk menampilkan setiap pesanan
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
            // Tambahkan row baru ke dalam tbody
            transactionList.innerHTML += row;
        });
    } catch (error) {
        console.error("Error:", error.message);
        Swal.fire("Error", `Gagal mengambil data pesanan: ${error.message}`, "error");
    }
};

// Pastikan untuk menjalankan fungsi loadOrders setelah halaman selesai dimuat
document.addEventListener("DOMContentLoaded", loadOrders);
