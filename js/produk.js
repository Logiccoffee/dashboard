    // Fungsi untuk mengambil parameter dari URL
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }
    
    // Fungsi untuk menambahkan input varian baru
    document.getElementById('addVariantLink').addEventListener('click', function(event) {
        event.preventDefault(); // Menghindari navigasi
        const variantsContainer = document.getElementById('variantsContainer');
        const newVariant = document.createElement('div');
        newVariant.classList.add('variant-input-group');
        newVariant.innerHTML = `
            <input type="text" placeholder="Varian" class="form-control" required>
            <input type="number" placeholder="Stok" class="form-control" required>
            <input type="number" placeholder="Harga (Range)" class="form-control" required>
        `;
        variantsContainer.appendChild(newVariant);
    });
    
    // Fungsi untuk mengonversi gambar ke Base64
    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    
    // Fungsi untuk menyimpan produk baru
    document.getElementById('addProductForm').onsubmit = async function(event) {
        event.preventDefault();
    
        const newProduct = {
            category: document.getElementById('productCategory').value,
            name: document.getElementById('productName').value.trim(),
            description: document.getElementById('productDescription').value.trim(),
            variants: []
        };
    
        // Validasi input produk
        if (!newProduct.name || !newProduct.category || !newProduct.description) {
            Swal.fire({
                title: 'Error!',
                text: 'Tolong lengkapi informasi produk.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }
    
        // Mengambil data varian
        const variantGroups = document.querySelectorAll('.variant-input-group');
        if (variantGroups.length === 0) {
            Swal.fire({
                title: 'Error!',
                text: 'Tolong tambahkan varian produk.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }
    
        variantGroups.forEach(variant => {
            const variantName = variant.children[0].value.trim();
            const variantStock = variant.children[1].value.trim();
            const variantPrice = variant.children[2].value.trim();
    
            // Validasi varian
            if (!variantName || !variantStock || !variantPrice) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Tolong lengkapi semua informasi varian.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                return;
            }
    
            newProduct.variants.push({
                name: variantName,
                stock: variantStock,
                price: variantPrice
            });
        });
    
        // Jika gambar dipilih, tambahkan gambar produk
        const imageFile = document.getElementById('productImage').files[0];
        if (imageFile) {
            newProduct.image = await getBase64(imageFile);
        }
    
        // Menyimpan produk baru ke localStorage
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
    
            // Menutup modal dengan JavaScript murni
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
                        <p class="card-text"><strong>Varian:</strong> ${product.variants.map(v => v.name).join(", ")}</p>
                        <p class="card-text"><strong>Stok:</strong> ${product.variants.map(v => v.stock).join(", ")}</p>
                        <p class="card-text"><strong>Harga:</strong> Rp${product.variants.map(v => v.price).join(", ")}</p>
                        <p class="card-text">${product.description}</p>
                        <p class="card-text"><strong>Kategori:</strong> ${product.category}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
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
    // Fungsi untuk membuka popup edit produk
function openEditProductPopup(index) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products[index];

    // Isi form dalam popup dengan data produk yang ingin diubah
    document.getElementById('editProductCategory').value = product.category;
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductDescription').value = product.description;

    // Isi varian produk dalam popup
    const variantsContainer = document.getElementById('editVariantsContainer');
    variantsContainer.innerHTML = ''; // Clear previous variants
    product.variants.forEach(variant => {
        const variantDiv = document.createElement('div');
        variantDiv.classList.add('variant-input-group');
        variantDiv.innerHTML = `
            <input type="text" placeholder="Varian" value="${variant.name}" required>
            <input type="number" placeholder="Stok" value="${variant.stock}" required>
            <input type="number" placeholder="Harga (Range)" value="${variant.price}" required>
        `;
        variantsContainer.appendChild(variantDiv);
    });

    // Show the modal using Bootstrap 5 API (tanpa jQuery)
    var editProductModal = new bootstrap.Modal(document.getElementById('editProductModal'));
    editProductModal.show();
}

    // Update product in localStorage when the form is submitted
    document.getElementById('editProductForm').onsubmit = async function(event) {
        event.preventDefault();

        const updatedProduct = {
            category: document.getElementById('editProductCategory').value,
            name: document.getElementById('editProductName').value.trim(),
            description: document.getElementById('editProductDescription').value.trim(),
            variants: []
        };

        // Mengambil data varian
        const variantGroups = document.querySelectorAll('.variant-input-group');
        variantGroups.forEach(variant => {
            const variantName = variant.children[0].value.trim();
            const variantStock = variant.children[1].value.trim();
            const variantPrice = variant.children[2].value.trim();
            updatedProduct.variants.push({
                name: variantName,
                stock: variantStock,
                price: variantPrice
            });
        });

        // Jika gambar diubah, tambahkan gambar baru
        const imageFile = document.getElementById('editProductImage').files[0];
        if (imageFile) {
            updatedProduct.image = await getBase64(imageFile);
        } else {
            updatedProduct.image = product.image; // Menggunakan gambar yang lama
        }

        // Perbarui produk di localStorage
        products[index] = updatedProduct;
        localStorage.setItem('products', JSON.stringify(products));

        // Tampilkan SweetAlert setelah berhasil menyimpan
        Swal.fire({
            title: 'Sukses!',
            text: 'Produk berhasil diubah!',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            $('#editProductModal').modal('hide'); // Hide the modal
            renderProductList(); // Refresh the product list
        });
    };


// Fungsi untuk mengonfirmasi penghapusan produk
function confirmDelete(index) {
    Swal.fire({
        title: 'Apakah Anda yakin?',
        text: "Produk ini akan dihapus!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            deleteProduct(index);
        }
    });
}

// Fungsi untuk menghapus produk
function deleteProduct(index) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    products.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(products));
    renderProductList(); // Perbarui daftar produk
}

// Panggil renderProductList ketika halaman dimuat
    renderProductList();

    // Inisialisasi tampilan produk setelah halaman dimuat
    document.addEventListener('DOMContentLoaded', renderProductList);