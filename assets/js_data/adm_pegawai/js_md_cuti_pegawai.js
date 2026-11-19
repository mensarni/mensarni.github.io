(function(){
if(window.cutiPegawaiJsLoaded)return;
window.cutiPegawaiJsLoaded=true;
window.dataPegawaicuti=window.dataPegawaicuti||[];
window.modalCutiPegawai=null;
window.pegawaicutiId=null;

/* =========================================================
   INISIALISASI MODAL
========================================================= */
window.init_fungsi_cuti_pegawai=function(){
    var modalElement=document.getElementById('modal');
    if(!modalElement){
        console.error('Modal cuti tidak ditemukan.');
        return false;
    }
    if(window.bootstrap&&window.bootstrap.Modal){
        window.modalCutiPegawai=window.bootstrap.Modal.getOrCreateInstance(modalElement,{
            backdrop:'static',
            keyboard:false
        });
    }else if(window.jQuery&&typeof $(modalElement).modal==='function'){
        window.modalCutiPegawai={
            show:function(){$(modalElement).modal('show');},
            hide:function(){$(modalElement).modal('hide');}
        };
    }else{
        console.error('Bootstrap Modal belum dimuat.');
        return false;
    }
    return true;
};

/* =========================================================
   BANTUAN MODAL
========================================================= */
function tampilkanModalCuti(){
    if(!window.modalCutiPegawai&&!window.init_fungsi_cuti_pegawai())return false;
    window.modalCutiPegawai.show();
    return true;
}
function pesancuti(message,status){
    window.parent.postMessage({
        type:'flash_message',
        message:message,
        status:status||'danger'
    },'*');
}
function warnaCuti(nama){
    if(typeof window[nama]==='function'){
        window[nama]();
    }
}

/* =========================================================
   KOSONGKAN MODAL SEBELUM DIBUKA
========================================================= */
function bersihkanModalCuti(){
    var form=document.getElementById('formproses');
    if(form){
        form.reset();
        $(form).find(':input').each(function(){
            var name=this.name||'';
            if(this.type==='hidden'&&(
                name==='csrf'||
                name==='_csrf'||
                name==='csrf_token'||
                name==='token'
            ))return;
            if(this.type==='checkbox'||this.type==='radio'){
                this.checked=false;
            }else if(this.tagName==='SELECT'){
                this.selectedIndex=0;
            }else{
                this.value='';
            }
            $(this).removeClass('is-invalid is-valid');
            $(this).prop('disabled',false);
        });
    }
    if(typeof window.resetTanggalCuti==='function'){
        window.resetTanggalCuti();
    }
    window.pegawaicutiId=null;
    $('#user_id,#cuti_id,#action').val('');
    $('#modalTitle,#modalNamaPegawai,#modalNIPKPegawai').text('');
    $('#cuti_nama,#cuti_nipk,#cuti_terpakai').val('');
    $('#form_proses_cuti').addClass('d-none');
    $('#list_tabel_cuti').addClass('d-none');
    $('#btnKembali,#btnSimpancuti').addClass('d-none');
    $('#btnTutup').removeClass('d-none');
    $('#modal-dialog,#modal .modal-dialog').removeClass('modal-lg modal-xl modal-dialog-scrollable');
}

/* =========================================================
   PARSE DATA PEGAWAI
========================================================= */
function parseDatacutiPegawai(data){
    if(typeof data==='object'&&data!==null)return data;
    try{
        return JSON.parse(data||'{}');
    }catch(e){
        console.error('JSON pegawai tidak valid:',e);
        return {};
    }
}

/* =========================================================
   CARI DATA PEGAWAI
========================================================= */
function cariDataPegawaicuti(userId){
    return (window.dataPegawaicuti||[]).find(function(pegawai){
        return String(pegawai.user_id)===String(userId);
    })||{};
}

/* =========================================================
   ISI PROFIL PEGAWAI
========================================================= */
function isiDataPegawaicuti(user){
    user=user||{};
    if(typeof window.isiDataPegawai==='function'){
        window.isiDataPegawai(user);
    }
    $('#user_id').val(user.user_id||'');
    $('#cuti_nama').val(user.nama_lengkap||'');
    $('#cuti_nipk').val(user.nipk||'');
    $('#cuti_terpakai').val(user.cuti_terpakai||0);
}

/* =========================================================
   TAMPILAN LIST
========================================================= */
window.btn_list_tabel_cuti=function(){
    $('#modalTitle').text('Data Pegawai Proses Cuti');
    $('#modal-dialog,#modal .modal-dialog').removeClass('modal-lg').addClass('modal-xl');
    $('#list_tabel_cuti').removeClass('d-none');
    $('#form_proses_cuti').addClass('d-none');
    $('#btnKembali,#btnSimpancuti').addClass('d-none');
    $('#btnTutup').removeClass('d-none');
    $('#modalNamaPegawai').text('PT Mentari Sarana Niaga');
    $('#modalNIPKPegawai').text('Tabel Data Pegawai');
    warnaCuti('WarnaSuccess');
};

/* =========================================================
   MODAL LIST PEGAWAI CUTI
========================================================= */
window.bukaModalListCutiPegawai=function(){
    if(!window.modalCutiPegawai&&!window.init_fungsi_cuti_pegawai()){
        pesancuti('<b>GAGAL!</b><br>Modal cuti tidak dapat diinisialisasi.');
        return false;
    }
    bersihkanModalCuti();
    window.btn_list_tabel_cuti();
    return tampilkanModalCuti();
};

/* =========================================================
   TAMPILAN PROSES
========================================================= */
window.btn_proses_cuti=function(id,nama_lengkap,nipk){
    $('#modalTitle').text('Proses Cuti Pegawai');
    $('#modal-dialog,#modal .modal-dialog').removeClass('modal-xl').addClass('modal-lg');
    $('#form_proses_cuti').removeClass('d-none');
    $('#list_tabel_cuti').addClass('d-none');
    $('#modalNamaPegawai').text(nama_lengkap||'-');
    $('#modalNIPKPegawai').text(nipk||'-');
    $('#btnKembali').removeClass('d-none');
    $('#btnSimpancuti').removeClass('d-none').prop('disabled',false);
    $('#btnTutup').addClass('d-none');
    $('#action').val('ajuan_cuti');
    $('#cuti_id').val('');
    warnaCuti('WarnaPurple');
};

/* =========================================================
   BUKA PROSES CUTI
========================================================= */
window.bukaProsescutiPegawai=function(id,userData){
    var user=parseDatacutiPegawai(userData);
    if(!user||!user.user_id)user=cariDataPegawaicuti(id);
    if(!user||!user.user_id){
        pesancuti('<b>GAGAL!</b><br>Data pegawai tidak ditemukan.');
        return false;
    }
    if(!window.modalCutiPegawai&&!window.init_fungsi_cuti_pegawai()){
        pesancuti('<b>GAGAL!</b><br>Modal cuti tidak dapat diinisialisasi.');
        return false;
    }
    bersihkanModalCuti();
    window.pegawaicutiId=id;
    $('#user_id').val(user.user_id||id);
    warnaCuti('WarnaPrimary');
    isiDataPegawaicuti(user);
    window.btn_proses_cuti(id,user.nama_lengkap,user.nipk);
    return tampilkanModalCuti();
};

/* =========================================================
   KEMBALI KE LIST
========================================================= */
window.btn_kembali=function(){
    bersihkanModalCuti();
    window.btn_list_tabel_cuti();
};

/* =========================================================
   ISI INPUT EDIT
========================================================= */
function isiInputcuti(form,id,nilai){
    var input=form.querySelector('#'+id)||form.querySelector('[name="'+id+'"]');
    if(!input)return;
    nilai=nilai==null?'':String(nilai).trim();
    if(input.type==='date'&&nilai!==''){
        var tanggal=nilai.substring(0,10);
        if(!/^\d{4}-\d{2}-\d{2}$/.test(tanggal)){
            var parsed=new Date(nilai);
            nilai=!isNaN(parsed.getTime())
                ?parsed.getFullYear()+'-'+String(parsed.getMonth()+1).padStart(2,'0')+'-'+String(parsed.getDate()).padStart(2,'0')
                :'';
        }else{
            nilai=tanggal;
        }
    }
    input.value=nilai;
    input.dispatchEvent(new Event('change',{bubbles:true}));
}

/* =========================================================
   TAMPILAN EDIT
========================================================= */
window.btn_edit_cuti=function(id,nama_lengkap,nipk){
    $('#modalTitle').text('Edit Cuti Pegawai');
    $('#modal-dialog,#modal .modal-dialog').removeClass('modal-xl').addClass('modal-lg');
    $('#modalNamaPegawai').text(nama_lengkap||'-');
    $('#modalNIPKPegawai').text(nipk||'-');
    $('#list_tabel_cuti').addClass('d-none');
    $('#form_proses_cuti').removeClass('d-none');
    $('#btnKembali').removeClass('d-none');
    $('#btnSimpancuti').removeClass('d-none').prop('disabled',false);
    $('#btnTutup').addClass('d-none');
    $('#action').val('update_cuti');
    warnaCuti('WarnaPrimary');
};

/* =========================================================
   EDIT CUTI
========================================================= */
window.edit_cuti=function(data){
    data=data||{};
    var form=document.getElementById('formproses');
    if(!form){
        pesancuti('<b>GAGAL!</b><br>Form tidak ditemukan.');
        return false;
    }
    if(!window.modalCutiPegawai&&!window.init_fungsi_cuti_pegawai()){
        pesancuti('<b>GAGAL!</b><br>Modal cuti tidak dapat diinisialisasi.');
        return false;
    }
    bersihkanModalCuti();
    var pegawai=cariDataPegawaicuti(data.user_id);
    var nama=pegawai.nama_lengkap||data.nama_lengkap||data.nama||'';
    var nipk=pegawai.nipk||data.nipk||'';
    var field=[
        'id','user_id','status_pegawai','jenis_cuti','alasan_cuti',
        'tgl_mulai','tgl_selesai','jumlah_hari','alamat_cuti',
        'no_hp_selama_cuti','status_pengajuan','tanggal_pengajuan',
        'tanggal_disetujui','catatan_persetujuan','nomor_surat',
        'potong_saldo','verifikator_id','verifikator','jab_verifikator',
        'ppk_id','ppk','jab_ppk','created_at','updated_at'
    ];
    field.forEach(function(id){
        isiInputcuti(form,id,data[id]);
    });
    $('#user_id').val(data.user_id||'');
    var mulai=form.querySelector('[name="tgl_mulai"]');
    var selesai=form.querySelector('[name="tgl_selesai"]');
    if(mulai&&selesai){
        selesai.disabled=false;
        mulai.value=data.tgl_mulai||'';
        selesai.value=data.tgl_selesai||'';
        mulai.dispatchEvent(new Event('change',{bubbles:true}));
        selesai.dispatchEvent(new Event('change',{bubbles:true}));
    }
    if(typeof window.setTanggalCuti==='function'){
        window.setTanggalCuti(data.tanggal_cuti||'[]');
    }
    if(typeof window.tanggalCutiTerpilih!=='undefined'&&Array.isArray(window.tanggalCutiTerpilih)){
        $('#jumlah_hari').val(window.tanggalCutiTerpilih.length);
    }
    isiDataPegawaicuti(pegawai);
    [
        'verifikator_id','verifikator','jab_verifikator',
        'ppk_id','ppk','jab_ppk'
    ].forEach(function(id){
        var input=form.querySelector('[name="'+id+'"], #'+id);
        if(input)input.value=data[id]||'';
    });
    $('#cuti_id').val(data.id||'');
    $('#user_id').val(data.user_id||'');
    $('#action').val('update_cuti');
    window.pegawaicutiId=data.user_id||null;
    window.btn_edit_cuti(data.id,nama,nipk);
    return tampilkanModalCuti();
};

/* =========================================================
   SIMPAN CUTI
========================================================= */
window.simpancutiPegawai=function(btn){
    var form=document.getElementById('formproses');
    if(!form){
        pesancuti('<b>GAGAL!</b><br>Form cuti pegawai tidak ditemukan.');
        return false;
    }
    var userId=$(form).find('[name="user_id"]').val();
    if(!userId){
        pesancuti('<b>GAGAL!</b><br>ID pegawai tidak ditemukan.');
        return false;
    }
    var action=$(form).find('[name="action"]').val();
    if(!action||!['ajuan_cuti','update_cuti'].includes(action)){
        pesancuti('<b>GAGAL!</b><br>Aksi pengajuan cuti tidak valid.');
        return false;
    }
    if(typeof window.validasiFormCuti==='function'){
        if(!window.validasiFormCuti())return false;
    }else{
        pesancuti('<b>GAGAL!</b><br>Validasi kalender cuti tidak ditemukan.');
        return false;
    }
    var valid=true;
    $(form).find('[required]:enabled').each(function(){
        if(!String($(this).val()||'').trim()){
            valid=false;
            $(this).addClass('is-invalid');
            this.focus();
            return false;
        }
        $(this).removeClass('is-invalid');
    });
    if(!valid){
        pesancuti('<b>GAGAL!</b><br>Data wajib diisi.');
        return false;
    }
    form.method='POST';
    form.target='ProsesFrame';
    if(btn&&typeof window.disableSubmit==='function'){
        window.disableSubmit(btn);
    }else if(btn){
        btn.disabled=true;
    }
    return true;
};

/* =========================================================
   EVENT TOMBOL
========================================================= */
$(document)
.off('click.cutiPegawai','#btnBukaModalCuti')
.on('click.cutiPegawai','#btnBukaModalCuti',function(e){
    e.preventDefault();
    if(typeof window.bukaModalAmbilPegawai==='function'){
        window.bukaModalAmbilPegawai();
    }else{
        window.bukaModalListCutiPegawai();
    }
    return false;
})
.off('click.cutiPegawai','.btn-ambil-cuti-pegawai')
.on('click.cutiPegawai','.btn-ambil-cuti-pegawai',function(e){
    e.preventDefault();
    e.stopPropagation();
    window.bukaModalListCutiPegawai();
    return false;
})
.off('click.cutiPegawai','.btn-pilih-cuti-pegawai')
.on('click.cutiPegawai','.btn-pilih-cuti-pegawai',function(e){
    e.preventDefault();
    e.stopPropagation();
    var id=$(this).attr('data-id')||$(this).attr('data-user-id');
    var userData=$(this).attr('data-user');
    if(!id){
        pesancuti('<b>GAGAL!</b><br>ID pegawai tidak ditemukan.');
        return false;
    }
    window.bukaProsescutiPegawai(id,userData);
    return false;
})
.off('click.cutiPegawai','.btn-edit-cuti')
.on('click.cutiPegawai','.btn-edit-cuti',function(e){
    e.preventDefault();
    e.stopPropagation();
    var data;
    try{
        data=JSON.parse(this.getAttribute('data-cuti')||'{}');
    }catch(error){
        pesancuti('<b>GAGAL!</b><br>Data cuti tidak valid.');
        return false;
    }
    window.edit_cuti(data);
    return false;
})
.off('click.cutiPegawai','#btnSimpancuti')
.on('click.cutiPegawai','#btnSimpancuti',function(e){
    e.preventDefault();
    return window.simpancutiPegawai(this);
});

/* =========================================================
   CETAK PDF CUTI PEGAWAI
========================================================= */
$(document)
.off('click.cutiPegawai','.btn-cetak-cuti-pegawai')
.on('click.cutiPegawai','.btn-cetak-cuti-pegawai',function(e){
    var btn=this;
    var form=btn.closest('form');
    if(!form){
        e.preventDefault();
        pesancuti('<b>Gagal!</b><br>Formulir tidak ditemukan.');
        return false;
    }
    if(!form.checkValidity()){
        e.preventDefault();
        form.reportValidity();
        return false;
    }
    if(btn.dataset.processing==='1'){
        e.preventDefault();
        return false;
    }
    btn.dataset.processing='1';
    setTimeout(function(){
        btn.disabled=true;
        btn.innerHTML='<i class="fa-light fa-spinner fa-spin me-1"></i> Memproses...';
    },0);
    setTimeout(function(){
        if(window.parent&&typeof window.parent.callbackPage==='function'){
            window.parent.callbackPage();
        }
    },2500);
    return true;
});

/* =========================================================
   PAGINATION TABEL PEGAWAI
========================================================= */
function initPaginationCuti(){
    var tbody=document.getElementById('daftarPegawai');
    var pagination=document.getElementById('paginationPegawai');
    var info=document.getElementById('infoPaginationPegawai');
    var pencarian=document.getElementById('cariPegawai');
    if(!tbody||!pagination||!info)return;
    if(tbody.dataset.paginationCuti==='1')return;
    tbody.dataset.paginationCuti='1';
    var semuaBaris=Array.from(tbody.querySelectorAll('tr'));
    var perHalaman=10;
    var halamanAktif=1;
    var hasilFilter=semuaBaris.slice();
    function renderPagination(){
        var total=hasilFilter.length;
        var totalHalaman=Math.ceil(total/perHalaman);
        if(halamanAktif>totalHalaman)halamanAktif=Math.max(1,totalHalaman);
        semuaBaris.forEach(function(baris){
            baris.style.display='none';
        });
        var mulai=(halamanAktif-1)*perHalaman;
        var akhir=Math.min(mulai+perHalaman,total);
        hasilFilter.slice(mulai,akhir).forEach(function(baris,index){
            baris.style.display='';
            var nomor=baris.querySelector('.nomor-pegawai');
            if(nomor)nomor.textContent=mulai+index+1;
        });
        info.textContent=total
            ?'Menampilkan '+(mulai+1)+'-'+akhir+' dari '+total+' pegawai'
            :'Data pegawai tidak ditemukan';
        pagination.innerHTML='';
        function tambahTombol(label,halaman,disabled,aktif){
            var li=document.createElement('li');
            li.className='page-item '+(disabled?' disabled':'')+(aktif?' active':'');
            var btn=document.createElement('button');
            btn.type='button';
            btn.className='page-link';
            btn.textContent=label;
            btn.disabled=disabled;
            btn.addEventListener('click',function(){
                halamanAktif=halaman;
                renderPagination();
            });
            li.appendChild(btn);
            pagination.appendChild(li);
        }
        if(totalHalaman>1){
            tambahTombol('<',halamanAktif-1,halamanAktif<=1,false);
            for(var p=1;p<=totalHalaman;p++){
                tambahTombol(String(p),p,false,p===halamanAktif);
            }
            tambahTombol('>',halamanAktif+1,halamanAktif>=totalHalaman,false);
        }
    }
    if(pencarian){
        $(pencarian).off('input.cutiPegawai').on('input.cutiPegawai',function(){
            var kata=this.value.toLowerCase().trim();
            hasilFilter=semuaBaris.filter(function(baris){
                return baris.textContent.toLowerCase().indexOf(kata)!==-1;
            });
            halamanAktif=1;
            renderPagination();
        });
    }
    renderPagination();
}

/* =========================================================
   KONFIRMASI HAPUS
========================================================= */
window.konfirmasiHapuscuti=function(form){
    var tombol=form.querySelector('button[type="submit"]');
    if(!confirm('Yakin ingin menghapus data cuti pegawai ini?')){
        if(tombol){
            tombol.disabled=false;
            tombol.innerHTML='<i class="fa-light fa-trash"></i> Hapus';
            tombol.classList.remove('disabled');
        }
        try{
            if(typeof window.parent.callbackPage==='function'){
                window.parent.callbackPage();
            }else{
                window.parent.location.reload();
            }
        }catch(e){
            window.parent.location.reload();
        }
        return false;
    }
    if(tombol){
        tombol.disabled=true;
        tombol.innerHTML='<i class="fa-light fa-spinner fa-spin"></i> Memproses...';
    }
    return true;
};

/* =========================================================
   INISIALISASI
========================================================= */
$(function(){
    window.init_fungsi_cuti_pegawai();
    initPaginationCuti();
});
})();
