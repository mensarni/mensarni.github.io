(function(){
if(window.validasiGajiPegawaiJsLoaded)return;
window.validasiGajiPegawaiJsLoaded=true;

/* =========================================================
   DATA GLOBAL VALIDASI GAJI
========================================================= */
window.dataValidasiGajiPegawai=window.dataValidasiGajiPegawai||[];
window.bolehKelolaValidasiGajiPegawai=window.bolehKelolaValidasiGajiPegawai||false;
window.modalValidasiGajiPegawai=null;
window.validasiGajiPegawaiId=null;
window.tombolValidasiGajiAktif=null;
window.htmlTombolValidasiGaji='';

/* =========================================================
   INIT MODUL VALIDASI GAJI
========================================================= */
window.init_fungsi_validasi_gaji_pegawai=function(){
    const modalElement=document.getElementById('modal');
    window.modalValidasiGajiPegawai=null;
    if(modalElement){
        window.modalValidasiGajiPegawai=bootstrap.Modal.getOrCreateInstance(modalElement,{
            backdrop:'static',
            keyboard:false
        });
    }
};

/* =========================================================
   SIMPAN STATUS TOMBOL
========================================================= */
window.simpanStatusTombolValidasiGaji=function(btn){
    if(!btn)return;
    if(window.tombolValidasiGajiAktif&&window.tombolValidasiGajiAktif!==btn){
        window.restoreTombolValidasiGaji();
    }
    if(window.tombolValidasiGajiAktif!==btn){
        window.tombolValidasiGajiAktif=btn;
        window.htmlTombolValidasiGaji=btn.innerHTML;
    }
};

/* =========================================================
   KEMBALIKAN TOMBOL VALIDASI
========================================================= */
window.restoreTombolValidasiGaji=function(){
    const btn=window.tombolValidasiGajiAktif;
    if(!btn)return;
    $(btn).prop('disabled',false)
        .removeClass('disabled')
        .removeAttr('aria-disabled');
    btn.disabled=false;
    if(window.htmlTombolValidasiGaji!==''){
        btn.innerHTML=window.htmlTombolValidasiGaji;
    }
    window.tombolValidasiGajiAktif=null;
    window.htmlTombolValidasiGaji='';
};

/* =========================================================
   TUTUP MODAL LAIN SEBELUM MEMBUKA MODAL VALIDASI
========================================================= */
function tutupModalSebelumBukaValidasi(callback){
    const modalElement=document.getElementById('modal');
    if(!modalElement){
        console.error('Modal Validasi Gaji tidak ditemukan.');
        return;
    }
    const modalLain=document.querySelectorAll('.modal.show');
    modalLain.forEach(function(element){
        if(element!==modalElement){
            console.warn('Modal halaman lain sedang terbuka:',element.id);
        }
    });
    callback();
}

/* =========================================================
   BUKA MODAL VALIDASI GAJI
========================================================= */
function bukaModalValidasiGaji(){
    const modalElement=document.getElementById('modal');
    if(!modalElement)return false;
    if(!window.bootstrap||!bootstrap.Modal)return false;
    try{
        window.modalValidasiGajiPegawai=bootstrap.Modal.getOrCreateInstance(modalElement,{
            backdrop:'static',
            keyboard:false
        });
        window.modalValidasiGajiPegawai.show();
        return true;
    }catch(error){
        console.error('Gagal membuka Modal Validasi Gaji:',error);
        return false;
    }
}

/* =========================================================
   EVENT VALIDASI GAJI PEGAWAI
========================================================= */
$(document)
.off('click.validasiGaji','.btn-detail-verif-pegawai')
.on('click.validasiGaji','.btn-detail-verif-pegawai',function(e){
    e.preventDefault();
    e.stopPropagation();
    const btn=this;
    const id=$(btn).attr('data-id');
    const userData=$(btn).attr('data-user');
    if(!id){
        window.top.postMessage({
            type:'flash_message',
            message:'<b>GAGAL!</b><br>ID pegawai tidak ditemukan.',
            status:'danger'
        },'*');
        return false;
    }
    window.simpanStatusTombolValidasiGaji(btn);
    bukaValidasiGaji(id,userData,btn);
    return false;
});

/* =========================================================
   EVENT CETAK PEGAWAI
========================================================= */
$(document)
.off('click.validasiGaji','#btnCetakPegawai,#btnCetakDataPegawai')
.on('click.validasiGaji','#btnCetakPegawai,#btnCetakDataPegawai',function(e){
    e.preventDefault();
    if(typeof window.cetakDataPegawai==='function'){
        window.cetakDataPegawai();
    }else if(typeof window.cetakDataPegawaiAsli==='function'){
        window.cetakDataPegawaiAsli();
    }else{
        window.top.postMessage({
            type:'flash_message',
            message:'<b>GAGAL!</b><br>Fungsi cetakDataPegawai belum tersedia.',
            status:'danger'
        },'*');
    }
});

/* =========================================================
   KEMBALIKAN TOMBOL KETIKA MODAL DITUTUP
========================================================= */
$(document)
.off('hidden.bs.modal.validasiGaji','.modal')
.on('hidden.bs.modal.validasiGaji','.modal',function(){
    if(this.id==='modal'){
        window.restoreTombolValidasiGaji();
    }
});

/* =========================================================
   EVENT VALIDASI GAJI
========================================================= */
$(document)
.off('click.validasiGaji','#btnValidasiGaji')
.on('click.validasiGaji','#btnValidasiGaji',function(e){
    e.preventDefault();
    return prosesValidasiGaji(this);
});

/* =========================================================
   EVENT TOLAK GAJI
========================================================= */
$(document)
.off('click.validasiGaji','#btnValidasiTolakGaji')
.on('click.validasiGaji','#btnValidasiTolakGaji',function(e){
    e.preventDefault();
    return prosesTolakGaji(this);
});

/* =========================================================
   EVENT HITUNG TOTAL GAJI
========================================================= */
$(document)
.off('input.validasiGaji change.validasiGaji','[id*="gaji_"]')
.on('input.validasiGaji change.validasiGaji','[id*="gaji_"]',hitungTotalGajiPegawai);

/* =========================================================
   EVENT HITUNG DURASI KERJA
========================================================= */
$(document)
.off('input.validasiGaji change.validasiGaji','#data_pegawai_tgl_mulai_kerja,#data_pegawai_tgl_akhir_kerja')
.on('input.validasiGaji change.validasiGaji','#data_pegawai_tgl_mulai_kerja,#data_pegawai_tgl_akhir_kerja',hitungDurasiKerja);

/* =========================================================
   EVENT PPK SURAT TEGURAN
========================================================= */
$(document)
.off('change.validasiGaji','#ppk_st_select')
.on('change.validasiGaji','#ppk_st_select',function(){
    const opt=$(this).find(':selected');
    $('#ppk_id_st').val(opt.attr('data-id-st')||'');
    $('#ppk_st').val(opt.val()||'');
    $('#jab_ppk_st').val(opt.attr('data-jabatan-st')||'');
    $('#status_ppk_st').val(opt.attr('data-status-st')||'');
});

/* =========================================================
   EVENT PPK SPK
========================================================= */
$(document)
.off('change.validasiGaji','#ppk_spk_select')
.on('change.validasiGaji','#ppk_spk_select',function(){
    const opt=$(this).find(':selected');
    $('#ppk_id_spk').val(opt.attr('data-id-spk')||'');
    $('#ppk_spk').val(opt.val()||'');
    $('#jab_ppk_spk').val(opt.attr('data-jabatan-spk')||'');
    $('#status_ppk_spk').val(opt.attr('data-status-spk')||'');
});

/* =========================================================
   ONLOAD SAAT MODAL DIBUKA
========================================================= */
$(document)
.off('shown.bs.modal.validasiGaji','.modal')
.on('shown.bs.modal.validasiGaji','.modal',function(){
    $(this).find('#ppk_st_select,#ppk_spk_select').trigger('change');
});

/* =========================================================
   PARSE DATA PEGAWAI
========================================================= */
function parseDataPegawai(userData){
    if(typeof userData==='object'&&userData!==null)return userData;
    try{
        return JSON.parse(userData||'{}');
    }catch(e){
        console.error('Data pegawai bukan JSON valid:',e);
        return {};
    }
}

/* =========================================================
   PROSES VALIDASI GAJI
========================================================= */
function bukaValidasiGaji(id,userData,btn){
    const user=parseDataPegawai(userData);
    if(!user||!user.user_id){
        window.top.postMessage({
            type:'flash_message',
            message:'<b>GAGAL!</b><br>Data pegawai tidak ditemukan.',
            status:'danger'
        },'*');
        window.restoreTombolValidasiGaji();
        return false;
    }
    if(btn)disableSubmit(btn);
    tutupModalSebelumBukaValidasi(function(){
        window.validasiGajiPegawaiId=id;
        const form=document.getElementById('formDataPegawai');
        if(form)form.reset();
        $('#pegawai_id').val('');
        $('#pegawai_user_id').val(id);
        isiDataPegawai(user);
        isiDataValidasiGaji(user);
        Validasi_Pelatihan(user);
        Validasi_Aksi(user);
        hitungTotalGajiPegawai();
        hitungDurasiKerja();
        Btn_Validasi_Gaji(user);
        if(!bukaModalValidasiGaji()){
            window.restoreTombolValidasiGaji();
            window.top.postMessage({
                type:'flash_message',
                message:'<b>GAGAL!</b><br>Modal Validasi Gaji gagal dibuka.',
                status:'danger'
            },'*');
        }
    });
    return true;
}

/* =========================================================
   DATA KHUSUS VALIDASI GAJI
========================================================= */
function isiDataValidasiGaji(user){
    user=user||{};
    $('#data_pegawai_catatan').val(user.gg_catatan_pegawai||'');
}

/* =========================================================
   VALIDASI CATATAN PEGAWAI
========================================================= */
function Validasi_Pelatihan(user){
    const catatanPegawai=(user.gg_catatan_pegawai||'').toLowerCase();
    const input=document.querySelector('#dt_pelatihan');
    if(!input)return;
    const tanggalPelatihan=input.closest('.row');
    if(!tanggalPelatihan)return;
    tanggalPelatihan.style.display=catatanPegawai.includes('edit')?'':'none';
}

/* =========================================================
   VALIDASI AKSI
========================================================= */
function Validasi_Aksi(user){
    const catatan=(user.gg_catatan_pegawai||'').toLowerCase().trim();
    const inputAction=document.querySelector('#formDataPegawai input[name="action"]');
    if(!inputAction)return;
    if(catatan.includes('edit')){
        inputAction.value='edit';
        $('#dt_pelatihan').addClass('d-none');
        WarnaPrimary();
    }else if(catatan.includes('adendum')){
        inputAction.value='adendum';
        $('#dt_pelatihan').addClass('d-none');
        $('#data_pegawai_tmt_100').val($('#data_pegawai_tgl_mulai_kerja').val());
        $('#data_pegawai_tgl_akhir_pelatihan').val($('#data_pegawai_tgl_akhir_kerja').val());
        WarnaPurple();
    }else if(catatan.includes('lanjut')){
        inputAction.value='lanjut_kontrak';
        $('#dt_pelatihan').addClass('d-none');
        WarnaSuccess();
    }else{
        inputAction.value='';
        WarnaSuccess();
    }
}

/* =========================================================
   MODE VALIDASI GAJI
========================================================= */
function Btn_Validasi_Gaji(user){
    $('#modalNamaPegawai').text(user.nama_lengkap||user.name||'-');
    $('#modalNIPKPegawai').text(user.nipk||'-');
    $('#formDataPegawai').removeClass('d-none');
    $('#btnValidasiGaji').removeClass('d-none');
    $('#btnSimpanDataPegawai').addClass('d-none');
    $('#boxCetakDataPegawai').addClass('d-none');
    $('#btnCetakPegawai').addClass('d-none');
    $('#modal .modal-dialog').addClass('modal-dialog-scrollable');
    $('#data_pegawai_catatan_surat').val(user.gg_catatan_pegawai||'');
    $('#modalTitle').text(user.gg_catatan_pegawai||'');
    const teks=$('#modalTitle').text()
        .replace(/draft/gi,'Validasi Gaji ')
        .replace(/_/g,' ')
        .toLowerCase()
        .replace(/\b\w/g,function(huruf){
            return huruf.toUpperCase();
        })
        .replace(/\bSpk\b/gi,'SPK');
    $('#modalTitle').text(teks);
}

/* =========================================================
   BERSIHKAN FORMAT RUPIAH
========================================================= */
function bersihkanRupiah(form){
    $(form).find('.rupiah').each(function(){
        this.value=this.value.replace(/[^\d]/g,'');
    });
}

/* =========================================================
   SIMPAN VALIDASI GAJI
========================================================= */
function prosesValidasiGaji(btn){
    const form=document.getElementById('formDataPegawai');
    if(!form){
        window.top.postMessage({
            type:'flash_message',
            message:'<b>VALIDASI GAGAL!</b><br>Formulir Tidak Ditemukan!',
            status:'danger'
        },'*');
        return false;
    }
    const userId=$(form).find('[name="user_id"]').val();
    if(!userId){
        window.top.postMessage({
            type:'flash_message',
            message:'<b>VALIDASI GAGAL!</b><br>Pegawai tidak ditemukan!',
            status:'danger'
        },'*');
        return false;
    }
    if(!form.checkValidity()){
        form.reportValidity();
        return false;
    }
    bersihkanRupiah(form);
    form.method='POST';
    form.target='ProsesFrame';
    $('#data_pegawai_catatan_surat').val(
        $('#data_pegawai_catatan_surat').val().replace(/draft/gi,'Disetujui Gaji Pegawai')
    );
    const inputAction=form.querySelector('input[name="action"]');
    const action=inputAction?inputAction.value.trim():'';
    if(!action)return false;
    disableSubmit(btn);
    HTMLFormElement.prototype.submit.call(form);
    return false;
}

/* =========================================================
   TOLAK GAJI
========================================================= */
function prosesTolakGaji(btn){
    const form=document.getElementById('formDataPegawai');
    if(!form){
        window.top.postMessage({
            type:'flash_message',
            message:'<b>VALIDASI GAGAL!</b><br>Formulir Tidak Ditemukan!',
            status:'danger'
        },'*');
        return false;
    }
    const userId=$(form).find('[name="user_id"]').val();
    if(!userId){
        window.top.postMessage({
            type:'flash_message',
            message:'<b>VALIDASI GAGAL!</b><br>Pegawai tidak ditemukan!',
            status:'danger'
        },'*');
        return false;
    }
    if(!form.checkValidity()){
        form.reportValidity();
        return false;
    }
    bersihkanRupiah(form);
    form.method='POST';
    form.target='ProsesFrame';
    $('#data_pegawai_catatan_surat').val(
        $('#data_pegawai_catatan_surat').val().replace(/draft/gi,'Ditolak Gaji Pegawai')
    );
    const inputAction=form.querySelector('input[name="action"]');
    if(!inputAction)return false;
    inputAction.value='tolak_'+inputAction.value.trim()+'_SPK';
    $('#formDataPegawai')
        .find('input,select,textarea,button')
        .not('[name="user_id"],[name="update"],[name="action"],[name="csrf"],[name="catatan_pegawai"]')
        .prop('disabled',true);
    disableSubmit(btn);
    HTMLFormElement.prototype.submit.call(form);
    return false;
}

/* =========================================================
   HITUNG DURASI KERJA
========================================================= */
function hitungDurasiKerja(){
    const mulai=document.getElementById('data_pegawai_tgl_mulai_kerja');
    const akhir=document.getElementById('data_pegawai_tgl_akhir_kerja');
    const durasi=document.getElementById('data_pegawai_durasi_kerja');
    if(!mulai||!akhir||!durasi)return;
    if(!mulai.value||!akhir.value){
        durasi.value='';
        return;
    }
    const a=mulai.value.split('-').map(Number);
    const b=akhir.value.split('-').map(Number);
    const awal=new Date(a[0],a[1]-1,a[2]);
    const akhirTanggal=new Date(b[0],b[1]-1,b[2]);
    if(akhirTanggal<awal){
        durasi.value='';
        return;
    }
    let bulan=(b[0]-a[0])*12+(b[1]-a[1]);
    function tanggalPatokan(jumlahBulan){
        const total=a[1]-1+jumlahBulan;
        const tahun=a[0]+Math.floor(total/12);
        const bulanIndex=((total%12)+12)%12;
        const hariMaks=new Date(tahun,bulanIndex+1,0).getDate();
        return new Date(tahun,bulanIndex,Math.min(a[2],hariMaks));
    }
    if(tanggalPatokan(bulan)>akhirTanggal)bulan--;
    const hari=Math.round((akhirTanggal-tanggalPatokan(bulan))/86400000);
    durasi.value=bulan+' bulan '+hari+' hari';
}

/* =========================================================
   HITUNG TOTAL GAJI
========================================================= */
function hitungTotalGajiPegawai(){
    let total=0;
    $('[id*="gaji_"]').each(function(){
        if(this.id.indexOf('gaji_total')!==-1)return;
        const nilai=String($(this).val()||'').replace(/\D/g,'');
        total+=Number(nilai)||0;
    });
    $('#surat_pegawai_gaji_total').val('Rp '+total.toLocaleString('id-ID'));
}

})();
