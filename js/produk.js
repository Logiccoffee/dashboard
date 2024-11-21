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

// Fungsi untuk membuka modal edit produk dan memuat data produk yang dipilih
function openEditProductModal(productId) {
    // Mendapatkan data produk berdasarkan ID produk
    const product = getProductById(productId);

    if (product) {
        // Memasukkan data produk ke dalam form modal edit
        document.getElementById('editProductCategory').value = product.category;
        document.getElementById('edit-product-name').value = product.name;
        document.getElementById('edit-product-price').value = product.price;

        // Menampilkan modal edit produk menggunakan API bootstrap
        const editProductModal = new bootstrap.Modal(document.getElementById('editProductModal'));
        editProductModal.show();
    } else {
        console.error('Produk tidak ditemukan');
    }
}

// Contoh data produk (data statis atau bisa didapat dari API)
const products = [
    { id: 1, name: 'Cappuccino', category: 'Hot', price: 50000 },
    { id: 2, name: 'Iced Latte', category: 'Ice', price: 60000 },
    { id: 3, name: 'Brownies', category: 'Dessert', price: 25000 }
];

// Fungsi untuk mendapatkan produk berdasarkan ID
function getProductById(productId) {
    return products.find(product => product.id === parseInt(productId));
}

// Fungsi untuk menyimpan perubahan produk
document.getElementById('editProductForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const updatedProduct = {
        id: 1, // Misalnya ID produk yang diedit, ini bisa didapat dari data yang diambil sebelumnya
        name: document.getElementById('edit-product-name').value,
        category: document.getElementById('editProductCategory').value,
        price: parseFloat(document.getElementById('edit-product-price').value)
    };

    // Simulasi update produk (bisa menggunakan API atau menyimpan ke array produk)
    console.log('Produk yang diperbarui:', updatedProduct);

    // Menutup modal setelah menyimpan perubahan
    const editProductModal = new bootstrap.Modal(document.getElementById('editProductModal'));
    editProductModal.hide();
});
