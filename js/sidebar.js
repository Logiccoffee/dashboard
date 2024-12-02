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
                        <span class="sidebar-text">Dasbor</span> <!-- Teks -->
                    </a>
                </li>
                <li>
                    <a href="analitik.html" class="analitik-link">
                        <i class="fa-solid fa-chart-line" style="margin-right: 10px;"></i>
                        <span class="sidebar-text">Analitik</span> <!-- Teks -->
                    </a>
                </li>
            </ul>
        </section>

        <!-- Bagian Kelola -->
        <section class="discover">
            <h3 class="custom-heading">Kelola</h3>
            <ul>
                <li>
                    <a href="users.html" class="users-link">
                        <i class="fa-solid fa-user-gear" style="margin-right: 10px;"></i>
                        <span class="sidebar-text">Pengguna</span>
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
                        <span class="sidebar-text">Kategori</span>
                    </a>
                </li>
                <li>
                    <a href="menu.html" class="menu-link">
                        <i class="fa-solid fa-mug-saucer" style="margin-right: 10px;"></i>
                        <span class="sidebar-text">Menu</span>
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
                        <span class="sidebar-text">Daftar Pesanan</span>
                    </a>
                </li>
                <li>
                    <a href="keuangan.html" class="keuangan-link">
                        <i class="fa-solid fa-hand-holding-dollar" style="margin-right: 10px;"></i>
                        <span class="sidebar-text">Keuangan</span>
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
