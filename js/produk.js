import { onClick, getValue, addChild, setInner, container } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.4/element.js';
import Cookies from 'https://cdn.jsdelivr.net/npm/js-cookie/dist/js.cookie.min.mjs';

// Fungsi untuk mengonversi gambar ke Base64
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Fungsi untuk memuat data produk
function loadProducts() {
    let products = [];
    if (Cookies.get('products')) {
        products = JSON.parse(Cookies.get('products'));
    } else if (localStorage.getItem('products')) {
        products = JSON.parse(localStorage.getItem('products'));
        // Sinkronisasi ke cookies jika hanya ada di localStorage
        Cookies.set('products', JSON.stringify(products), { expires: 7 });
    }
    return products;
}

// Fungsi untuk menyimpan produk ke cookies dan localStorage
function saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
    Cookies.set('products', JSON.stringify(products), { expires: 7 });
}

// Fungsi untuk menyimpan produk baru
onClick('addProductForm', async function(event) {
    event.preventDefault();

    const productCategory = getValue('productCategory');
    const productName = getValue('product-name').trim();
    const productPrice = getValue('product-price').trim();
    const productImage = container('product-image').files[0];

    // Validasi input produk
    if (!productCategory || !productName || !productPrice || !productImage) {
        alert("Tolong lengkapi semua informasi produk.");
        return;
    }

    const newProduct = {
        category: productCategory,
        name: productName,
        price: productPrice,
        image: await getBase64(productImage),
    };

    // Ambil produk yang sudah ada, tambahkan produk baru, lalu simpan
    const products = loadProducts();
    products.push(newProduct);
    saveProducts(products);

    // Tampilkan SweetAlert setelah berhasil menyimpan
    Swal.fire({
        title: 'Sukses!',
        text: 'Produk berhasil ditambahkan!',
        icon: 'success',
        confirmButtonText: 'OK'
    }).then(() => {
        renderProductList(); // Perbarui daftar produk
        const modal = bootstrap.Modal.getInstance(container('addProductModal'));
        modal.hide(); // Menutup modal setelah produk ditambahkan
    });
});

// Fungsi untuk menampilkan daftar produk
function renderProductList() {
    const products = loadProducts();
    const productList = container('productList');
    setInner('productList', ''); // Hapus daftar produk sebelumnya

    products.forEach((product, index) => {
        const content = `
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
        addChild('productList', 'div', 'col-md-4 mb-4', content);
    });
}

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
            const products = loadProducts();
            products.splice(index, 1);
            saveProducts(products);

            Swal.fire('Terhapus!', 'Produk telah dihapus.', 'success');
            renderProductList(); // Perbarui daftar produk setelah dihapus
        }
    });
}

// Panggil fungsi renderProductList untuk menampilkan daftar produk saat halaman dimuat
document.addEventListener('DOMContentLoaded', renderProductList);
