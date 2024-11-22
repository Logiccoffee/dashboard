// Fungsi untuk mengonversi gambar ke Base64 (agar gambar dapat disimpan di localStorage)
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Fungsi untuk menyimpan produk baru ke localStorage
document.getElementById('addProductForm').onsubmit = async function(event) {
    event.preventDefault();

    const productCategory = document.getElementById('productCategory').value;
    const productName = document.getElementById('product-name').value.trim();
    const productPrice = document.getElementById('product-price').value.trim();
    const productImage = document.getElementById('product-image').files[0];

    // Validasi input produk
    if (!productCategory || !productName || !productPrice || !productImage) {
        alert("Tolong lengkapi semua informasi produk.");
        return;
    }

    const newProduct = {
        category: productCategory,
        name: productName,
        price: productPrice,
        image: await getBase64(productImage), // Mengkonversi gambar ke base64
    };

    // Menyimpan produk ke localStorage
    const products = JSON.parse(localStorage.getItem('products')) || [];
    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));

    // Tampilkan SweetAlert setelah berhasil menyimpan
    Swal.fire({
        title: 'Sukses!',
        text: 'Produk berhasil ditambahkan!',
        icon: 'success',
        confirmButtonText: 'OK'
    }).then(() => {
        renderProductList(); // Perbarui daftar produk
        // Menutup modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
        modal.hide(); // Menutup modal setelah produk ditambahkan
    });
};

// Fungsi untuk menampilkan daftar produk
function renderProductList() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const productList = document.getElementById('productList');
    productList.innerHTML = ''; // Hapus daftar produk sebelumnya

    products.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4';
        card.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${product.image}" class="card-img-top" alt="${product.name}" style="height: 200px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text"><strong>Harga:</strong> Rp${product.price}</p>
                    <p class="card-text"><strong>Kategori:</strong> ${product.category}</p>
                </div>
                <div class="card-footer">
                    <button class="btn btn-warning btn-edit" onclick="openEditProductPopup(${index})">
                        <i class="fas fa-pen"></i> Ubah
                    </button>
                    <button class="btn btn-danger btn-delete" onclick="confirmDelete(${index})">
                        <i class="fas fa-trash-alt"></i> Hapus
                    </button>
                </div>
            </div>
        `;
        productList.appendChild(card);
    });
}

// Panggil fungsi renderProductList untuk menampilkan daftar produk saat halaman dimuat
document.addEventListener('DOMContentLoaded', renderProductList);

// Fungsi untuk menghapus produk
function confirmDelete(index) {
    Swal.fire({
        title: 'Yakin ingin menghapus produk?',
        text: "Data yang dihapus tidak dapat dikembalikan.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Hapus',
        cancelButtonText: 'Batal'
    }).then(result => {
        if (result.isConfirmed) {
            const products = JSON.parse(localStorage.getItem('products')) || [];
            products.splice(index, 1);
            localStorage.setItem('products', JSON.stringify(products));
            Swal.fire('Terhapus!', 'Produk telah dihapus.', 'success');
            renderProductList(); // Perbarui daftar produk setelah dihapus
        }
    });
}

// Fungsi untuk membuka modal edit produk dan mengisi data produk yang dipilih
function openEditProductPopup(index) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products[index];

    // Mengisi data produk ke dalam formulir edit
    document.getElementById('edit-product-name').value = product.name;
    document.getElementById('edit-product-category').value = product.category;
    document.getElementById('edit-product-price').value = product.price;
    // Menyimpan index produk untuk digunakan saat menyimpan perubahan
    document.getElementById('editProductForm').setAttribute('data-index', index);

    // Menampilkan modal edit
    const modal = new bootstrap.Modal(document.getElementById('editProductModal'));
    modal.show();
}

// Fungsi untuk menyimpan perubahan produk
document.getElementById('editProductForm').onsubmit = async function(event) {
    event.preventDefault();

    const index = document.getElementById('editProductForm').getAttribute('data-index');
    const productCategory = document.getElementById('edit-product-category').value.trim();
    const productName = document.getElementById('edit-product-name').value.trim();
    const productPrice = document.getElementById('edit-product-price').value.trim();
    const productImage = document.getElementById('edit-product-image').files[0];

    // Validasi input produk
    if (!productCategory || !productName || !productPrice || !productImage) {
        alert("Tolong lengkapi semua informasi produk.");
        return;
    }

    // Mengambil produk dari localStorage
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const updatedProduct = {
        category: productCategory,
        name: productName,
        price: productPrice,
        image: await getBase64(productImage), // Mengkonversi gambar ke base64
    };

    // Update produk di array
    products[index] = updatedProduct;

    // Simpan kembali ke localStorage
    localStorage.setItem('products', JSON.stringify(products));

    // Menampilkan SweetAlert setelah berhasil mengedit
    Swal.fire({
        title: 'Sukses!',
        text: 'Produk berhasil diperbarui!',
        icon: 'success',
        confirmButtonText: 'OK'
    }).then(() => {
        renderProductList(); // Perbarui daftar produk
        const modal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
        modal.hide(); // Menutup modal setelah produk diperbarui
    });
};
