(function(){
if(window.validasiGajiPegawaiJsLoaded)return;
window.validasiGajiPegawaiJsLoaded=true;
window.dataValidasiGajiPegawai=window.dataValidasiGajiPegawai||[];
window.bolehKelolaValidasiGajiPegawai=window.bolehKelolaValidasiGajiPegawai||false;
window.modalValidasiGajiPegawai=null;
window.validasiGajiPegawaiId=null;
let sudahInit=false;
let tombolValidasiAktif=null;
let htmlTombolValidasi='';
/* =========================================================
   INIT MODUL
========================================================= */
window.init_fungsi_validasi_gaji_pegawai=function(){
    if(typeof window.jQuery==='undefined'){
        console.error('jQuery belum tersedia.');
        return false;
    }
    if(typeof bootstrap==='undefined'||!bootstrap.Modal){
        console.error('Bootstrap Modal belum tersedia.');
        return false;
    }
    const modalElement=document.getElementById('modal');
    if(!modalElement){
        console.error('Elemen modal dengan ID modal tidak ditemukan.');
        return false;
    }
    window.modalValidasiGajiPegawai=bootstrap.Modal.getOrCreateInstance(modalElement,{backdrop:'static',keyboard:false});
    if(sudahInit)return true;
    pasangEventValidasiGaji();
    sudahInit=true;
    return true;
};
/* =========================================================
   EVENT MODUL
========================================================= */
function pasangEventValidasiGaji(){
    $(document).on('click.validasiGaji','.btn-detail-verif-pegawai',function(e){
        e.preventDefault();
        e.stopPropagation();
        const btn=this;
        const id=$(btn).attr('data-id');
        const userData=$(btn).attr('data-user');
        if(!id){
            pesanValidasiGaji('<b>GAGAL!</b><br>ID pegawai tidak ditemukan.','danger');
            return false;
        }
        simpanTombolValidasi(btn);
        bukaValidasiGaji(id,userData,btn);
    });
    $(document).on('click.validasiGaji','#btnCetakPegawai,#btnCetakDataPegawai',function(e){
        e.preventDefault();
        if(typeof window.cetakDataPegawai==='function'){
            window.cetakDataPegawai();
        }else if(typeof window.cetakDataPegawaiAsli==='function'){
            window.cetakDataPegawaiAsli();
        }else{
            pesanValidasiGaji('<b>GAGAL!</b><br>Fungsi cetakDataPegawai belum tersedia.','danger');
        }
    });
    $(document).on('click.validasiGaji','#btnValidasiGaji',function(e){
        e.preventDefault();
        prosesValidasiGaji(this);
    });
    $(document).on('click.validasiGaji','#btnValidasiTolakGaji',function(e){
        e.preventDefault();
        prosesTolakGaji(this);
    });
    $(document).on('input.validasiGaji change.validasiGaji','[id*="gaji_"]',hitungTotalGajiPegawai);
    $(document).on('input.validasiGaji change.validasiGaji','#data_pegawai_tgl_mulai_kerja,#data_pegawai_tgl_akhir_kerja',hitungDurasiKerja);
    $(document).on('change.validasiGaji','#ppk_st_select',function(){
        const opt=$(this).find(':selected');
        $('#ppk_id_st').val(opt.attr('data-id-st')||'');
        $('#ppk_st').val(opt.val()||'');
        $('#jab_ppk_st').val(opt.attr('data-jabatan-st')||'');
        $('#status_ppk_st').val(opt.attr('data-status-st')||'');
    });
    $(document).on('change.validasiGaji','#ppk_spk_select',function(){
        const opt=$(this).find(':selected');
        $('#ppk_id_spk').val(opt.attr('data-id-spk')||'');
        $('#ppk_spk').val(opt.val()||'');
        $('#jab_ppk_spk').val(opt.attr('data-jabatan-spk')||'');
        $('#status_ppk_spk').val(opt.attr('data-status-spk')||'');
    });
    $(document).on('shown.bs.modal.validasiGaji','.modal',function(){
        $(this).find('#ppk_st_select,#ppk_spk_select').trigger('change');
    });
    $(document).on('hidden.bs.modal.validasiGaji','#modal',function(){
        pulihkanTombolValidasi();
    });
}
/* =========================================================
   TOMBOL PEMICU
========================================================= */
function simpanTombolValidasi(btn){
    if(!btn)return;
    tombolValidasiAktif=btn;
    htmlTombolValidasi=$(btn).html();
    $(btn).prop('disabled',true);
}
function pulihkanTombolValidasi(){
    if(!tombolValidasiAktif)return;
    $(tombolValidasiAktif).prop('disabled',false).removeAttr('disabled');
    if(htmlTombolValidasi)$(tombolValidasiAktif).html(htmlTombolValidasi);
    tombolValidasiAktif=null;
    htmlTombolValidasi='';
}
/* =========================================================
   PESAN
========================================================= */
function pesanValidasiGaji(message,status){
    window.parent.postMessage({type:'flash_message',message:message,status:status||'danger'},'*');
}
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
   TUTUP MODAL LAIN DAN BUKA MODAL VALIDASI
========================================================= */
function tutupModalLain(callback){
    const modalElement=document.getElementById('modal');
    const modalLain=Array.from(document.querySelectorAll('.modal.show')).filter(function(el){
        return el!==modalElement;
    });
    if(modalLain.length===0){
        callback();
        return;
    }
    let sisa=modalLain.length;
    modalLain.forEach(function(el){
        el.addEventListener('hidden.bs.modal',function(){
            sisa--;
            if(sisa===0)callback();
        },{once:true});
        const instance=bootstrap.Modal.getOrCreateInstance(el);
        instance.hide();
    });
}
function bukaModalValidasi(){
    const modalElement=document.getElementById('modal');
    if(!modalElement){
        pesanValidasiGaji('<b>GAGAL!</b><br>Modal tidak ditemukan.','danger');
        pulihkanTombolValidasi();
        return false;
    }
    if(typeof bootstrap==='undefined'||!bootstrap.Modal){
        pesanValidasiGaji('<b>GAGAL!</b><br>Bootstrap Modal belum tersedia.','danger');
        pulihkanTombolValidasi();
        return false;
    }
    window.modalValidasiGajiPegawai=bootstrap.Modal.getOrCreateInstance(modalElement,{backdrop:'static',keyboard:false});
    window.modalValidasiGajiPegawai.show();
    return true;
}
/* =========================================================
   BUKA MODAL VALIDASI GAJI
========================================================= */
function bukaValidasiGaji(id,userData,btn){
    const user=parseDataPegawai(userData);
    if(!user||!user.user_id){
        pesanValidasiGaji('<b>GAGAL!</b><br>Data pegawai tidak ditemukan.','danger');
        pulihkanTombolValidasi();
        return false;
    }
    if(typeof window.init_fungsi_validasi_gaji_pegawai==='function'&&!window.init_fungsi_validasi_gaji_pegawai()){
        pulihkanTombolValidasi();
        return false;
    }
    tutupModalLain(function(){
        window.validasiGajiPegawaiId=id;
        const form=document.getElementById('formDataPegawai');
        if(form)form.reset();
        $('#pegawai_id').val('');
        $('#pegawai_user_id').val(id);
        if(typeof window.isiDataPegawai==='function')window.isiDataPegawai(user);
        isiDataValidasiGaji(user);
        Validasi_Pelatihan(user);
        Validasi_Aksi(user);
        hitungTotalGajiPegawai();
        hitungDurasiKerja();
        Btn_Validasi_Gaji(user);
        bukaModalValidasi();
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
        if(typeof window.WarnaPrimary==='function')WarnaPrimary();
    }else if(catatan.includes('adendum')){
        inputAction.value='adendum';
        $('#dt_pelatihan').addClass('d-none');
        $('#data_pegawai_tmt_100').val($('#data_pegawai_tgl_mulai_kerja').val());
        $('#data_pegawai_tgl_akhir_pelatihan').val($('#data_pegawai_tgl_akhir_kerja').val());
        if(typeof window.WarnaPurple==='function')WarnaPurple();
    }else if(catatan.includes('lanjut')){
        inputAction.value='lanjut_kontrak';
        $('#dt_pelatihan').addClass('d-none');
        if(typeof window.WarnaSuccess==='function')WarnaSuccess();
    }else{
        inputAction.value='';
        if(typeof window.WarnaSuccess==='function')WarnaSuccess();
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
    const teks=$('#modalTitle').text().replace(/draft/gi,'Validasi Gaji ').replace(/_/g,' ').toLowerCase().replace(/\b\w/g,function(huruf){return huruf.toUpperCase();}).replace(/\bSpk\b/gi,'SPK');
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
   PROSES VALIDASI GAJI
========================================================= */
function prosesValidasiGaji(btn){
    const form=document.getElementById('formDataPegawai');
    if(!form){
        pesanValidasiGaji('<b>VALIDASI GAGAL!</b><br>Formulir Tidak Ditemukan!');
        return false;
    }
    const userId=$(form).find('[name="user_id"]').val();
    if(!userId){
        pesanValidasiGaji('<b>VALIDASI GAGAL!</b><br>Pegawai tidak ditemukan!');
        return false;
    }
    if(!form.checkValidity()){
        form.reportValidity();
        return false;
    }
    bersihkanRupiah(form);
    form.method='POST';
    form.target='ProsesFrame';
    $('#data_pegawai_catatan_surat').val($('#data_pegawai_catatan_surat').val().replace(/draft/gi,'Disetujui Gaji Pegawai'));
    const inputAction=form.querySelector('input[name="action"]');
    const action=inputAction?inputAction.value.trim():'';
    if(!action)return false;
    disableSubmit(btn);
    HTMLFormElement.prototype.submit.call(form);
    return false;
}
/* =========================================================
   PROSES TOLAK GAJI
========================================================= */
function prosesTolakGaji(btn){
    const form=document.getElementById('formDataPegawai');
    if(!form){
        pesanValidasiGaji('<b>VALIDASI GAGAL!</b><br>Formulir Tidak Ditemukan!');
        return false;
    }
    const userId=$(form).find('[name="user_id"]').val();
    if(!userId){
        pesanValidasiGaji('<b>VALIDASI GAGAL!</b><br>Pegawai tidak ditemukan!');
        return false;
    }
    if(!form.checkValidity()){
        form.reportValidity();
        return false;
    }
    bersihkanRupiah(form);
    form.method='POST';
    form.target='ProsesFrame';
    $('#data_pegawai_catatan_surat').val($('#data_pegawai_catatan_surat').val().replace(/draft/gi,'Ditolak Gaji Pegawai'));
    const inputAction=form.querySelector('input[name="action"]');
    if(!inputAction)return false;
    inputAction.value='tolak_'+inputAction.value.trim()+'_SPK';
    $('#formDataPegawai').find('input,select,textarea,button').not('[name="user_id"],[name="update"],[name="action"],[name="csrf"],[name="catatan_pegawai"]').prop('disabled',true);
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
