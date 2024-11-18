const ctx = document.getElementById('bestSellerChart').getContext('2d');
let myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'], // Labels untuk setiap minggu
        datasets: [
            {
                label: 'Kopi Susu Caramela',
                data: [50, 75, 60, 90], // Data penjualan Produk A tiap minggu
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1
            },
            {
                label: 'Chocolate',
                data: [30, 55, 45, 70], // Data penjualan Produk B tiap minggu
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderWidth: 1
            },
            {
                label: 'Berry Dream',
                data: [40, 60, 50, 80], // Data penjualan Produk C tiap minggu
                borderColor: 'rgba(255, 159, 64, 1)',
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderWidth: 1
            }
        ]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

function updateChart() {
    const month = document.getElementById('monthSelect').value;
    // Logika untuk update data penjualan berdasarkan bulan yang dipilih
    if (month === '1') {
        myChart.data.datasets[0].data = [50, 75, 60, 90]; // Update data produk A
        myChart.data.datasets[1].data = [30, 55, 45, 70]; // Update data produk B
        myChart.data.datasets[2].data = [40, 60, 50, 80]; // Update data produk C
    } else if (month === '2') {
        // Ubah data untuk bulan Februari, dsb.
    }
    myChart.update(); // Update chart dengan data baru
}

const sessionCtx = document.getElementById('sessionDurationChart').getContext('2d');
let sessionChart = new Chart(sessionCtx, {
    type: 'bar',
    data: {
        labels: ['Mobile', 'Desktop', 'Tablet'],
        datasets: [{
            label: 'Durasi Sesi (menit)',
            data: [2.5, 3, 1.8], // Data dummy, sesuaikan dengan data real
            backgroundColor: [
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});