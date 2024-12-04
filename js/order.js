// URL API
const apiUrl = "https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/order";

// Fungsi untuk memuat data pesanan
async function loadOrders() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("Gagal mengambil data pesanan");
        }

        const orders = await response.json(); // Mengambil data JSON dari API
        const transactionList = document.getElementById("transaction-list");
        transactionList.innerHTML = ""; // Membersihkan isi sebelumnya

        // Iterasi data pesanan untuk ditampilkan
        orders.forEach((order, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${order.orderNumber || "N/A"}</td>
                <td>${order.queueNumber || "N/A"}</td>
                <td>
                    ${order.orders.map(item => `<div>${item.product_name || "Produk"} (${item.quantity || 0}x)</div>`).join("")}
                </td>
                <td>
                    ${order.orders.map(item => `<div>${item.price || 0} IDR</div>`).join("")}
                </td>
                <td>${order.total || 0} IDR</td>
                <td>${order.payment_method || "Tidak diketahui"}</td>
                <td>
                    <span class="status-field">${order.status || "Tidak diketahui"}</span>
                </td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="viewOrderDetails('${order.id}')">
                        <i class="fa fa-eye"></i> Detail
                    </button>
                </td>
            `;

            transactionList.appendChild(row);
        });
    } catch (error) {
        console.error("Error:", error);
        Swal.fire("Gagal Memuat Data", "Terjadi kesalahan saat mengambil data pesanan", "error");
    }
}

// Fungsi untuk melihat detail pesanan
function viewOrderDetails(orderId) {
    Swal.fire({
        title: "Detail Pesanan",
        text: `Pesanan dengan ID ${orderId} sedang dalam pengembangan`,
        icon: "info",
        confirmButtonText: "OK"
    });
}

// Memuat data ketika halaman selesai dimuat
document.addEventListener("DOMContentLoaded", () => {
    loadOrders();
});
