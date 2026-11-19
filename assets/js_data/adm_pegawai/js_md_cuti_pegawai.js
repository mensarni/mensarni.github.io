(function(){
if(window.cutiPegawaiJsLoaded)return;
window.cutiPegawaiJsLoaded=true;

/* =========================================================
   DATA DAN VARIABEL GLOBAL
========================================================= */
window.dataPegawaicuti=window.dataPegawaicuti||[];
window.modalCutiPegawai=null;
window.pegawaicutiId=null;

/* =========================================================
   INIT MODUL CUTI
========================================================= */
window.init_fungsi_cuti_pegawai=function(){
    const modalElement=document.getElementById('modal');
    window.modalCutiPegawai=null;
    if(!modalElement){
        console.error('Modal Cuti Pegawai tidak ditemukan.');
        return false;
    }
    if(!window.bootstrap||!bootstrap.Modal){
        console.error('Bootstrap Modal belum dimuat.');
        return false;
    }
    window.modalCutiPegawai=bootstrap.Modal.getOrCreateInstance(modalElement,{
        backdrop:'static',
        keyboard:false
    });
    return true;
};

/* =========================================================
   PESAN
========================================================= */
function pesancuti(message,status){
    window.parent.postMessage({
        type:'flash_message',
        message:message,
        status:status||'danger'
    },'*');
}

/* =========================================================
   BERSIHKAN MODAL DAN FORM CUTI
========================================================= */
function bersihkanModalCuti(){
    const form=document.getElementById('formproses');
    if(form){
        form.reset();
        $(form).find('input:not([type="hidden"]):not([type="button"]):not([type="submit"]):not([type="reset"]),textarea').val('');
        $(form).find('select').prop('selectedIndex',0);
        $(form).find('input[type="checkbox"],input[type="radio"]').prop('checked',false);
        $(form).find('input[type="file"]').val('');
        $(form).find('input[type="hidden"]').not('[name="csrf"],[name="_csrf"],[name="csrf_token"],[name="token"]').val('');
        $(form).find(':input').prop('disabled',false).removeClass('is-invalid');
    }
    $('#user_id,#cuti_id,#action').val('');
    $('#cuti_nama,#cuti_nipk').val('');
    $('#cuti_terpakai').val('0');
    $('#modalNamaPegawai,#modalNIPKPegawai').text('');
    $('#form_proses_cuti').addClass('d-none');
    $('#list_tabel_cuti').addClass('d-none');
    $('#btnKembali,#btnSimpancuti').addClass('d-none');
    $('#btnTutup').removeClass('d-none');
    $('#modal-dialog').removeClass('modal-lg modal-dialog-scrollable').addClass('modal-xl');
    if(typeof window.resetTanggalCuti==='function'){
        window.resetTanggalCuti();
    }
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
   BUKA MODAL LIST PEGAWAI
========================================================= */
window.bukaModalAmbilPegawaiCuti=function(){
    if(!window.modalCutiPegawai&&!window.init_fungsi_cuti_pegawai()){
        pesancuti('<b>GAGAL!</b><br>Modal Cuti tidak dapat diinisialisasi.');
        return false;
    }
    bersihkanModalCuti();
    btn_list_tabel_cuti();
    window.modalCutiPegawai.show();
    return true;
};

/* =========================================================
   EVENT BUKA MODAL LIST CUTI
========================================================= */
$(document)
.off('click.cutiPegawai','#btnBukaModalCuti')
.on('click.cutiPegawai','#btnBukaModalCuti',function(e){
    e.preventDefault();
    e.stopPropagation();
    window.bukaModalAmbilPegawaiCuti();
    return false;
});

/* =========================================================
   EVENT TOMBOL AMBIL CUTI
========================================================= */
$(document)
.off('click.cutiPegawai','.btn-ambil-cuti-pegawai')
.on('click.cutiPegawai','.btn-ambil-cuti-pegawai',function(e){
    e.preventDefault();
    e.stopPropagation();
    window.bukaModalAmbilPegawaiCuti();
    return false;
});

/* =========================================================
   EVENT PILIH PEGAWAI
========================================================= */
$(document)
.off('click.cutiPegawai','.btn-pilih-cuti-pegawai')
.on('click.cutiPegawai','.btn-pilih-cuti-pegawai',function(e){
    e.preventDefault();
    e.stopPropagation();
    const id=$(this).attr('data-id')||$(this).attr('data-user-id');
    const userData=$(this).attr('data-user');
    if(!id){
        pesancuti('<b>GAGAL!</b><br>ID pegawai tidak ditemukan.');
        return false;
    }
    bukaProsescutiPegawai(id,userData);
    return false;
});

/* =========================================================
   EVENT EDIT CUTI
========================================================= */
$(document)
.off('click.cutiPegawai','.btn-edit-cuti')
.on('click.cutiPegawai','.btn-edit-cuti',function(e){
    e.preventDefault();
    e.stopPropagation();
    let data;
    try{
        data=JSON.parse(this.getAttribute('data-cuti')||'{}');
    }catch(error){
        pesancuti('<b>GAGAL!</b><br>Data cuti tidak valid.');
        return false;
    }
    window.edit_cuti(data);
    return false;
});

/* =========================================================
   EVENT SIMPAN CUTI
========================================================= */
$(document)
.off('click.cutiPegawai','#btnSimpancuti')
.on('click.cutiPegawai','#btnSimpancuti',function(e){
    return simpancutiPegawai(this);
});

/* =========================================================
   EVENT CETAK PDF CUTI PEGAWAI
========================================================= */
$(document)
.off('click.cutiPegawai','.btn-cetak-cuti-pegawai')
.on('click.cutiPegawai','.btn-cetak-cuti-pegawai',function(e){
    const btn=this;
    const form=btn.closest('form');
    if(!form){
        e.preventDefault();
        pesancuti('<b>GAGAL!</b><br>Formulir tidak ditemukan.');
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
   KEMBALI KE LIST SAAT MODAL DITUTUP
========================================================= */
$(document)
.off('hidden.bs.modal.cutiPegawai','.modal')
.on('hidden.bs.modal.cutiPegawai','.modal',function(){
    if(this.id==='modal'){
        bersihkanModalCuti();
    }
});

/* =========================================================
   BUKA PROSES CUTI PEGAWAI
========================================================= */
function bukaProsescutiPegawai(id,userData){
    let user=parseDatacutiPegawai(userData);
    if(!user||!user.user_id)user=cariDataPegawaicuti(id);
    if(!user||!user.user_id){
        pesancuti('<b>GAGAL!</b><br>Data pegawai tidak ditemukan.');
        return false;
    }
    if(!window.modalCutiPegawai&&!window.init_fungsi_cuti_pegawai()){
        pesancuti('<b>GAGAL!</b><br>Modal Cuti tidak dapat diinisialisasi.');
        return false;
    }
    bersihkanModalCuti();
    window.pegawaicutiId=id;
    $('#user_id').val(id);
    if(typeof WarnaPrimary==='function')WarnaPrimary();
    isiDataPegawaicuti(user);
    btn_proses_cuti(id,user.nama_lengkap,user.nipk);
    window.modalCutiPegawai.show();
    return true;
}

/* =========================================================
   ISI PROFIL PEGAWAI
========================================================= */
function isiDataPegawaicuti(user){
    user=user||{};
    if(typeof isiDataPegawai==='function')isiDataPegawai(user);
    $('#user_id').val(user.user_id||'');
    $('#cuti_nama').val(user.nama_lengkap||'');
    $('#cuti_nipk').val(user.nipk||'');
    $('#cuti_terpakai').val(user.cuti_terpakai||0);
}

/* =========================================================
   TAMPILAN PROSES
========================================================= */
function btn_proses_cuti(id,nama_lengkap,nipk){
    $('#modalTitle').text('Proses Cuti Pegawai');
    $('#modal-dialog').removeClass('modal-xl').addClass('modal-lg');
    $('#form_proses_cuti').removeClass('d-none');
    $('#list_tabel_cuti').addClass('d-none');
    $('#modalNamaPegawai').text(nama_lengkap||'-');
    $('#modalNIPKPegawai').text(nipk||'-');
    $('#btnKembali').removeClass('d-none');
    $('#btnSimpancuti').removeClass('d-none').prop('disabled',false);
    $('#btnTutup').addClass('d-none');
    $('#action').val('ajuan_cuti');
    $('#cuti_id').val('');
    if(typeof WarnaPurple==='function')WarnaPurple();
}

/* =========================================================
   TAMPILAN LIST
========================================================= */
function btn_list_tabel_cuti(){
    $('#modalTitle').text('Data Pegawai Proses Cuti');
    $('#modal-dialog').removeClass('modal-lg').addClass('modal-xl');
    $('#list_tabel_cuti').removeClass('d-none');
    $('#form_proses_cuti').addClass('d-none');
    $('#btnKembali').addClass('d-none');
    $('#btnSimpancuti').addClass('d-none');
    $('#btnTutup').removeClass('d-none');
    $('#modalNamaPegawai').text('PT Mentari Sarana Niaga');
    $('#modalNIPKPegawai').text('Tabel Data Pegawai');
    if(typeof WarnaSuccess==='function')WarnaSuccess();
}

/* =========================================================
   KEMBALI KE LIST
========================================================= */
window.btn_kembali=function(){
    bersihkanModalCuti();
    btn_list_tabel_cuti();
};

/* =========================================================
   ISI INPUT EDIT
========================================================= */
function isiInputcuti(form,id,nilai){
    const input=form.querySelector('#'+id)||form.querySelector('[name="'+id+'"]');
    if(!input)return;
    nilai=nilai==null?'':String(nilai).trim();
    if(input.type==='date'&&nilai!==''){
        const tanggal=nilai.substring(0,10);
        if(!/^\d{4}-\d{2}-\d{2}$/.test(tanggal)){
            const parsed=new Date(nilai);
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
function btn_edit_cuti(id,nama_lengkap,nipk){
    $('#modalTitle').text('Edit Cuti Pegawai');
    $('#modal-dialog').removeClass('modal-xl').addClass('modal-lg');
    $('#modalNamaPegawai').text(nama_lengkap||'-');
    $('#modalNIPKPegawai').text(nipk||'-');
    $('#list_tabel_cuti').addClass('d-none');
    $('#form_proses_cuti').removeClass('d-none');
    $('#btnKembali').removeClass('d-none');
    $('#btnSimpancuti').removeClass('d-none').prop('disabled',false);
    $('#btnTutup').addClass('d-none');
    $('#action').val('update_cuti');
    if(typeof WarnaPrimary==='function')WarnaPrimary();
}

/* =========================================================
   EDIT CUTI
========================================================= */
window.edit_cuti=function(data){
    data=data||{};
    const form=document.getElementById('formproses');
    if(!form){
        pesancuti('<b>GAGAL!</b><br>Form tidak ditemukan.');
        return false;
    }
    if(!window.modalCutiPegawai&&!window.init_fungsi_cuti_pegawai()){
        pesancuti('<b>GAGAL!</b><br>Modal Cuti tidak dapat diinisialisasi.');
        return false;
    }
    bersihkanModalCuti();
    const pegawai=cariDataPegawaicuti(data.user_id);
    const nama=pegawai.nama_lengkap||data.nama_lengkap||data.nama||'';
    const nipk=pegawai.nipk||data.nipk||'';
    const field=[
        'id',
        'user_id',
        'status_pegawai',
        'jenis_cuti',
        'alasan_cuti',
        'tgl_mulai',
        'tgl_selesai',
        'jumlah_hari',
        'alamat_cuti',
        'no_hp_selama_cuti',
        'status_pengajuan',
        'tanggal_pengajuan',
        'tanggal_disetujui',
        'catatan_persetujuan',
        'nomor_surat',
        'potong_saldo',
        'verifikator_id',
        'verifikator',
        'jab_verifikator',
        'ppk_id',
        'ppk',
        'jab_ppk',
        'created_at',
        'updated_at'
    ];
    field.forEach(function(id){
        isiInputcuti(form,id,data[id]);
    });
    $('#user_id').val(data.user_id||'');
    const mulai=form.querySelector('[name="tgl_mulai"]');
    const selesai=form.querySelector('[name="tgl_selesai"]');
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
    $('#jumlah_hari').val(
        Array.isArray(window.tanggalCutiTerpilih)
            ?window.tanggalCutiTerpilih.length
            :0
    );
    isiDataPegawaicuti(pegawai);
    [
        'verifikator_id',
        'verifikator',
        'jab_verifikator',
        'ppk_id',
        'ppk',
        'jab_ppk'
    ].forEach(function(id){
        const input=form.querySelector('[name="'+id+'"], #'+id);
        if(input)input.value=data[id]||'';
    });
    const action=form.querySelector('[name="action"]');
    if(action)action.value='update_cuti';
    window.pegawaicutiId=data.user_id||null;
    btn_edit_cuti(data.id,nama,nipk);
    window.modalCutiPegawai.show();
    return true;
};

/* =========================================================
   SIMPAN CUTI PEGAWAI
========================================================= */
function simpancutiPegawai(btn){
    const form=document.getElementById('formproses');
    if(!form){
        pesancuti('<b>GAGAL!</b><br>Form cuti pegawai tidak ditemukan.');
        return false;
    }
    const userId=$(form).find('[name="user_id"]').val();
    if(!userId){
        pesancuti('<b>GAGAL!</b><br>ID pegawai tidak ditemukan.');
        return false;
    }
    const action=$(form).find('[name="action"]').val();
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
    let valid=true;
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
    if(btn)disableSubmit(btn);
    return true;
}

/* =========================================================
   PAGINATION TABEL PEGAWAI
========================================================= */
(function(){
    const tbody=document.getElementById('daftarPegawai');
    const pagination=document.getElementById('paginationPegawai');
    const info=document.getElementById('infoPaginationPegawai');
    const pencarian=document.getElementById('cariPegawai');
    if(!tbody||!pagination||!info){
        console.warn('Elemen tabel atau pagination cuti tidak ditemukan.');
        return;
    }
    const semuaBaris=Array.from(tbody.querySelectorAll('tr'));
    const perHalaman=10;
    let halamanAktif=1;
    let hasilFilter=semuaBaris.slice();
    function renderPagination(){
        const total=hasilFilter.length;
        const totalHalaman=Math.ceil(total/perHalaman);
        if(halamanAktif>totalHalaman)halamanAktif=Math.max(1,totalHalaman);
        semuaBaris.forEach(function(baris){
            baris.style.display='none';
        });
        const mulai=(halamanAktif-1)*perHalaman;
        const akhir=Math.min(mulai+perHalaman,total);
        hasilFilter.slice(mulai,akhir).forEach(function(baris,index){
            baris.style.display='';
            const nomor=baris.querySelector('.nomor-pegawai');
            if(nomor)nomor.textContent=mulai+index+1;
        });
        info.textContent=total
            ?'Menampilkan '+(mulai+1)+'-'+akhir+' dari '+total+' pegawai'
            :'Data pegawai tidak ditemukan';
        pagination.innerHTML='';
        function tambahTombol(label,halaman,disabled,aktif){
            const li=document.createElement('li');
            li.className='page-item '+(disabled?' disabled':'')+(aktif?' active':'');
            const btn=document.createElement('button');
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
            for(let p=1;p<=totalHalaman;p++){
                tambahTombol(String(p),p,false,p===halamanAktif);
            }
            tambahTombol('>',halamanAktif+1,halamanAktif>=totalHalaman,false);
        }
    }
    if(pencarian){
        pencarian.addEventListener('input',function(){
            const kata=this.value.toLowerCase().trim();
            hasilFilter=semuaBaris.filter(function(baris){
                return baris.textContent.toLowerCase().indexOf(kata)!==-1;
            });
            halamanAktif=1;
            renderPagination();
        });
    }
    renderPagination();
})();

/* =========================================================
   KONFIRMASI HAPUS
========================================================= */
window.konfirmasiHapuscuti=function(form){
    const tombol=form.querySelector('button[type="submit"]');
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

})();
