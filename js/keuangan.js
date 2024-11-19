

document.addEventListener('DOMContentLoaded', function () {
    const printButton = document.getElementById('printButton');
    console.log("Tombol Print:", printButton);

    if (printButton) {
        printButton.addEventListener('click', function () {
            console.log("Tombol Diklik");
            const laporanKeuangan = document.querySelector('.table');
            if (laporanKeuangan) {
                const tabelHTML = laporanKeuangan.outerHTML; // Ambil tabel
                const printWindow = window.open('', '_blank');
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>Cetak Laporan Keuangan</title>
                            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css">
                            <style>
                                body {
                                    font-family: 'Signika', sans-serif;
                                    padding: 20px;
                                }
                                h2 {
                                    text-align: center;
                                    margin-bottom: 20px;
                                }
                            </style>
                        </head>
                        <body>
                            <h2>Laporan Keuangan</h2>
                            ${tabelHTML}
                        </body>
                    </html>
                `);
                printWindow.document.close();
                printWindow.print();
            } else {
                console.error("Tabel dengan class 'table' tidak ditemukan!");
            }
        });
    } else {
        console.error("Tombol cetak tidak ditemukan!");
    }
});
