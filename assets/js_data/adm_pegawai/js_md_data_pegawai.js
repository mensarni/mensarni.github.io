
/* =========================================================
   DATA GLOBAL PEGAWAI
========================================================= */
window.dataPegawaiData = window.dataPegawaiData || [];
window.bolehKelolaDataPegawai = window.bolehKelolaDataPegawai || false;
window.modal = window.modal || null;
window.pegawaiDataId = window.pegawaiDataId || null;
window.tombolProsesPegawaiAktif = window.tombolProsesPegawaiAktif || null;
window.htmlTombolProsesPegawai = window.htmlTombolProsesPegawai || '';
window.pdfPegawaiToken = window.pdfPegawaiToken || 0;

/* =========================================================
   INISIALISASI MODAL SETELAH CT DIMUAT
========================================================= */
/* =========================================================
   INISIALISASI MODAL SETELAH CT DIMUAT
========================================================= */
window.initHalamanPegawai=function(){
    const modalElement=document.getElementById('modal');
    if(!modalElement)return false;

    if(!window.bootstrap || !bootstrap.Modal){
        console.error('Bootstrap Modal belum tersedia.');
        return false;
    }

    try{
        if(bootstrap.Modal.getOrCreateInstance){
            window.modal=bootstrap.Modal.getOrCreateInstance(modalElement,{
                backdrop:'static',
                keyboard:false
            });
        }else{
            window.modal=bootstrap.Modal.getInstance(modalElement);
            if(!window.modal){
                window.modal=new bootstrap.Modal(modalElement,{
                    backdrop:'static',
                    keyboard:false
                });
            }
        }

        // PAKSA PULIHKAN TOMBOL SAAT MODAL DITUTUP
        if(!modalElement.dataset.pegawaiCloseHandler){
            modalElement.addEventListener('hide.bs.modal',function(){
                window.pdfPegawaiToken++;
                window.restoreTombolPegawai();
            });

            modalElement.addEventListener('hidden.bs.modal',function(){
                window.restoreTombolPegawai();
            });

            modalElement.dataset.pegawaiCloseHandler='1';
        }

        return true;
    }catch(error){
        console.error('Gagal menginisialisasi modal:',error);
        return false;
    }
};
/* =========================================================
   SIMPAN KONDISI TOMBOL
========================================================= */
window.simpanStatusTombolPegawai = function(btn){
    if(!btn) return;
    if(window.tombolProsesPegawaiAktif && window.tombolProsesPegawaiAktif !== btn){
        window.restoreTombolPegawai();
    }
    if(window.tombolProsesPegawaiAktif !== btn){
        window.tombolProsesPegawaiAktif = btn;
        window.htmlTombolProsesPegawai = btn.innerHTML;
    }
};

/* =========================================================
   PEMULIHAN TOMBOL PROSES / CETAK
========================================================= */
window.restoreTombolPegawai = function(){
    const btn = window.tombolProsesPegawaiAktif;
    if(btn){
        btn.disabled = false;
        btn.removeAttribute('disabled');
        btn.classList.remove('disabled');
        btn.removeAttribute('aria-disabled');

        if(window.htmlTombolProsesPegawai !== ''){
            btn.innerHTML = window.htmlTombolProsesPegawai;
        }
    }
    window.tombolProsesPegawaiAktif = null;
    window.htmlTombolProsesPegawai = '';
};

/* =========================================================
   PENDAFTARAN EVENT
========================================================= */
if(!window.jQuery){
    console.error('jQuery belum tersedia. pegawai.js gagal diinisialisasi.');
}else{
    /* PROSES PEGAWAI */
    $(document).off('click.pegawai','.btn-proses-pegawai').on('click.pegawai','.btn-proses-pegawai',function(e){
        e.preventDefault();
        e.stopPropagation();
        const btn = this;
        const id = $(btn).attr('data-id');
        const userData = $(btn).attr('data-user');
        if(!id){
            window.parent.postMessage({type:"flash_message",message:"<b>GAGAL!</b><br>ID pegawai tidak ditemukan.",status:"danger"},"*");
            return false;
        }
        window.simpanStatusTombolPegawai(btn);
        bukaProsesDataPegawai(id,userData,btn);
        return false;
    });

    /* SIMPAN DATA PEGAWAI */
    $(document).off('click.pegawai','#btnSimpanDataPegawai').on('click.pegawai','#btnSimpanDataPegawai',function(e){
        return simpanDataPegawai(this);
    });

    /* CETAK DATA PEGAWAI */
    $(document).off('click.pegawai','#btnCetakPegawai,#btnCetakDataPegawai').on('click.pegawai','#btnCetakPegawai,#btnCetakDataPegawai',function(e){
        e.preventDefault();
        e.stopPropagation();
        cetakPdfDataPegawai(this);
        return false;
    });

    /* TOMBOL TAMBAH ANAK */
    $(document).off('click.pegawai','#btn_tambah_anak').on('click.pegawai','#btn_tambah_anak',function(){
        for(var i=1;i<=4;i++){
            var nilai = $('#data_pegawai_anak_'+i).val();
            if(nilai===undefined || nilai===null || $.trim(String(nilai))==='' || $.trim(String(nilai))==='0'){
                $('#row_anak_'+i).css('display','flex');
                $('#data_pegawai_anak_'+i).focus();
                break;
            }
        }
        cekTombolTambahAnak();
    });

    /* INPUT NAMA ANAK */
    $(document).off('input.pegawai change.pegawai','#data_pegawai_anak_1,#data_pegawai_anak_2,#data_pegawai_anak_3,#data_pegawai_anak_4').on('input.pegawai change.pegawai','#data_pegawai_anak_1,#data_pegawai_anak_2,#data_pegawai_anak_3,#data_pegawai_anak_4',function(){
        var nomor = $(this).attr('id').replace('data_pegawai_anak_','');
        var nilai = $(this).val();
        if(nilai===undefined || nilai===null || $.trim(String(nilai))==='' || $.trim(String(nilai))==='0'){
            $('#row_anak_'+nomor).css('display','none');
        }else{
            $('#row_anak_'+nomor).css('display','flex');
        }
        cekTombolTambahAnak();
    });
}

/* =========================================================
   PARSE DATA PEGAWAI
========================================================= */
function parseDataPegawai(userData){
    if(typeof userData==='object' && userData!==null) return userData;
    try{
        return JSON.parse(userData || '{}');
    }catch(e){
        console.error('Data pegawai bukan JSON valid:',e);
        return {};
    }
}

/* =========================================================
   BUKA PROSES DATA PEGAWAI
========================================================= */
function bukaProsesDataPegawai(id,userData,btn){
    const user = parseDataPegawai(userData);
    if(!user || !user.user_id){
        window.parent.postMessage({type:"flash_message",message:"<b>GAGAL!</b><br>Data pegawai tidak ditemukan.",status:"danger"},"*");
        window.restoreTombolPegawai();
        return false;
    }
    if(btn) disableSubmit(btn);
    closeAllModal(function(){
        window.pegawaiDataId = id;
        const form = document.getElementById('formDataPegawai');
        if(form) form.reset();
        $('#pegawai_id').val('');
        $('#pegawai_user_id').val(id);
        WarnaPrimary();
        isiDataPegawai(user);
        loadWilayah({
            provinsi:user.provinsi || '',
            kota_kabupaten:user.kota_kabupaten || '',
            kecamatan:user.kecamatan || '',
            kelurahan:user.kelurahan || ''
        },function(berhasil){
            if(!berhasil){
                window.restoreTombolPegawai();
                window.parent.postMessage({type:"flash_message",message:"<b>GAGAL!</b><br>Data wilayah gagal dimuat.",status:"danger"},"*");
                return;
            }
            Btn_Proses(user);
            cekDataKeluarga();
            tampilkanmodal();
            window.restoreTombolPegawai();
        });
    });
    return true;
}

/* =========================================================
   TAMPILAN MODAL PROSES
========================================================= */
function Btn_Proses(user){
    $('#modalTitle').text('Proses Data Pegawai');
    $('#modalNamaPegawai').text(user.nama_lengkap || '-');
    $('#modalNIPKPegawai').text(user.nipk || '-');
    $('#formDataPegawai').removeClass('d-none');
    $('#btnSimpanDataPegawai').removeClass('d-none');
    $('#boxCetakDataPegawai').addClass('d-none');
    $('#btnCetakPegawai').addClass('d-none');
    $('#modal .modal-dialog').addClass('modal-dialog-scrollable');
}

/* =========================================================
   BUKA CETAK DATA PEGAWAI
========================================================= */
function bukaCetakDataPegawai(id,userData,btn){
    const user = parseDataPegawai(userData);
    if(!user || !user.user_id){
        window.parent.postMessage({type:"flash_message",message:"<b>GAGAL!</b><br>Data pegawai tidak ditemukan.",status:"danger"},"*");
        window.restoreTombolPegawai();
        return false;
    }
    if(btn) disableSubmit(btn);
    closeAllModal(function(){
        window.pegawaiDataId = id;
        const form = document.getElementById('formDataPegawai');
        if(form) form.reset();
        $('#pegawai_id').val('');
        $('#pegawai_user_id').val(id);
        WarnaSuccess();
        isiDataPegawai(user);
        loadWilayah({
            provinsi:user.provinsi || '',
            kota_kabupaten:user.kota_kabupaten || '',
            kecamatan:user.kecamatan || '',
            kelurahan:user.kelurahan || ''
        },function(berhasil){
            if(!berhasil){
                window.restoreTombolPegawai();
                window.parent.postMessage({type:"flash_message",message:"<b>GAGAL!</b><br>Data wilayah gagal dimuat.",status:"danger"},"*");
                return;
            }
            Btn_Cetak(user);
            tampilkanmodal();
            window.restoreTombolPegawai();
        });
    });
    return true;
}

/* =========================================================
   TAMPILAN MODAL CETAK
========================================================= */
function Btn_Cetak(user){
    $('#modalTitle').text('Cetak Data Pegawai');
    $('#modalNamaPegawai').text(user.nama_lengkap || '-');
    $('#modalNIPKPegawai').text(user.nipk || '-');
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
    const form = document.getElementById('formDataPegawai');
    if(!form){
        window.parent.postMessage({type:"flash_message",message:"<b>GAGAL!</b><br>Formulir Tidak Ditemukan!",status:"danger"},"*");
        return false;
    }
    const userId = $(form).find('[name="user_id"]').val();
    if(!userId){
        window.parent.postMessage({type:"flash_message",message:"<b>GAGAL!</b><br>Pegawai tidak ditemukan!",status:"danger"},"*");
        return false;
    }
    $(form).find('.rupiah').each(function(){
        this.value = this.value.replace(/[^\d]/g,'');
    });
    if(!form.checkValidity()){
        form.reportValidity();
        return false;
    }
    form.method = 'POST';
    form.action = '';
    form.target = 'ProsesFrame';
    if(btn) disableSubmit(btn);
    return true;
}

/* =========================================================
   CEK DATA KELUARGA
========================================================= */
function cekDataKeluarga(){
    var daftarAnak = [1,2,3,4];
    $.each(daftarAnak,function(index,nomor){
        var nilai = $('#data_pegawai_anak_'+nomor).val();
        if(nilai===undefined || nilai===null || $.trim(String(nilai))==='' || $.trim(String(nilai))==='0'){
            $('#row_anak_'+nomor).css('display','none');
        }else{
            $('#row_anak_'+nomor).css('display','flex');
        }
    });
    var istri = $('#data_pegawai_istri').val();
    if(istri===undefined || istri===null || $.trim(String(istri))==='' || $.trim(String(istri))==='0'){
        $('#row_istri').css('display','none');
    }else{
        $('#row_istri').css('display','flex');
    }
    cekTombolTambahAnak();
}

/* =========================================================
   TOMBOL TAMBAH ANAK
========================================================= */
function cekTombolTambahAnak(){
    var adaKosong = false;
    for(var i=1;i<=4;i++){
        var nilai = $('#data_pegawai_anak_'+i).val();
        if(nilai===undefined || nilai===null || $.trim(String(nilai))==='' || $.trim(String(nilai))==='0'){
            adaKosong = true;
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
   CETAK PDF DATA PEGAWAI
========================================================= */
async function cetakPdfDataPegawai(btn){
    const modalElement = document.querySelector('.modal.show');
    if(!modalElement){
        alert('Modal tidak ditemukan.');
        return false;
    }
    const content = modalElement.querySelector('.modal-body');
    if(!content){
        alert('Isi modal tidak ditemukan.');
        return false;
    }
    if(typeof window.html2canvas!=='function'){
        alert('Library html2canvas belum tersedia.');
        console.error('html2canvas tidak ditemukan.');
        return false;
    }
    const jsPDFClass = window.jspdf && window.jspdf.jsPDF ? window.jspdf.jsPDF : (window.jsPDF || null);
    if(!jsPDFClass){
        alert('Library jsPDF belum tersedia.');
        console.error('jsPDF tidak ditemukan.');
        return false;
    }
    if(!btn) return false;
    const token = ++window.pdfPegawaiToken;
    window.simpanStatusTombolPegawai(btn);
    $(btn).prop('disabled',true).addClass('disabled').attr('aria-disabled','true').html('<span class="spinner-border spinner-border-sm me-1"></span>Membuat PDF...');
    const styleAwal = {
        overflow:content.style.overflow,
        maxHeight:content.style.maxHeight,
        height:content.style.height
    };
    try{
        content.style.overflow = 'visible';
        content.style.maxHeight = 'none';
        content.style.height = 'auto';
        await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
        const canvas = await window.html2canvas(content,{
            scale:2,
            useCORS:true,
            allowTaint:false,
            backgroundColor:'#ffffff',
            logging:true,
            imageTimeout:20000,
            removeContainer:true,
            scrollX:0,
            scrollY:0,
            windowWidth:Math.max(document.documentElement.clientWidth,content.scrollWidth),
            windowHeight:Math.max(document.documentElement.clientHeight,content.scrollHeight)
        });
        if(token!==window.pdfPegawaiToken || !modalElement.classList.contains('show')){
            return false;
        }
        if(!canvas || !canvas.width || !canvas.height){
            throw new Error('Canvas kosong atau gagal dirender.');
        }
        const imgData = canvas.toDataURL('image/jpeg',0.92);
        if(!imgData || imgData.length<100){
            throw new Error('Gagal mengubah hasil canvas menjadi gambar.');
        }
        const pdf = new jsPDFClass('p','mm','a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 5;
        const pdfWidth = pageWidth-(margin*2);
        const areaHeight = pageHeight-(margin*2);
        const pdfHeight = canvas.height*pdfWidth/canvas.width;
        if(!isFinite(pdfHeight) || pdfHeight<=0){
            throw new Error('Ukuran gambar PDF tidak valid.');
        }
        const jumlahHalaman = Math.ceil(pdfHeight/areaHeight);
        for(let halaman=0;halaman<jumlahHalaman;halaman++){
            if(token!==window.pdfPegawaiToken || !modalElement.classList.contains('show')){
                return false;
            }
            if(halaman>0) pdf.addPage();
            const posisiY = margin-(halaman*areaHeight);
            pdf.addImage(imgData,'JPEG',margin,posisiY,pdfWidth,pdfHeight,undefined,'FAST');
        }
        pdf.save('Data_Profil_Pegawai.pdf');
        return true;
    }catch(error){
        console.error('Gagal membuat PDF:',error);
        if(token===window.pdfPegawaiToken){
            alert('Gagal membuat PDF: '+(error.message || error));
        }
        return false;
    }finally{
        content.style.overflow = styleAwal.overflow;
        content.style.maxHeight = styleAwal.maxHeight;
        content.style.height = styleAwal.height;
        if(window.tombolProsesPegawaiAktif===btn){
            window.restoreTombolPegawai();
        }else{
            $(btn).prop('disabled',false).removeClass('disabled').removeAttr('aria-disabled');
        }
    }
}
/* =========================================================
   DOCUMENT READY DAN WINDOW LOAD
========================================================= */
function jalankanInisialisasiPegawai(){
    if(typeof window.initHalamanPegawai==='function'){
        window.initHalamanPegawai();
    }
}

if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',jalankanInisialisasiPegawai,{once:true});
}else{
    jalankanInisialisasiPegawai();
}

window.addEventListener('load',jalankanInisialisasiPegawai);
