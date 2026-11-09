/* =========================================================
   DATA GLOBAL PEGAWAI
========================================================= */
window.dataPegawaiData = window.dataPegawaiData || [];
window.bolehKelolaDataPegawai = window.bolehKelolaDataPegawai || false;
window.modal = window.modal || null;
window.pegawaiDataId = window.pegawaiDataId || null;
window.tombolProsesPegawaiAktif = window.tombolProsesPegawaiAktif || null;
window.htmlTombolProsesPegawai = window.htmlTombolProsesPegawai || '';

/* =========================================================
   INISIALISASI MODAL SETELAH CT DIMUAT
========================================================= */
window.initHalamanPegawai = function(){
    const modalElement = document.getElementById('modal');

    if(!modalElement) return false;

    if(!window.bootstrap || !bootstrap.Modal){
        console.error('Bootstrap Modal belum tersedia.');
        return false;
    }

    try{
        if(bootstrap.Modal.getOrCreateInstance){
            window.modal = bootstrap.Modal.getOrCreateInstance(modalElement,{
                backdrop:'static',
                keyboard:false
            });
        }else{
            window.modal = bootstrap.Modal.getInstance(modalElement);

            if(!window.modal){
                window.modal = new bootstrap.Modal(modalElement,{
                    backdrop:'static',
                    keyboard:false
                });
            }
        }

        return true;
    }catch(error){
        console.error('Gagal menginisialisasi modal:',error);
        return false;
    }
};

/* =========================================================
   PEMULIHAN TOMBOL PROSES / CETAK
========================================================= */
window.restoreTombolPegawai = function(){
    const btn = window.tombolProsesPegawaiAktif;

    if(!btn) return;

    btn.disabled = false;

    $(btn)
        .prop('disabled',false)
        .removeClass('disabled');

    if(window.htmlTombolProsesPegawai !== ''){
        btn.innerHTML = window.htmlTombolProsesPegawai;
    }

    window.tombolProsesPegawaiAktif = null;
    window.htmlTombolProsesPegawai = '';
};

/* =========================================================
   PENDAFTARAN EVENT - CUKUP SATU KALI
========================================================= */
if(!window.jQuery){
    console.error('jQuery belum tersedia. pegawai.js gagal diinisialisasi.');
}else{

    /* PROSES PEGAWAI */
    $(document)
        .off('click.pegawai','.btn-proses-pegawai')
        .on('click.pegawai','.btn-proses-pegawai',function(e){

            e.preventDefault();
            e.stopPropagation();

            const btn = this;
            const id = $(btn).attr('data-id');
            const userData = $(btn).attr('data-user');

            if(!id){
                window.parent.postMessage({
                    type:"flash_message",
                    message:"<b>GAGAL!</b><br>ID pegawai tidak ditemukan.",
                    status:"danger"
                },"*");

                return false;
            }

            window.tombolProsesPegawaiAktif = btn;
            window.htmlTombolProsesPegawai = btn.innerHTML;

            bukaProsesDataPegawai(id,userData,btn);

            return false;
        });

    /* CETAK PEGAWAI */
    $(document)
        .off('click.pegawai','.btn-cetak-pegawai')
        .on('click.pegawai','.btn-cetak-pegawai',function(e){

            e.preventDefault();
            e.stopPropagation();

            const btn = this;
            const id = $(btn).attr('data-id');
            const userData = $(btn).attr('data-user');

            if(!id){
                window.parent.postMessage({
                    type:"flash_message",
                    message:"<b>GAGAL!</b><br>ID pegawai tidak ditemukan.",
                    status:"danger"
                },"*");

                return false;
            }

            window.tombolProsesPegawaiAktif = btn;
            window.htmlTombolProsesPegawai = btn.innerHTML;

            bukaCetakDataPegawai(id,userData,btn);

            return false;
        });

    /* KEMBALIKAN TOMBOL KETIKA MODAL DITUTUP */
    $(document)
        .off('hidden.bs.modal.pegawai','.modal')
        .on('hidden.bs.modal.pegawai','.modal',function(){

            window.restoreTombolPegawai();

        });

    /* SIMPAN DATA PEGAWAI */
    $(document)
        .off('click.pegawai','#btnSimpanDataPegawai')
        .on('click.pegawai','#btnSimpanDataPegawai',function(e){

            return simpanDataPegawai(this);

        });

    /* CETAK DATA PEGAWAI */
    $(document)
        .off('click.pegawai','#btnCetakPegawai,#btnCetakDataPegawai')
        .on('click.pegawai','#btnCetakPegawai,#btnCetakDataPegawai',function(e){

            e.preventDefault();
            e.stopPropagation();

            cetakPdfDataPegawai(this);

            return false;
        });

    /* TOMBOL TAMBAH ANAK */
    $(document)
        .off('click.pegawai','#btn_tambah_anak')
        .on('click.pegawai','#btn_tambah_anak',function(){

            for(var i = 1; i <= 4; i++){

                var nilai = $('#data_pegawai_anak_' + i).val();

                if(
                    nilai === undefined ||
                    nilai === null ||
                    $.trim(String(nilai)) === '' ||
                    $.trim(String(nilai)) === '0'
                ){
                    $('#row_anak_' + i).css('display','flex');
                    $('#data_pegawai_anak_' + i).focus();
                    break;
                }
            }

            cekTombolTambahAnak();
        });

    /* INPUT NAMA ANAK */
    $(document)
        .off(
            'input.pegawai change.pegawai',
            '#data_pegawai_anak_1,#data_pegawai_anak_2,#data_pegawai_anak_3,#data_pegawai_anak_4'
        )
        .on(
            'input.pegawai change.pegawai',
            '#data_pegawai_anak_1,#data_pegawai_anak_2,#data_pegawai_anak_3,#data_pegawai_anak_4',
            function(){

                var nomor = $(this).attr('id').replace('data_pegawai_anak_','');
                var nilai = $(this).val();

                if(
                    nilai === undefined ||
                    nilai === null ||
                    $.trim(String(nilai)) === '' ||
                    $.trim(String(nilai)) === '0'
                ){
                    $('#row_anak_' + nomor).css('display','none');
                }else{
                    $('#row_anak_' + nomor).css('display','flex');
                }

                cekTombolTambahAnak();
            }
        );
}

/* =========================================================
   PARSE DATA PEGAWAI
========================================================= */
function parseDataPegawai(userData){

    if(typeof userData === 'object' && userData !== null){
        return userData;
    }

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

        window.parent.postMessage({
            type:"flash_message",
            message:"<b>GAGAL!</b><br>Data pegawai tidak ditemukan.",
            status:"danger"
        },"*");

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

                window.parent.postMessage({
                    type:"flash_message",
                    message:"<b>GAGAL!</b><br>Data wilayah gagal dimuat.",
                    status:"danger"
                },"*");

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

        window.parent.postMessage({
            type:"flash_message",
            message:"<b>GAGAL!</b><br>Data pegawai tidak ditemukan.",
            status:"danger"
        },"*");

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

                window.parent.postMessage({
                    type:"flash_message",
                    message:"<b>GAGAL!</b><br>Data wilayah gagal dimuat.",
                    status:"danger"
                },"*");

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

        window.parent.postMessage({
            type:"flash_message",
            message:"<b>GAGAL!</b><br>Formulir Tidak Ditemukan!",
            status:"danger"
        },"*");

        return false;
    }

    const userId = $(form).find('[name="user_id"]').val();

    if(!userId){

        window.parent.postMessage({
            type:"flash_message",
            message:"<b>GAGAL!</b><br>Pegawai tidak ditemukan!",
            status:"danger"
        },"*");

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

        var nilai = $('#data_pegawai_anak_' + nomor).val();

        if(
            nilai === undefined ||
            nilai === null ||
            $.trim(String(nilai)) === '' ||
            $.trim(String(nilai)) === '0'
        ){
            $('#row_anak_' + nomor).css('display','none');
        }else{
            $('#row_anak_' + nomor).css('display','flex');
        }

    });

    var istri = $('#data_pegawai_istri').val();

    if(
        istri === undefined ||
        istri === null ||
        $.trim(String(istri)) === '' ||
        $.trim(String(istri)) === '0'
    ){
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

    for(var i = 1; i <= 4; i++){

        var nilai = $('#data_pegawai_anak_' + i).val();

        if(
            nilai === undefined ||
            nilai === null ||
            $.trim(String(nilai)) === '' ||
            $.trim(String(nilai)) === '0'
        ){
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

    const modal = document.querySelector('.modal.show');

    if(!modal){

        alert('Modal tidak ditemukan.');

        return false;
    }

    const content = modal.querySelector('.modal-body');

    if(!content){

        alert('Isi modal tidak ditemukan.');

        return false;
    }

    if(typeof html2canvas === 'undefined'){

        alert('Library html2canvas belum tersedia.');

        return false;
    }

    if(!window.jspdf || !window.jspdf.jsPDF){

        alert('Library jsPDF belum tersedia.');

        return false;
    }

    const tombol = $(btn);

    const htmlAwal = btn.innerHTML;

    tombol
        .prop('disabled',true)
        .addClass('disabled')
        .html(
            '<span class="spinner-border spinner-border-sm me-1"></span>Membuat PDF...'
        );

    try{

        const canvas = await html2canvas(content,{
            scale:2,
            useCORS:true,
            backgroundColor:'#ffffff'
        });

        const jsPDF = window.jspdf.jsPDF;

        const pdf = new jsPDF('p','mm','a4');

        const pageWidth = pdf.internal.pageSize.getWidth();

        const pageHeight = pdf.internal.pageSize.getHeight();

        const margin = 5;

        const pdfWidth = pageWidth - (margin * 2);

        const pdfHeight = canvas.height * pdfWidth / canvas.width;

        const imgData = canvas.toDataURL('image/jpeg',0.95);

        let heightLeft = pdfHeight;

        let position = margin;

        pdf.addImage(
            imgData,
            'JPEG',
            margin,
            position,
            pdfWidth,
            pdfHeight
        );

        heightLeft -= pageHeight - (margin * 2);

        while(heightLeft > 0){

            position = heightLeft - pdfHeight + margin;

            pdf.addPage();

            pdf.addImage(
                imgData,
                'JPEG',
                margin,
                position,
                pdfWidth,
                pdfHeight
            );

            heightLeft -= pageHeight - (margin * 2);
        }

        pdf.save('Data_Profil_Pegawai.pdf');

        return true;

    }catch(error){

        console.error('Gagal membuat PDF:',error);

        alert('Gagal membuat PDF.');

        return false;

    }finally{

        tombol
            .prop('disabled',false)
            .removeClass('disabled')
            .html(htmlAwal);

    }
}

/* =========================================================
   INISIALISASI HALAMAN PEGAWAI
========================================================= */
window.initHalamanPegawai();

$(function(){

    window.initHalamanPegawai();

    if(typeof window.initPopoverDetailPegawai === 'function'){
        window.initPopoverDetailPegawai();
    }

    if(typeof window.initFilterPegawai === 'function'){
        window.initFilterPegawai();
    }

});
