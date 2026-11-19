(function () {
    'use strict';
    function initFormKedisiplinan() {
        var tingkat = document.getElementById('tingkat');
        var jenis = document.getElementById('jenis_pelanggaran');
        var tanggalSurat = document.getElementById('tanggal_surat');
        var tglMulai = document.getElementById('tgl_mulai');
        var tglSelesai = document.getElementById('tgl_selesai');
        if (tingkat && jenis) {
            var daftarPelanggaran = {
                Ringan: [
                    'Melanggar tata tertib',
                    'Sering datang terlambat',
                    'Sering pulang lebih awal',
                    'Lalai menjalankan SOP'
                ],
                Sedang: [
                    'Mengulangi pelanggaran ringan',
                    'Mangkir atau alpa',
                    'Terlibat perselisihan'
                ],
                Berat: [
                    'Mengulangi pelanggaran sedang',
                    'Pencurian, penggelapan, atau penipuan',
                    'Pemalsuan dokumen atau klaim',
                    'Membocorkan rahasia perusahaan',
                    'Kekerasan atau ancaman serius',
                    'Penyalahgunaan narkotika atau miras di tempat kerja'
                ]
            };
            function tampilkanJenisPelanggaran(nilai, pilihanAktif) {
                jenis.innerHTML = '<option value="">Pilih jenis pelanggaran</option>';
                var daftar = daftarPelanggaran[nilai] || [];
                jenis.disabled = daftar.length === 0;
                daftar.forEach(function (item) {
                    var option = document.createElement('option');
                    option.value = item;
                    option.textContent = item;
                    if (item === pilihanAktif) option.selected = true;
                    jenis.appendChild(option);
                });
                if (pilihanAktif && !daftar.includes(pilihanAktif)) {
                    var optionLama = document.createElement('option');
                    optionLama.value = pilihanAktif;
                    optionLama.textContent = pilihanAktif;
                    optionLama.selected = true;
                    jenis.appendChild(optionLama);
                }
            }
            tingkat.onchange = function () {
                tampilkanJenisPelanggaran(this.value, '');
            };
            tampilkanJenisPelanggaran(tingkat.value, jenis.dataset.pilihan || jenis.value);
            window.tampilkanJenisPelanggaran = tampilkanJenisPelanggaran;
        }
        if (tanggalSurat && tglMulai && tglSelesai) {
            function hitungMasaBerlaku() {
                var tanggal = tanggalSurat.value;
                if (!tanggal) {
                    tglMulai.value = '';
                    tglSelesai.value = '';
                    return;
                }
                tglMulai.value = tanggal;
                var bagian = tanggal.split('-');
                var tahun = Number(bagian[0]);
                var bulan = Number(bagian[1]);
                var hari = Number(bagian[2]);
                var tanggalAkhir = new Date(tahun, bulan - 1 + 6, 1);
                var hariMaksimal = new Date(
                    tanggalAkhir.getFullYear(),
                    tanggalAkhir.getMonth() + 1,
                    0
                ).getDate();
                tanggalAkhir.setDate(Math.min(hari, hariMaksimal));
                var yyyy = tanggalAkhir.getFullYear();
                var mm = String(tanggalAkhir.getMonth() + 1).padStart(2, '0');
                var dd = String(tanggalAkhir.getDate()).padStart(2, '0');
                tglSelesai.value = yyyy + '-' + mm + '-' + dd;
            }
            tanggalSurat.addEventListener('change', hitungMasaBerlaku);
            hitungMasaBerlaku();
            window.hitungMasaBerlakuSP = hitungMasaBerlaku;
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFormKedisiplinan);
    } else {
        initFormKedisiplinan();
    }
})();