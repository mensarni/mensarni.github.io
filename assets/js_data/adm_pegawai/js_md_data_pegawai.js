
(function(){
if(window.dataPegawaiJsLoaded)return;
window.dataPegawaiJsLoaded=true;

/* =========================================================
   DATA GLOBAL PEGAWAI
========================================================= */
window.dataPegawaiDetailData = window.dataPegawaiDetailData || [];
window.bolehKelolaDataPegawai=window.bolehKelolaDataPegawai||false;
window.modal=null;
window.pegawaiDataId=null;
window.tombolProsesPegawaiAktif=null;
window.htmlTombolProsesPegawai='';

/* =========================================================
   INIT MODUL DATA PEGAWAI
========================================================= */
window.init_fungsi_pegawai=function(){
    const modalElement=document.getElementById('modal');
    if(!modalElement){
        console.error('Modal Data Pegawai tidak ditemukan.');
        return false;
    }
    if(!window.bootstrap||!bootstrap.Modal){
        console.error('Bootstrap Modal belum tersedia.');
        return false;
    }
    try{
        window.modal=bootstrap.Modal.getOrCreateInstance(modalElement,{
            backdrop:'static',
            keyboard:false
        });
        return true;
    }catch(error){
        console.error('Gagal inisialisasi modal pegawai:',error);
        return false;
    }
};

/* =========================================================
   SIMPAN STATUS TOMBOL
========================================================= */
window.simpanStatusTombolPegawai=function(btn){
    if(!btn)return;
    if(window.tombolProsesPegawaiAktif&&window.tombolProsesPegawaiAktif!==btn){
        window.restoreTombolPegawai();
    }
    if(window.tombolProsesPegawaiAktif!==btn){
        window.tombolProsesPegawaiAktif=btn;
        window.htmlTombolProsesPegawai=btn.innerHTML;
    }
};

/* =========================================================
   KEMBALIKAN TOMBOL PROSES / CETAK
========================================================= */
window.restoreTombolPegawai=function(){
    const btn=window.tombolProsesPegawaiAktif;
    if(!btn)return;
    $(btn).prop('disabled',false)
        .removeClass('disabled')
        .removeAttr('aria-disabled');
    btn.disabled=false;
    if(window.htmlTombolProsesPegawai!==''){
        btn.innerHTML=window.htmlTombolProsesPegawai;
    }
    window.tombolProsesPegawaiAktif=null;
    window.htmlTombolProsesPegawai='';
};

/* =========================================================
   TUTUP MODAL LAIN SEBELUM MEMBUKA MODAL PEGAWAI
========================================================= */
function tutupModalSebelumBuka(callback){
    const modalElement=document.getElementById('modal');
    if(!modalElement){
        console.error('Modal Data Pegawai tidak ditemukan.');
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
   BUKA MODAL DATA PEGAWAI
========================================================= */
function bukaModalPegawai(){
    const modalElement=document.getElementById('modal');
    if(!modalElement)return false;
    if(!window.bootstrap||!bootstrap.Modal)return false;
    try{
        window.modal=bootstrap.Modal.getOrCreateInstance(modalElement,{
            backdrop:'static',
            keyboard:false
        });
        window.modal.show();
        return true;
    }catch(error){
        console.error('Gagal membuka Modal Data Pegawai:',error);
        return false;
    }
}

/* =========================================================
   EVENT PROSES PEGAWAI
========================================================= */
$(document)
.off('click.dataPegawai','.btn-proses-pegawai')
.on('click.dataPegawai','.btn-proses-pegawai',function(e){
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
    window.simpanStatusTombolPegawai(btn);
    bukaProsesDataPegawai(id,userData,btn);
    return false;
});

/* =========================================================
   EVENT CETAK PEGAWAI
========================================================= */
$(document)
.off('click.dataPegawai','.btn-cetak-pegawai')
.on('click.dataPegawai','.btn-cetak-pegawai',function(e){
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
    window.simpanStatusTombolPegawai(btn);
    bukaCetakDataPegawai(id,userData,btn);
    return false;
});

/* =========================================================
   KEMBALIKAN TOMBOL KETIKA MODAL DITUTUP
========================================================= */
$(document)
.off('hidden.bs.modal.dataPegawai','.modal')
.on('hidden.bs.modal.dataPegawai','.modal',function(){
    if(this.id==='modal'){
        window.restoreTombolPegawai();
    }
});

/* =========================================================
   EVENT SIMPAN DATA PEGAWAI
========================================================= */
$(document)
.off('click.dataPegawai','#btnSimpanDataPegawai')
.on('click.dataPegawai','#btnSimpanDataPegawai',function(){
    return simpanDataPegawai(this);
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
   PROSES DATA PEGAWAI
========================================================= */
function bukaProsesDataPegawai(id,userData,btn){
    const user=parseDataPegawai(userData);
    if(!user||!user.user_id){
        window.top.postMessage({
            type:'flash_message',
            message:'<b>GAGAL!</b><br>Data pegawai tidak ditemukan.',
            status:'danger'
        },'*');
        window.restoreTombolPegawai();
        return false;
    }
    if(btn)disableSubmit(btn);
    tutupModalSebelumBuka(function(){
        window.pegawaiDataId=id;
        const form=document.getElementById('formDataPegawai');
        if(form)form.reset();
        $('#pegawai_id').val('');
        $('#pegawai_user_id').val(id);
        WarnaPrimary();
        isiDataPegawai(user);
        loadWilayah({
            provinsi:user.provinsi||'',
            kota_kabupaten:user.kota_kabupaten||'',
            kecamatan:user.kecamatan||'',
            kelurahan:user.kelurahan||''
        },function(berhasil){
            if(!berhasil){
                window.restoreTombolPegawai();
                window.top.postMessage({
                    type:'flash_message',
                    message:'<b>GAGAL!</b><br>Data wilayah gagal dimuat.',
                    status:'danger'
                },'*');
                return;
            }
            Btn_Proses(user);
            cekDataKeluarga();
            if(!bukaModalPegawai()){
                window.restoreTombolPegawai();
                window.top.postMessage({
                    type:'flash_message',
                    message:'<b>GAGAL!</b><br>Modal Data Pegawai gagal dibuka.',
                    status:'danger'
                },'*');
            }
        });
    });
    return true;
}

/* =========================================================
   TAMPILAN PROSES PEGAWAI
========================================================= */
function Btn_Proses(user){
    $('#modalTitle').text('Proses Data Pegawai');
    $('#modalNamaPegawai').text(user.nama_lengkap||'-');
    $('#modalNIPKPegawai').text(user.nipk||'-');
    $('#formDataPegawai').removeClass('d-none');
    $('#btnSimpanDataPegawai').removeClass('d-none');
    $('#boxCetakDataPegawai').addClass('d-none');
    $('#btnCetakPegawai').addClass('d-none');
    $('#modal .modal-dialog').addClass('modal-dialog-scrollable');
}

/* =========================================================
   CETAK DATA PEGAWAI
========================================================= */
function bukaCetakDataPegawai(id,userData,btn){
    const user=parseDataPegawai(userData);
    if(!user||!user.user_id){
        window.top.postMessage({
            type:'flash_message',
            message:'<b>GAGAL!</b><br>Data pegawai tidak ditemukan.',
            status:'danger'
        },'*');
        window.restoreTombolPegawai();
        return false;
    }
    if(btn)disableSubmit(btn);
    tutupModalSebelumBuka(function(){
        window.pegawaiDataId=id;
        const form=document.getElementById('formDataPegawai');
        if(form)form.reset();
        $('#pegawai_id').val('');
        $('#pegawai_user_id').val(id);
        WarnaSuccess();
        isiDataPegawai(user);
        loadWilayah({
            provinsi:user.provinsi||'',
            kota_kabupaten:user.kota_kabupaten||'',
            kecamatan:user.kecamatan||'',
            kelurahan:user.kelurahan||''
        },function(berhasil){
            if(!berhasil){
                window.restoreTombolPegawai();
                window.top.postMessage({
                    type:'flash_message',
                    message:'<b>GAGAL!</b><br>Data wilayah gagal dimuat.',
                    status:'danger'
                },'*');
                return;
            }
            Btn_Cetak(user);
            if(!bukaModalPegawai()){
                window.restoreTombolPegawai();
                window.top.postMessage({
                    type:'flash_message',
                    message:'<b>GAGAL!</b><br>Modal Data Pegawai gagal dibuka.',
                    status:'danger'
                },'*');
            }
        });
    });
    return true;
}

/* =========================================================
   TAMPILAN CETAK PEGAWAI
========================================================= */
function Btn_Cetak(user){
    $('#modalTitle').text('Cetak Data Pegawai');
    $('#modalNamaPegawai').text(user.nama_lengkap||'-');
    $('#modalNIPKPegawai').text(user.nipk||'-');
    $('#formDataPegawai').addClass('d-none');
    $('#boxCetakDataPegawai').removeClass('d-none');
    $('#btnSimpanDataPegawai').addClass('d-none');
    $('#btnCetakPegawai').removeClass('d-none');
    $('#modal .modal-dialog').removeClass('modal-dialog-scrollable');
}

/* =========================================================
   SIMPAN DATA PEGAWAI
========================================================= */
function simpanDataPegawai(btn){
    const form=document.getElementById('formDataPegawai');
    if(!form){
        window.top.postMessage({
            type:'flash_message',
            message:'<b>GAGAL!</b><br>Formulir Tidak Ditemukan!',
            status:'danger'
        },'*');
        return false;
    }
    const userId=$(form).find('[name="user_id"]').val();
    if(!userId){
        window.top.postMessage({
            type:'flash_message',
            message:'<b>GAGAL!</b><br>Pegawai tidak ditemukan!',
            status:'danger'
        },'*');
        return false;
    }
    if(!form.checkValidity()){
        form.reportValidity();
        return false;
    }
    $(form).find('.rupiah').each(function(){
        this.value=this.value.replace(/[^\d]/g,'');
    });
    form.method='POST';
    form.action='';
    form.target='ProsesFrame';
    if(btn)disableSubmit(btn);
    return true;
}

/* =========================================================
   CEK DATA KELUARGA
========================================================= */
function cekDataKeluarga(){
    var daftarAnak=[1,2,3,4];
    $.each(daftarAnak,function(index,nomor){
        var nilai=$('#data_pegawai_anak_'+nomor).val();
        if(
            nilai===undefined||
            nilai===null||
            $.trim(String(nilai))===''||
            $.trim(String(nilai))==='0'
        ){
            $('#row_anak_'+nomor).css('display','none');
        }else{
            $('#row_anak_'+nomor).css('display','flex');
        }
    });
    var istri=$('#data_pegawai_istri').val();
    if(
        istri===undefined||
        istri===null||
        $.trim(String(istri))===''||
        $.trim(String(istri))==='0'
    ){
        $('#row_istri').css('display','none');
    }else{
        $('#row_istri').css('display','flex');
    }
    cekTombolTambahAnak();
}

/* =========================================================
   CEK TOMBOL TAMBAH ANAK
========================================================= */
function cekTombolTambahAnak(){
    var adaKosong=false;
    for(var i=1;i<=4;i++){
        var nilai=$('#data_pegawai_anak_'+i).val();
        if(
            nilai===undefined||
            nilai===null||
            $.trim(String(nilai))===''||
            $.trim(String(nilai))==='0'
        ){
            adaKosong=true;
            break;
        }
    }
    if(adaKosong){
        $('#btn_tambah_anak').show();
    }else{
        $('#btn_tambah_anak').hide();
    }
}

/* =========================================================
   EVENT TOMBOL TAMBAH ANAK
========================================================= */
$(document)
.off('click.dataPegawai','#btn_tambah_anak')
.on('click.dataPegawai','#btn_tambah_anak',function(){
    for(var i=1;i<=4;i++){
        var nilai=$('#data_pegawai_anak_'+i).val();
        if(
            nilai===undefined||
            nilai===null||
            $.trim(String(nilai))===''||
            $.trim(String(nilai))==='0'
        ){
            $('#row_anak_'+i).css('display','flex');
            $('#data_pegawai_anak_'+i).focus();
            break;
        }
    }
    cekTombolTambahAnak();
});

/* =========================================================
   EVENT INPUT NAMA ANAK
========================================================= */
$(document)
.off('input.dataPegawai change.dataPegawai','#data_pegawai_anak_1,#data_pegawai_anak_2,#data_pegawai_anak_3,#data_pegawai_anak_4')
.on('input.dataPegawai change.dataPegawai','#data_pegawai_anak_1,#data_pegawai_anak_2,#data_pegawai_anak_3,#data_pegawai_anak_4',function(){
    var id=$(this).attr('id');
    var nomor=id.replace('data_pegawai_anak_','');
    var nilai=$(this).val();
    if(
        nilai===undefined||
        nilai===null||
        $.trim(String(nilai))===''||
        $.trim(String(nilai))==='0'
    ){
        $('#row_anak_'+nomor).css('display','none');
    }else{
        $('#row_anak_'+nomor).css('display','flex');
    }
    cekTombolTambahAnak();
});

})();
