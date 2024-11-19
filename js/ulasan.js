//SweetAlert2 Konfirmasi Hapus
function confirmDelete(reviewer) {
    Swal.fire({
        title: 'Apakah Anda yakin?',
        text: "Anda akan menghapus ulasan dari " + reviewer + ". Tindakan ini tidak dapat dibatalkan!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal',
    }).then((result) => {
        if (result.isConfirmed) {
            // Logika penghapusan ulasan (misalnya, panggil API untuk menghapus)
            Swal.fire(
                'Terhapus!',
                'Ulasan dari ' + reviewer + ' telah dihapus.',
                'success'
            );
        }
    });
}

function replyReview(reviewer) {
    // Menampilkan SweetAlert popup untuk balas ulasan
    Swal.fire({
        title: 'Balas Ulasan dari ' + reviewer,
        input: 'textarea',
        inputPlaceholder: 'Tulis balasan Anda...',
        showCancelButton: true,
        confirmButtonText: 'Kirim Balasan',
        cancelButtonText: 'Batal',
        preConfirm: (reply) => {
            if (!reply) {
                Swal.showValidationMessage('Balasan tidak boleh kosong!');
            }
            return reply;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                'Balasan Terkirim!',
                'Balasan Anda untuk ' + reviewer + ' telah terkirim.',
                'success'
            );
        }
    });
}