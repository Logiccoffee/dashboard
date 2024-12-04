// Fungsi untuk menampilkan data pesanan di dalam tabel
function displayOrders(response) {
    const orderData = response.data.data; // Ambil data pesanan dari respons
    const container = document.getElementById('transaction-list'); // Ganti 'order-list' menjadi 'transaction-list'

    // Pastikan elemen container ditemukan
    if (!container) {
        console.error("Elemen dengan id 'transaction-list' tidak ditemukan.");
        return;
    }

    // Tampilkan data pesanan di dalam tabel
    container.innerHTML = ''; // Hapus data lama jika ada

    orderData.forEach((item, index) => {
        // Membuat baris untuk setiap pesanan
        const row = document.createElement('tr');

        // Kolom Nama Pesanan
        const nameCell = document.createElement('td');
        nameCell.textContent = item.name;

        // Kolom Total Harga
        const priceCell = document.createElement('td');
        priceCell.textContent = item.totalPrice;

        // Kolom Status
        const statusCell = document.createElement('td');
        statusCell.textContent = item.status;

        // Kolom Aksi
        const actionCell = document.createElement('td');
        actionCell.classList.add('text-center');

        // Tombol Ubah
        const editButton = document.createElement('button');
        editButton.className = 'btn btn-warning me-2';
        editButton.innerHTML = '<i class="fas fa-pen"></i> Ubah';
        editButton.addEventListener('click', () => {
            console.log(`Edit pesanan dengan index: ${index}`);
            currentEditIndex = index;

            // Menampilkan modal edit pesanan
            const modal = new bootstrap.Modal(document.getElementById('editOrderModal'));
            modal.show();

            document.getElementById('edit-order-name').value = orders[index].name;
            document.getElementById('edit-order-total').value = orders[index].totalPrice;
        });

        // Tombol Hapus
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger';
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i> Hapus';
        deleteButton.addEventListener('click', () => {
            console.log(`Hapus pesanan dengan index: ${index}`);
            currentDeleteIndex = index;

            // Menampilkan modal konfirmasi hapus
            const deleteOrderModal = new bootstrap.Modal(document.getElementById('deleteOrderModal'));
            deleteOrderModal.show();
        });

        // Tambahkan tombol ke kolom aksi
        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);

        // Tambahkan kolom ke dalam baris
        row.appendChild(nameCell);
        row.appendChild(priceCell);
        row.appendChild(statusCell);
        row.appendChild(actionCell);

        // Tambahkan baris ke dalam container
        container.appendChild(row);
    });
}
