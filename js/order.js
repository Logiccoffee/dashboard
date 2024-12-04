// Fungsi untuk memuat data pesanan
const loadOrders = async () => {
    try {
        // URL API untuk mengambil data pesanan
        const apiURL = "https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/order";

        // Fetch data dari API
        const response = await fetch(apiURL);

        // Jika respon tidak OK, lempar error
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        // Parse data JSON dari respon
        const orders = await response.json();

        // Debugging: Cek data pesanan di console
        console.log("Data pesanan berhasil diambil:", orders);

        // Ambil elemen tbody untuk menampilkan data
        const transactionList = document.getElementById("transaction-list");

        // Kosongkan isi tbody sebelum memasukkan data baru
        transactionList.innerHTML = "";

        // Jika tidak ada data, tampilkan pesan kosong
        if (orders.length === 0) {
            Swal.fire("Info", "Tidak ada data pesanan untuk ditampilkan.", "info");
            return;
        }

        // Iterasi data pesanan dan masukkan ke tabel
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
        // Tampilkan error di console
        console.error("Error:", error.message);

        // Beri notifikasi error ke user
        Swal.fire("Error", `Gagal mengambil data pesanan: ${error.message}`, "error");
    }
};

// Panggil fungsi loadOrders saat halaman dimuat
document.addEventListener("DOMContentLoaded", loadOrders);
