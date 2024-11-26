// sidebar.js
document.addEventListener("DOMContentLoaded", function () {
    const sidebar = `
    <header class="menu-wrap">
			<figure class="user">
				<div class="user-avatar">
					<img src="img/logo logic.png" alt="LogicCoffee">
				</div>
				<figcaption>Logic Coffee</figcaption>
			</figure>
    <nav>
        <!-- Bagian Dasbor dan Alat Utama -->
        <section class="main-tools">
            <ul>
                <li>
                    <a href="https://logiccoffee.id.biz.id/dashboard/" class="dashboard-link">
                        <i class="fa-solid fa-house" style="margin-right: 10px;"></i>
                        Dasbor
                    </a>
                </li>
                <li>
                    <a href="analitik.html" class="analitik-link">
                        <i class="fa-solid fa-chart-line" style="margin-right: 10px;"></i>
                        Analitik
                    </a>
                </li>
            </ul>
        </section>

        <!-- Bagian Kelola -->
        <section class="discover">
            <h3 class="custom-heading">Kelola</h3>
            <ul>
                <li>
                    <a href="ulasan.html" class="ulasan-link">
                        <i class="fa-solid fa-comment" style="margin-right: 10px;"></i>
                        Ulasan
                    </a>
                </li>
                <li>
                    <a href="banner.html" class="banner-link">
                        <i class="fa-solid fa-image" style="margin-right: 10px;"></i>
                        Kustom Banner
                    </a>
                </li>
                <li>
                    <a href="users.html" class="users-link">
                        <i class="fa-solid fa-user-gear" style="margin-right: 10px;"></i>
                        Pengguna
                    </a>
                </li>
            </ul>
        </section>

        <!-- Bagian Produk -->
        <section class="products">
            <h3 class="custom-heading">Produk</h3>
            <ul>
                <li>
                    <a href="category.html" class="category-link">
                        <i class="fa-solid fa-list" style="margin-right: 10px;"></i>
                        Kategori
                    </a>
                </li>
                <li>
                    <a href="menu.html" class="menu-link">
                        <i class="fa-solid fa-mug-saucer" style="margin-right: 10px;"></i>
                        Menu
                    </a>
                </li>
            </ul>
        </section>

        <!-- Bagian Transaksi -->
        <section class="transactions">
            <h3 class="custom-heading">Transaksi</h3>
            <ul>
                <li>
                    <a href="daftarpesanan.html" class="daftarpesanan-link">
                        <i class="fa-solid fa-box" style="margin-right: 10px;"></i>
                        Daftar Pesanan
                    </a>
                </li>
                <li>
                    <a href="keuangan.html" class="keuangan-link">
                        <i class="fa-solid fa-hand-holding-dollar" style="margin-right: 10px;"></i>
                        Keuangan
                    </a>
                </li>
            </ul>
        </section>
    </nav>`;

    // Menambahkan sidebar ke elemen dengan ID 'sidebar-container'
    document.getElementById("sidebar-container").innerHTML = sidebar;

    // Tentukan halaman yang aktif dengan menambahkan kelas 'active'
    const currentPage = document.body.getAttribute("data-page");
    if (currentPage) {
        const activeLink = document.querySelector(`.${currentPage}-link`);
        if (activeLink) {
            activeLink.classList.add("active");
        }
    }
});
