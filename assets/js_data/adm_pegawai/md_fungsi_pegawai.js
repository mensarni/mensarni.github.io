// MSN - Data Pegawai CDN
window.dataProfilPegawaiCdnLoaded=true;
window.dataPegawaiData=window.dataPegawaiData||[];

function isiProfilPegawai(user){
    user=user||{};
    $('#pegawai_text_nama').text(user.nama_lengkap||user.name||'-');
    $('#profil_pegawai_nipk').text(user.nipk||'-');
    $('#profil_pegawai_nik').text(user.nik||'-');
    $('#profil_pegawai_tempat_lahir').text(user.tempat_lahir||'-');
    $('#profil_pegawai_tgl_lahir').text(formatTanggalPegawai(user.tgl_lahir));
    $('#profil_pegawai_instansi').text(user.instansi||'-');
    $('#profil_pegawai_departemen').text(user.departemen||'-');
    $('#profil_pegawai_divisi').text(user.divisi||'-');
    $('#profil_pegawai_unit').text((user.unit_usaha || '-').replace(/\bcleanning\b/gi, 'CLEANING'));
    $('#profil_pegawai_jabatan').text(user.jabatan||'-');
    let foto=user.foto||'profil.png';
    $('#profil_pegawai_foto').attr(
        'src',
        '/Backend/Api_KTP/foto/'+encodeURIComponent(foto)
    );
    let status=String(
        user.status||user.status_pegawai||''
    ).toLowerCase().trim();
    if(status==='aktif'){
        $('#profil_pegawai_status').html(
            '<span class="text-success">'+
            '<i class="fa-light fa-circle-check me-1 fs-5"></i><br>Aktif'+
            '</span>'
        );
    }
    else if(status==='nonaktif'||status==='non aktif'){
        $('#profil_pegawai_status').html(
            '<span class="text-danger">'+
            '<i class="fa-light fa-circle-minus me-1 fs-5"></i><br>Non Aktif'+
            '</span>'
        );
    }
    else{
        $('#profil_pegawai_status').html(
            '<span class="text-muted">'+
            '<i class="fa-light fa-circle-minus me-1 fs-5"></i><br>'+
            escapeHtmlDataPegawai(
                user.status||user.status_pegawai||'-'
            )+
            '</span>'
        );
    }
    let mulai=formatTanggalPegawai(user.tgl_mulai_kerja);
    let akhir=formatTanggalPegawai(user.tgl_akhir_kerja);
    $('#profil_pegawai_masa_kerja').text(
        mulai+' s/d '+akhir
    );
}

function properText(teks) {
    return String(teks || '')
        .replace(/[_-]/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, function(huruf) {
            return huruf.toUpperCase();
        });
}

function formatTanggalPegawai(tanggal){
    if(!tanggal) return '-';
    let value=String(tanggal);
    if(/^\d{4}-\d{2}-\d{2}$/.test(value)){
        let p=value.split('-');
        return p[2]+'-'+p[1]+'-'+p[0];
    }
    return value;
}

function isiDataUsers(user){
    $('#data_pegawai_user_id').val(user.user_id||'');
    $('#data_pegawai_nama').val(user.name||'');
    $('#data_pegawai_email').val(user.email||'');
    $('#data_pegawai_role').val(user.role||'');
    $('#data_pegawai_role').val(user.role||'');
    $('#edit_role').val(user.status||'');
}

function isiDataProfilPegawai(user){
    $('#data_pegawai_nipk').val(user.nipk||'');
    $('#data_pegawai_nama_lengkap').val(user.nama_lengkap||user.name||'');
    $('#data_pegawai_tempat_lahir').val(user.tempat_lahir||'');
    $('#data_pegawai_tgl_lahir').val(user.tgl_lahir||'');
    $('#data_pegawai_nik').val(user.nik||'');
    $('#data_pegawai_no_kk').val(user.no_kk||'');
    $('#data_pegawai_jk').val(user.jk||'');
    $('#data_pegawai_pendidikan').val(user.pendidikan||'');
    $('#data_pegawai_status_pernikahan').val(user.status_pernikahan||'');
    $('#data_pegawai_istri').val(user.istri||0);
    $('#data_pegawai_istri_nik').val(user.istri_nik||0);
    $('#data_pegawai_istri_tgl_lahir').val(user.istri_tgl_lahir||0);
    $('#data_pegawai_jml_anak').val(user.jml_anak||0);
    $('#data_pegawai_anak_1').val(user.anak_1||0);
    $('#data_pegawai_anak_1_nik').val(user.anak_1_nik||0);
    $('#data_pegawai_anak_1_tgl_lahir').val(user.anak_1_tgl_lahir||0);
    $('#data_pegawai_anak_2').val(user.anak_2||0);
    $('#data_pegawai_anak_2_nik').val(user.anak_2_nik||0);
    $('#data_pegawai_anak_2_tgl_lahir').val(user.anak_2_tgl_lahir||0);
    $('#data_pegawai_anak_3').val(user.anak_3||0);
    $('#data_pegawai_anak_3_nik').val(user.anak_3_nik||0);
    $('#data_pegawai_anak_3_tgl_lahir').val(user.anak_3_tgl_lahir||0);
    $('#data_pegawai_anak_4').val(user.anak_4||0);
    $('#data_pegawai_anak_4_nik').val(user.anak_4_nik||0);
    $('#data_pegawai_anak_4_tgl_lahir').val(user.anak_4_tgl_lahir||0);
    $('#data_pegawai_agama').val(user.agama||'');
    $('#data_pegawai_alamat').val(user.alamat||'');
    $('#data_pegawai_rt').val(user.rt||'');
    $('#data_pegawai_rw').val(user.rw||'');
    $('#data_pegawai_kelurahan').val(user.kelurahan||'');
    $('#data_pegawai_kecamatan').val(user.kecamatan||'');
    $('#data_pegawai_kota_kabupaten').val(user.kota_kabupaten||'');
    $('#data_pegawai_provinsi').val(user.provinsi||'');
    $('#data_pegawai_email').val(user.email||'');
    $('#data_pegawai_no_hp').val(user.no_hp||'');
    $('#data_pegawai_npwp').val(user.npwp||'');
    $('#data_pegawai_nama_bank').val(user.nama_bank||'');
    $('#data_pegawai_norek').val(user.norek||'');
    $('#data_pegawai_bpjs_kes').val(user.bpjs_kes||'');
    $('#data_pegawai_bpjs_tk').val(user.bpjs_tk||'');
    $('#data_pegawai_bb').val(user.bb||'');
    $('#data_pegawai_tb').val(user.tb||'');
    $('#data_pegawai_bpjs_jht').prop('checked', Number(user.bpjs_jht) === 1);
    $('#data_pegawai_bpjs_jp').prop('checked', Number(user.bpjs_jp) === 1);
    $('#data_pegawai_bpjs_jkk').prop('checked', Number(user.bpjs_jkk) === 1);
    $('#data_pegawai_bpjs_jkm').prop('checked', Number(user.bpjs_jkm) === 1);
    $('#data_pegawai_bpjs_jkp').prop('checked', Number(user.bpjs_jkp) === 1);
}

function isiCetakProfilPegawai(user){
    $('#text_pegawai_nipk').text(user.nipk||'');
    $('#text_pegawai_nama_lengkap').text(user.nama_lengkap||user.name||'');
    $('#text_pegawai_tempat_lahir').text(user.tempat_lahir||'');
    $('#text_pegawai_tgl_lahir').text(user.tgl_lahir||'');
    $('#text_pegawai_nik').text(user.nik||'');
    $('#text_pegawai_no_kk').text(user.no_kk||'');
    $('#text_pegawai_jk').text(user.jk||'');
    $('#text_pegawai_pendidikan').text(user.pendidikan||'');
    $('#text_pegawai_status_pernikahan').text(user.status_pernikahan||'');
    $('#text_pegawai_jml_anak').text(user.jml_anak||0);
    $('#text_pegawai_agama').text(user.agama||'');
    $('#text_pegawai_alamat').text(user.alamat||'');
    $('#text_pegawai_rt').text(user.rt||'');
    $('#text_pegawai_rw').text(user.rw||'');
    $('#text_pegawai_kelurahan').text(user.kelurahan||'');
    $('#text_pegawai_kecamatan').text(user.kecamatan||'');
    $('#text_pegawai_kota_kabupaten').text(user.kota_kabupaten||'');
    $('#text_pegawai_provinsi').text(user.provinsi||'');
    $('#text_pegawai_email').text(user.email||'');
    $('#text_pegawai_no_hp').text(user.no_hp||'');
    $('#text_pegawai_npwp').text(user.npwp||'');
    $('#text_pegawai_nama_bank').text(user.nama_bank||'');
    $('#text_pegawai_norek').text(user.norek||'');
    $('#text_pegawai_bpjs_kes').text(user.bpjs_kes||'');
    $('#text_pegawai_bpjs_tk').text(user.bpjs_tk||'');
    $('#text_pegawai_bb').text(user.bb||'');
    $('#text_pegawai_tb').text(user.tb||'');
    $('#text_pegawai_instansi').text(user.instansi||'');
    $('#text_pegawai_departemen').text(user.departemen||'');
    $('#text_pegawai_divisi').text(user.divisi||'');
    $('#text_pegawai_unit_usaha').text((user.unit_usaha || '-').replace(/\bcleanning\b/gi, 'CLEANING'));
    $('#text_pegawai_jabatan').text(user.jabatan||'');
    $('#text_pegawai_status_pekerja').text(user.status_pekerja||'');
}

function isiDataKepegawaian(user){
    $('#data_pegawai_instansi').val(user.instansi||'');
    $('#data_pegawai_departemen').val(user.departemen||'');
    $('#data_pegawai_divisi').val(user.divisi||'');
    $('#data_pegawai_unit_usaha').val((user.unit_usaha || '-').replace(/\bcleanning\b/gi, 'CLEANING'));
    $('#data_pegawai_jabatan').val(user.jabatan||'');
    $('#data_pegawai_status_pekerja').val(user.status_pekerja||'');
    $('#data_pegawai_no_spk').val(user.no_spk||'');
    $('#data_pegawai_tgl_spk').val(user.tgl_spk||'');
    $('#data_pegawai_no_surat_tugas').val(user.no_surat_tugas||'');
    $('#data_pegawai_tgl_surat_tugas').val(user.tgl_surat_tugas||'');
    $('#data_pegawai_tgl_mulai_kerja').val(user.tgl_mulai_kerja||'');
    $('#data_pegawai_tgl_akhir_kerja').val(user.tgl_akhir_kerja||'');
    $('#data_pegawai_jenis').val(user.jenis||'');

    $('#surat_pegawai_text_ppk_spk').text(user.ppk_spk || '');
    $('#surat_pegawai_text_jab_ppk_spk').text(user.jab_ppk_spk || '');
    $('#surat_pegawai_text_ppk_st').text(user.ppk_st || '');
    $('#surat_pegawai_text_jab_ppk_st').text(user.jab_ppk_st || '');

    $('[name="ppk_st"]').val(user.ppk_st || '');
    $('[name="jab_ppk_st"]').val(user.jab_ppk_st || '');
    $('[name="ppk_spk"]').val(user.ppk_spk || '');
    $('[name="jab_ppk_spk"]').val(user.jab_ppk_spk || '');
}

function isiDataStatusPegawai(user){
    $('#data_pegawai_tgl_nonaktif').val(user.tgl_nonaktif||'');
    $('#data_pegawai_ket_nonaktif').val(user.ket_nonaktif||'');
    $('#data_pegawai_no_paklaring').val(user.no_paklaring||'');
    $('#data_pegawai_catatan_resignation').val(user.catatan_resignation||'');
    $('#ppk_id').val(user.ppk_id||'');
    $('#ppk_select').val(user.ppk||'');
    $('#jab_ppk').val(user.jab_ppk||'');
    $('#verifikator_id').val(user.verifikator_id||'');
    $('#verifikator_select').val(user.verifikator||'');
    $('#jab_verifikator').val(user.jab_verifikator||'');
}

function isiDataDisiplinPegawai(data){
    $('#ppk_id').val(data.ppk_id||'');
    $('#ppk_select').val(data.ppk||'');
    $('#jab_ppk').val(data.jab_ppk||'');
    $('#verifikator_id').val(data.verifikator_id||'');
    $('#verifikator_select').val(data.verifikator||'');
    $('#jab_verifikator').val(data.jab_verifikator||'');
}

function isiDataGajiPegawai(user){
    $('#data_pegawai_tmt_100').val(user.tmt_100||'');
    $('#data_pegawai_gaji_pokok').val(formatRupiah(user.gg_gaji_pokok));
    $('#data_pegawai_gaji_jabatan').val(formatRupiah(user.gg_gaji_jabatan));
    $('#data_pegawai_gaji_transport').val(formatRupiah(user.gg_gaji_transport));
    $('#data_pegawai_gaji_fungsional').val(formatRupiah(user.gg_gaji_fungsional));
    $('#data_pegawai_gaji_insentif').val(formatRupiah(user.gg_gaji_insentif));
    $('#data_pegawai_gaji_makan').val(formatRupiah(user.gg_gaji_makan));
    $('#data_pegawai_gaji_kompensasi').val(formatRupiah(user.gg_gaji_kompensasi));
    $('#data_pegawai_gaji_total').val(formatRupiah(user.gg_gaji_total));
}

function isiDataGajiPelatihan(user){
    $('#data_pegawai_tgl_mulai_pelatihan').val(user.tgl_mulai_kerja||'');
    $('#data_pegawai_tgl_akhir_pelatihan').val(user.tgl_akhir_pelatihan||'');
    $('#data_pegawai_gaji_pokok_pelatihan').val(formatRupiah(user.gp_gaji_pokok));
    $('#data_pegawai_gaji_jabatan_pelatihan').val(formatRupiah(user.gp_gaji_jabatan));
    $('#data_pegawai_gaji_transport_pelatihan').val(formatRupiah(user.gp_gaji_transport));
    $('#data_pegawai_gaji_fungsional_pelatihan').val(formatRupiah(user.gp_gaji_fungsional));
    $('#data_pegawai_gaji_insentif_pelatihan').val(formatRupiah(user.gp_gaji_insentif));
    $('#data_pegawai_gaji_makan_pelatihan').val(formatRupiah(user.gp_gaji_makan));
    $('#data_pegawai_gaji_kompensasi_pelatihan').val(formatRupiah(user.gp_gaji_kompensasi));
    $('#data_pegawai_gaji_total_pelatihan').val(formatRupiah(user.gp_gaji_total));
}

function isiDataSurat(user, idSurat) {
    const surat = Array.isArray(user.riwayat_surat)
        ? user.riwayat_surat
        : (Array.isArray(user.surat_list)
            ? user.surat_list
            : (Array.isArray(user.surat) ? user.surat : []));

    window.dataSuratPegawai = surat;

    const data = surat.find(function(row) {
        return String(row.id) === String(idSurat);
    });

    if (!data) {
        return false;
    }

    window.dataSuratTerpilih = data;

    // DATA SURAT
    $('#pegawai_surat_id').val(data.id || '');
    $('[name="nomor"]').val(data.nomor || '');
    $('[name="tgl_surat"]').val(data.tgl_surat || '');
    $('[name="no_surat"]').val(data.no_surat || '');
    $('[name="mulai"]').val(data.mulai || '');
    $('[name="akhir"]').val(data.akhir || '');
    $('[name="ket_surat"]').val(data.ket_surat || '');
    $('[name="key_surat"]').val(data.key_surat || '');

    $('#surat_pegawai_tgl_spk').val(data.tgl_surat || '');
    $('#surat_pegawai_no_spk').val(data.no_surat || '');
    $('#surat_pegawai_tgl_st').val(data.tgl_surat || '');
    $('#surat_pegawai_no_st').val(data.no_surat || '');
    $('#surat_pegawai_mulai').val(data.mulai || '');
    $('#surat_pegawai_akhir').val(data.akhir || '');
    $('#surat_pegawai_ket_surat').val(data.ket_surat || '');
    $('#surat_pegawai_key_surat').val(data.key_surat || '');

    // DATA PEGAWAI
    $('#surat_pegawai_nipk').val(data.nipk|| '');
    $('#surat_pegawai_nama_lengkap').val(data.nama_lengkap || '');
    $('#surat_pegawai_nik').val(data.nik || '');
    $('#surat_pegawai_tempat_lahir').val(data.tempat_lahir || '');
    $('#surat_pegawai_jk').val(data.jk || '');
    $('#surat_pegawai_pendidikan').val(data.pendidikan || '');
    $('#surat_pegawai_alamat').val(data.alamat || '');
    $('#surat_pegawai_rt').val(data.rt || '');
    $('#surat_pegawai_jk').val(data.jk || '');
    $('#surat_pegawai_rw').val(data.rw || '');
    $('#surat_pegawai_kelurahan').val(data.kelurahan || '');
    $('#surat_pegawai_kecamatan').val(data.kecamatan || '');
    $('#surat_pegawai_kota_kabupaten').val(data.kota_kabupaten || '');
    $('#surat_pegawai_provinsi').val(data.provinsi || '');

    // DATA ORGANISASI
    $('#surat_pegawai_instansi').val(data.instansi || '');
    $('#surat_pegawai_departemen').val(data.departemen || '');
    $('#surat_pegawai_divisi').val(data.divisi || '');
    $('#surat_pegawai_unit_usaha').val((user.unit_usaha || '-').replace(/\bcleanning\b/gi, 'CLEANING'));
    $('#surat_pegawai_jabatan').val(data.jabatan || '');
    $('#surat_pegawai_status_kerja').val(data.status_kerja || '');

    // DATA GAJI
    $('#surat_pegawai_gaji_pokok').val(formatRupiah(data.gaji_pokok || 0));
    $('#surat_pegawai_gaji_jabatan').val(formatRupiah(data.gaji_jabatan || 0));
    $('#surat_pegawai_gaji_transport').val(formatRupiah(data.gaji_transport || 0));
    $('#surat_pegawai_gaji_fungsional').val(formatRupiah(data.gaji_fungsional || 0));
    $('#surat_pegawai_gaji_insentif').val(formatRupiah(data.gaji_insentif || 0));
    $('#surat_pegawai_gaji_makan').val(formatRupiah(data.gaji_makan || 0));
    $('#surat_pegawai_gaji_kompensasi').val(formatRupiah(data.gaji_kompensasi || 0));
    $('#surat_pegawai_gaji_total').val(formatRupiah(data.gaji_total || 0));

    // DATA PPK
    $('#surat_pegawai_ppk_id').val(data.ppk_id || '');
    $('#surat_pegawai_ppk').val(data.ppk || '');
    $('#surat_pegawai_jab_ppk').val(data.jab_ppk || '');

    // DATA SURAT TEXT
    $('#surat_pegawai_text_tgl_spk').text(data.tgl_surat ? data.tgl_surat.substring(8, 10) + '/' + data.tgl_surat.substring(5, 7) + '/' + data.tgl_surat.substring(0, 4) : '');
    $('#surat_pegawai_text_no_spk').text(data.no_surat || '');
    $('#surat_pegawai_text_tgl_st').text(data.tgl_surat ? data.tgl_surat.substring(8, 10) + '/' + data.tgl_surat.substring(5, 7) + '/' + data.tgl_surat.substring(0, 4) : '');
    $('#surat_pegawai_text_no_st').text(data.no_surat || '');
    $('#surat_pegawai_text_mulai').text(data.mulai || '');
    $('#surat_pegawai_text_mulai').text(data.mulai ? data.mulai.substring(8, 10) + '/' + data.mulai.substring(5, 7) + '/' + data.mulai.substring(0, 4) : '');
    $('#surat_pegawai_text_akhir').text(data.akhir ? data.akhir.substring(8, 10) + '/' + data.akhir.substring(5, 7) + '/' + data.akhir.substring(0, 4) : '');
    $('#surat_pegawai_text_ket_surat').text(data.ket_surat || '');
    $('#surat_pegawai_text_key_surat').text(data.key_surat || '');

    // DATA PEGAWAI TEXT
    $('#surat_pegawai_text_nipk').text(data.nipk|| '');
    $('#surat_pegawai_text_nama_lengkap').text(data.nama_lengkap || '');
    $('#surat_pegawai_text_nik').text(data.nik || '');
    $('#surat_pegawai_text_tempat_lahir').text(data.tempat_lahir || '');
    $('#surat_pegawai_text_jk').text(data.jk || '');
    $('#surat_pegawai_text_pendidikan').text(data.pendidikan || '');
    $('#surat_pegawai_text_alamat').text(data.alamat || '');
    $('#surat_pegawai_text_rt').text(data.rt || '');
    $('#surat_pegawai_text_jk').text(data.jk || '');
    $('#surat_pegawai_text_rw').text(data.rw || '');
    $('#surat_pegawai_text_kelurahan').text(data.kelurahan || '');
    $('#surat_pegawai_text_kecamatan').text(data.kecamatan || '');
    $('#surat_pegawai_text_kota_kabupaten').text(data.kota_kabupaten || '');
    $('#surat_pegawai_text_provinsi').text(data.provinsi || '');

    // DATA ORGANISASI TEXT
    $('#surat_pegawai_text_instansi').text(properText(data.instansi));
    $('#surat_pegawai_text_departemen').text(properText(data.departemen));
    $('#surat_pegawai_text_divisi').text(properText(data.divisi));
    $('#surat_pegawai_text_unit_usaha').text(properText((data.unit_usaha || '-').replace(/\bcleanning\b/gi, 'CLEANING')));
    $('#surat_pegawai_text_jabatan').text(properText(data.jabatan));

    $('#surat_pegawai_text_status_kerja').text(data.status_kerja || '');

    // DATA GAJI TEXT
    $('#surat_pegawai_text_gaji_pokok').text(formatRupiah(data.gaji_pokok || 0));
    $('#surat_pegawai_text_gaji_jabatan').text(formatRupiah(data.gaji_jabatan || 0));
    $('#surat_pegawai_text_gaji_transport').text(formatRupiah(data.gaji_transport || 0));
    $('#surat_pegawai_text_gaji_fungsional').text(formatRupiah(data.gaji_fungsional || 0));
    $('#surat_pegawai_text_gaji_insentif').text(formatRupiah(data.gaji_insentif || 0));
    $('#surat_pegawai_text_gaji_makan').text(formatRupiah(data.gaji_makan || 0));
    $('#surat_pegawai_text_gaji_kompensasi').text(formatRupiah(data.gaji_kompensasi || 0));
    $('#surat_pegawai_text_gaji_total').text(formatRupiah(data.gaji_total || 0));

    // DATA PPK TEXT

    return true;
}

function isiDataOutUsers(user){
    $('#data_pegawai_persetujuan').val(user.persetujuan||'');
    $('#data_pegawai_kondisi').val(user.kondisi||'');
    $('#data_pegawai_google_id').val(user.google_id||'');
}

function escapeHtmlDataPegawai(value){
    return String(value||'')
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;')
        .replace(/'/g,'&#039;');
}

function isiDataPegawai(user){
    user=user||{};
    isiProfilPegawai(user);
    isiDataUsers(user);
    isiDataProfilPegawai(user);
    isiDataKepegawaian(user);
    isiDataStatusPegawai(user);
    isiDataGajiPegawai(user);
    isiDataGajiPelatihan(user);
    isiDataSurat(user);
    isiDataOutUsers(user);
    isiCetakProfilPegawai(user);
}

function initPopoverPegawai() {
    document.querySelectorAll('[data-bs-toggle="popover"]').forEach(function(el) {
        bootstrap.Popover.getOrCreateInstance(el);
    });
}

function tampilkanmodal(){
    if(window.modal){
        window.modal.show();
        return;
    }
    const modalElement=document.getElementById('modal');
    if(!modalElement){
        alert('Modal Data Pegawai tidak ditemukan.');
        return;
    }
    if(typeof bootstrap==='undefined'||!bootstrap.Modal){
        alert('Bootstrap Modal tidak tersedia.');
        return;
    }
    window.modal=new bootstrap.Modal(modalElement,{
        backdrop:true,
        keyboard:true
    });
    window.modal.show();
}

function cariDataPegawai(id){
    const target=String(id||'');
    for(let i=0;i<window.dataPegawaiData.length;i++){
        const user=window.dataPegawaiData[i];
        if(String(user.user_id||user.id||'')===target){
            return user;
        }
    }
    return null;
}

function WarnaSuccess(){
    $('#modal .modal-header').attr('class','modal-header').addClass('text-success border-0');
    $('#modal .modal-body').attr('class','modal-body').addClass('mb-3 bg-soft-success');
    $('#modal label').attr('class','form-label').addClass('text-success');
    $('#modal .modal-body .card-header').attr('class','card-header').addClass('bg-soft-success');
}

function WarnaPrimary(){
    $('#modal .modal-header').attr('class','modal-header').addClass('text-primary border-0');
    $('#modal .modal-body').attr('class','modal-body').addClass('mb-3 bg-soft-primary');
    $('#modal label').attr('class','form-label').addClass('text-primary');
    $('#modal .modal-body .card-header').attr('class','card-header').addClass('bg-soft-primary');
}

function WarnaDanger(){
    $('#modal .modal-header').attr('class','modal-header').addClass('text-danger border-0');
    $('#modal .modal-body').attr('class','modal-body').addClass('mb-3 bg-soft-danger');
    $('#modal form label').attr('class','form-label').addClass('text-danger');
    $('#modal .modal-body .card-header').attr('class','card-header').addClass('bg-soft-danger');
}

function WarnaInfo(){
    $('#modal .modal-header').attr('class','modal-header').addClass('text-info border-0');
    $('#modal .modal-body').attr('class','modal-body').addClass('mb-3 bg-soft-info');
    $('#modal form label').attr('class','form-label').addClass('text-info');
    $('#modal .modal-body .card-header').attr('class','card-header').addClass('bg-soft-info');
}

function WarnaOrangered(){
    $('#modal .modal-header').attr('class','modal-header').addClass('text-danger border-0');
    $('#modal .modal-body').attr('class','modal-body').addClass('mb-3 bg-soft-orangered');
    $('#modal form label').attr('class','form-label').addClass('text-danger');
    $('#modal .modal-body .card-header').attr('class','card-header').addClass('text-danger');
}

function WarnaPurple(){
    $('#modal .modal-header').attr('class','modal-header').addClass('text-purple border-0');
    $('#modal .modal-body').attr('class','modal-body').addClass('mb-3 bg-soft-purple');
    $('#modal form label').attr('class','form-label').addClass('text-purple');
    $('#modal .modal-body .card-header').attr('class','card-header').addClass('bg-soft-purple');
}

function WarnaWarning(){
    $('#modal .modal-header').attr('class','modal-header').addClass('text-warning border-0');
    $('#modal .modal-body').attr('class','modal-body').addClass('mb-3 bg-soft-warning');
    $('#modal form label').attr('class','form-label').addClass('text-warning');
    $('#modal .modal-body .card-header').attr('class','card-header').addClass('bg-soft-warning');
}

function angkaRupiah(value){
    value=String(value||'');
    value=value.replace(/[^\d]/g,'');
    return parseInt(value,10)||0;
}

function formatRupiah(angka){
    angka=String(angka||'').replace(/[^\d]/g,'');
    if(!angka){
        return '';
    }
    return angka.replace(/\B(?=(\d{3})+(?!\d))/g,'.');
}

function hitungTotalGajiPegawai(){
    const pokok=angkaRupiah($('#data_pegawai_gaji_pokok').val());
    const jabatan=angkaRupiah($('#data_pegawai_gaji_jabatan').val());
    const transport=angkaRupiah($('#data_pegawai_gaji_transport').val());
    const fungsional=angkaRupiah($('#data_pegawai_gaji_fungsional').val());
    const insentif=angkaRupiah($('#data_pegawai_gaji_insentif').val());
    const makan=angkaRupiah($('#data_pegawai_gaji_makan').val());
    const kompensasi=angkaRupiah($('#data_pegawai_gaji_kompensasi').val());

    const total=
        pokok+
        jabatan+
        transport+
        fungsional+
        insentif+
        makan+
        kompensasi;

    $('#data_pegawai_gaji_total').val(formatRupiah(total));
}

$(document).on(
    'input change',
    '#data_pegawai_gaji_pokok, #data_pegawai_gaji_jabatan, #data_pegawai_gaji_transport, #data_pegawai_gaji_fungsional, #data_pegawai_gaji_insentif, #data_pegawai_gaji_makan, #data_pegawai_gaji_kompensasi',
    function(){
        const value=$(this).val();
        $(this).val(formatRupiah(value));
        hitungTotalGajiPegawai();
    }
);

window.closeAllModal=function(callback){
    const $modal=$('.modal.show');
    if(!$modal.length){
        if(typeof callback==='function') callback();
        return;
    }
    let selesai=0;
    $modal.each(function(){
        const modal=this;
        const instance=bootstrap.Modal.getInstance(modal);
        $(modal).one('hidden.bs.modal',function(){
            resetModalGlobal(modal);
            selesai++;
            if(selesai===$modal.length && typeof callback==='function'){
                callback();
            }
        });
        if(instance){
            instance.hide();
        }else{
            $(modal).removeClass('show').hide();
            resetModalGlobal(modal);
            selesai++;
            if(selesai===$modal.length && typeof callback==='function'){
                callback();
            }
        }
    });
};

window.resetModalGlobal=function(modal){
    const $modal=$(modal);
    $modal.find('form').each(function(){
        this.reset();
    });
    $modal.find('input:not([type="hidden"]),textarea,select').val('');
    $modal.find('input[type="checkbox"],input[type="radio"]').prop('checked',false);
    $modal.find('[data-modal-clear]').empty();
    $modal.find('tbody').empty();
    $modal.find('.is-invalid,.is-valid').removeClass('is-invalid is-valid');
    $modal.find('.modal-state').addClass('d-none');
    $modal.removeData();
    $('.modal-backdrop').remove();
    $('body').removeClass('modal-open').css({
        'padding-right':''
    });
};

// =======================================================
// POP OVER DETAIL
// =======================================================
window.initPopoverDetailPegawai=function(){
    document.querySelectorAll('[data-bs-toggle="popover"]').forEach(function(el){
        const pop=bootstrap.Popover.getOrCreateInstance(el,{
            html:true,
            sanitize:false,
            trigger:'hover',
            customClass:'popover-detail'
        });
        if(el.dataset.popoverDetailTimer==='1')return;
        el.dataset.popoverDetailTimer='1';
        let timer=null;
        el.addEventListener('shown.bs.popover',function(){
            clearTimeout(timer);
            timer=setTimeout(function(){pop.hide();},20000);
        });
        el.addEventListener('hidden.bs.popover',function(){clearTimeout(timer);});
    });
};

window.initFilterPegawai=function(){

    const filterOptions=window.dataFilterOptions||{};

    const labels = {
        instansi: 'Semua Lokasi',
        departemen: 'Semua Departemen',
        divisi: 'Semua Divisi',
        unit_usaha: 'Semua Unit Usaha',
        jabatan: 'Semua Jabatan',
        akhir_kontrak: 'Semua Akhir Kontrak'
    };

    const bulan = {
        '01':'Januari',
        '02':'Februari',
        '03':'Maret',
        '04':'April',
        '05':'Mei',
        '06':'Juni',
        '07':'Juli',
        '08':'Agustus',
        '09':'September',
        '10':'Oktober',
        '11':'November',
        '12':'Desember'
    };

    Object.keys(labels).forEach(function(key){

        const select = document.getElementById('filter_' + key);

        if(!select) return;

        select.innerHTML = '';

        const optionDefault = document.createElement('option');
        optionDefault.value = '';
        optionDefault.textContent = labels[key];
        select.appendChild(optionDefault);

        (filterOptions[key] || []).forEach(function(value){

            const option = document.createElement('option');
            option.value = value;

            if(key === 'akhir_kontrak'){
                const tahun = value.substring(0, 4);
                const bln = value.substring(5, 7);

                option.textContent = (bulan[bln] || bln) + ' ' + tahun;
            } else {
                option.textContent = value;
            }

            select.appendChild(option);
        });
    });

    if(!window.filterKedisiplinanPegawaiTerpasang){

        window.filterKedisiplinanPegawaiTerpasang = true;

        $.fn.dataTable.ext.search.push(function(settings, data, dataIndex){

            if(!settings.nTable || settings.nTable.id !== 'TabelPelamar'){
                return true;
            }

            const rowData = settings.aoData[dataIndex];
            const row = rowData ? rowData.nTr : null;

            if(!row) return true;

            const status = String($('#filter_status').val() || '').trim().toLowerCase();
            const instansi = String($('#filter_instansi').val() || '').trim().toLowerCase();
            const departemen = String($('#filter_departemen').val() || '').trim().toLowerCase();
            const divisi = String($('#filter_divisi').val() || '').trim().toLowerCase();
            const unitUsaha = String($('#filter_unit_usaha').val() || '').trim().toLowerCase();
            const jabatan = String($('#filter_jabatan').val() || '').trim().toLowerCase();
            const akhir = String($('#filter_akhir_kontrak').val() || '').trim();

            const rowStatus = String(row.getAttribute('data-status') || '').trim().toLowerCase();
            const rowInstansi = String(row.getAttribute('data-instansi') || '').trim().toLowerCase();
            const rowDepartemen = String(row.getAttribute('data-departemen') || '').trim().toLowerCase();
            const rowDivisi = String(row.getAttribute('data-divisi') || '').trim().toLowerCase();
            const rowUnitUsaha = String(row.getAttribute('data-unit-usaha') || '').trim().toLowerCase();
            const rowJabatan = String(row.getAttribute('data-jabatan') || '').trim().toLowerCase();
            const rowTglAkhir = String(row.getAttribute('data-tgl-akhir') || '').trim().substring(0, 7);

            if(status && rowStatus !== status) return false;
            if(instansi && rowInstansi !== instansi) return false;
            if(departemen && rowDepartemen !== departemen) return false;
            if(divisi && rowDivisi !== divisi) return false;
            if(unitUsaha && rowUnitUsaha !== unitUsaha) return false;
            if(jabatan && rowJabatan !== jabatan) return false;
            if(akhir && rowTglAkhir !== akhir) return false;

            return true;
        });
    }

    $(document)
        .off('change.filterPegawai', '.filter-pegawai')
        .on('change.filterPegawai', '.filter-pegawai', function(){

            if($.fn.DataTable.isDataTable('#TabelPelamar')){
                $('#TabelPelamar').DataTable().draw();
            }
        });

    // REFRESH DATATABLE
    if($.fn.DataTable.isDataTable('#TabelPelamar')){
        $('#TabelPelamar').DataTable().draw();
    }

    // RESET FILTER (PALING AKHIR)
    $(document)
        .off('click.filterPegawai', '#btnResetFilter')
        .on('click.filterPegawai', '#btnResetFilter', function(){

            $('.filter-pegawai').val('');

            if($.fn.DataTable.isDataTable('#TabelPelamar')){

                const dt = $('#TabelPelamar').DataTable();

                dt.search('');
                dt.columns().search('');
                dt.draw();
            }
        });

};

window.initDataPegawaiCdn=function(){
    if(typeof window.initPopoverDetailPegawai==='function')window.initPopoverDetailPegawai();
    if(typeof window.initFilterPegawai==='function')window.initFilterPegawai();
};
