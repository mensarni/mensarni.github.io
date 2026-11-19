
(function(){
if(window.cutiPegawaiJsLoaded)return;
window.cutiPegawaiJsLoaded=true;
window.dataPegawaicuti=window.dataPegawaicuti||[];
window.modalCutiPegawai=null;
window.pegawaicutiId=null;
window.tanggalCutiTerpilih=[];

/* =========================================================
   INISIALISASI MODAL
========================================================= */
window.init_fungsi_cuti_pegawai=function(){
    var el=document.getElementById('modal');
    if(!el)return false;
    if(window.bootstrap&&window.bootstrap.Modal){
        window.modalCutiPegawai=window.bootstrap.Modal.getOrCreateInstance(el,{backdrop:'static',keyboard:false});
    }else if(window.jQuery&&typeof $(el).modal==='function'){
        window.modalCutiPegawai={show:function(){$(el).modal('show');},hide:function(){$(el).modal('hide');}};
    }else{
        console.error('Bootstrap Modal belum dimuat.');
        return false;
    }
    return true;
};
function tampilkanModalCuti(){
    if(!window.modalCutiPegawai&&!window.init_fungsi_cuti_pegawai())return false;
    window.modalCutiPegawai.show();
    return true;
}
function pesancuti(message,status){
    window.parent.postMessage({type:'flash_message',message:message,status:status||'danger'},'*');
}
function warnaCuti(nama){
    if(typeof window[nama]==='function')window[nama]();
}

/* =========================================================
   KOSONGKAN MODAL
========================================================= */
function bersihkanModalCuti(){
    var form=document.getElementById('formproses');
    if(form){
        form.reset();
        $(form).find(':input').each(function(){
            var name=this.name||'';
            if(this.type==='hidden'&&['csrf','_csrf','csrf_token','token'].includes(name))return;
            if(this.type==='checkbox'||this.type==='radio')this.checked=false;
            else if(this.tagName==='SELECT')this.selectedIndex=0;
            else this.value='';
            $(this).removeClass('is-invalid is-valid').prop('disabled',false);
        });
    }
    if(typeof window.resetTanggalCuti==='function')window.resetTanggalCuti();
    window.pegawaicutiId=null;
    $('#user_id,#cuti_id,#action').val('');
    $('#modalTitle,#modalNamaPegawai,#modalNIPKPegawai').text('');
    $('#cuti_nama,#cuti_nipk,#cuti_terpakai').val('');
    $('#form_proses_cuti,#list_tabel_cuti').addClass('d-none');
    $('#btnKembali,#btnSimpancuti').addClass('d-none');
    $('#btnTutup').removeClass('d-none');
    $('#modal-dialog,#modal .modal-dialog').removeClass('modal-lg modal-xl modal-dialog-scrollable');
}

/* =========================================================
   DATA PEGAWAI
========================================================= */
function parseDatacutiPegawai(data){
    if(typeof data==='object'&&data!==null)return data;
    try{return JSON.parse(data||'{}');}catch(e){console.error(e);return {};}
}
function cariDataPegawaicuti(id){
    return (window.dataPegawaicuti||[]).find(function(p){return String(p.user_id)===String(id);})||{};
}
function isiDataPegawaicuti(user){
    user=user||{};
    if(typeof window.isiDataPegawai==='function')window.isiDataPegawai(user);
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
window.btn_proses_cuti=function(id,nama,nipk){
    $('#modalTitle').text('Proses Cuti Pegawai');
    $('#modal-dialog,#modal .modal-dialog').removeClass('modal-xl').addClass('modal-lg');
    $('#form_proses_cuti').removeClass('d-none');
    $('#list_tabel_cuti').addClass('d-none');
    $('#modalNamaPegawai').text(nama||'-');
    $('#modalNIPKPegawai').text(nipk||'-');
    $('#btnKembali').removeClass('d-none');
    $('#btnSimpancuti').removeClass('d-none').prop('disabled',false);
    $('#btnTutup').addClass('d-none');
    $('#action').val('ajuan_cuti');
    $('#cuti_id').val('');
    warnaCuti('WarnaPurple');
};
window.bukaProsescutiPegawai=function(id,userData){
    var user=parseDatacutiPegawai(userData);
    if(!user||!user.user_id)user=cariDataPegawaicuti(id);
    if(!user||!user.user_id){
        pesancuti('<b>GAGAL!</b><br>Data pegawai tidak ditemukan.');
        return false;
    }
    if(!window.modalCutiPegawai&&!window.init_fungsi_cuti_pegawai())return false;
    bersihkanModalCuti();
    window.pegawaicutiId=id;
    $('#user_id').val(user.user_id||id);
    warnaCuti('WarnaPrimary');
    isiDataPegawaicuti(user);
    window.btn_proses_cuti(id,user.nama_lengkap,user.nipk);
    return tampilkanModalCuti();
};
window.btn_kembali=function(){
    bersihkanModalCuti();
    window.btn_list_tabel_cuti();
};

/* =========================================================
   INPUT EDIT
========================================================= */
function isiInputcuti(form,id,nilai){
    var input=form.querySelector('#'+id)||form.querySelector('[name="'+id+'"]');
    if(!input)return;
    nilai=nilai==null?'':String(nilai).trim();
    if(input.type==='date'&&nilai!==''){
        var tanggal=nilai.substring(0,10);
        if(!/^\d{4}-\d{2}-\d{2}$/.test(tanggal)){
            var parsed=new Date(nilai);
            nilai=!isNaN(parsed.getTime())?parsed.getFullYear()+'-'+String(parsed.getMonth()+1).padStart(2,'0')+'-'+String(parsed.getDate()).padStart(2,'0'):'';
        }else nilai=tanggal;
    }
    input.value=nilai;
    input.dispatchEvent(new Event('change',{bubbles:true}));
}
window.btn_edit_cuti=function(id,nama,nipk){
    $('#modalTitle').text('Edit Cuti Pegawai');
    $('#modal-dialog,#modal .modal-dialog').removeClass('modal-xl').addClass('modal-lg');
    $('#modalNamaPegawai').text(nama||'-');
    $('#modalNIPKPegawai').text(nipk||'-');
    $('#list_tabel_cuti').addClass('d-none');
    $('#form_proses_cuti').removeClass('d-none');
    $('#btnKembali,#btnSimpancuti').removeClass('d-none');
    $('#btnSimpancuti').prop('disabled',false);
    $('#btnTutup').addClass('d-none');
    $('#action').val('update_cuti');
    warnaCuti('WarnaPrimary');
};
window.edit_cuti=function(data){
    data=data||{};
    var form=document.getElementById('formproses');
    if(!form){
        pesancuti('<b>GAGAL!</b><br>Form tidak ditemukan.');
        return false;
    }
    if(!window.modalCutiPegawai&&!window.init_fungsi_cuti_pegawai())return false;
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
    field.forEach(function(id){isiInputcuti(form,id,data[id]);});
    $('#user_id').val(data.user_id||'');
    if(typeof window.setTanggalCuti==='function')window.setTanggalCuti(data.tanggal_cuti||'[]');
    if(Array.isArray(window.tanggalCutiTerpilih))$('#jumlah_hari').val(window.tanggalCutiTerpilih.length);
    isiDataPegawaicuti(pegawai);
    ['verifikator_id','verifikator','jab_verifikator','ppk_id','ppk','jab_ppk'].forEach(function(id){
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
   JENIS CUTI PKWT DAN PKWTT
========================================================= */
function initCutiPegawai(){
    const dataJenisCuti={
        PKWT:{
            "CUTI TAHUNAN":[
                ["cuti_tahunan","Cuti Tahunan",12,"ya"],
                ["cuti_besar","Cuti Besar",60,"tidak"],
                ["cuti_bersama","Cuti Bersama",0,"kebijakan"]
            ],
            "CUTI KESEHATAN":[
                ["cuti_sakit","Cuti Sakit",0,"tidak"],
                ["cuti_haid","Cuti Haid",2,"tidak"],
                ["cuti_keguguran","Cuti Keguguran",45,"tidak"]
            ],
            "CUTI KELUARGA":[
                ["cuti_menikah","Cuti Menikah",3,"tidak"],
                ["cuti_menikahkan_anak","Menikahkan Anak",2,"tidak"],
                ["cuti_khitan_anak","Khitanan Anak",2,"tidak"],
                ["cuti_baptis_anak","Pembaptisan Anak",2,"tidak"],
                ["cuti_istri_melahirkan","Izin Istri Melahirkan",2,"tidak"],
                ["cuti_istri_keguguran","Izin Istri Keguguran",2,"tidak"],
                ["cuti_pasangan_meninggal","Pasangan Meninggal",2,"tidak"],
                ["cuti_orang_tua_meninggal","Orang Tua/Mertua Meninggal",2,"tidak"],
                ["cuti_anak_meninggal","Anak/Menantu Meninggal",2,"tidak"],
                ["cuti_keluarga_serumah","Keluarga Serumah Meninggal",1,"tidak"]
            ],
            "CUTI KEHAMILAN DAN PERSALINAN":[
                ["cuti_melahirkan","Cuti Melahirkan",90,"tidak"],
                ["cuti_perpanjangan_melahirkan","Perpanjangan Cuti Melahirkan",90,"tidak"],
                ["izin_pemeriksaan_kehamilan","Pemeriksaan Kehamilan",0,"tidak"],
                ["izin_laktasi","Izin/Fasilitas Laktasi",0,"tidak"]
            ],
            "CUTI KHUSUS":[
                ["cuti_ibadah","Cuti Ibadah",0,"kebijakan"],
                ["cuti_pendidikan","Cuti Pendidikan",0,"kebijakan"],
                ["cuti_pribadi","Cuti Pribadi",0,"kebijakan"],
                ["cuti_tanpa_upah","Cuti Tanpa Upah",0,"tidak"],
                ["izin_darurat","Izin Darurat",0,"kebijakan"],
                ["izin_pribadi","Izin Pribadi",0,"kebijakan"]
            ]
        }
    };
    dataJenisCuti.PKWTT=JSON.parse(JSON.stringify(dataJenisCuti.PKWT));
    const statusPegawai=document.getElementById('status_pegawai');
    const jenisCuti=document.getElementById('jenis_cuti');
    const jumlahHari=document.getElementById('jumlah_hari');
    const potongSaldo=document.getElementById('potong_saldo');
    const cutiTerpakai=document.getElementById('cuti_terpakai');
    const tglMulai=document.getElementById('tgl_mulai');
    const tglSelesai=document.getElementById('tgl_selesai');
    const daftarTanggal=document.getElementById('daftarTanggalCuti');
    const jumlahTanggalDipilih=document.getElementById('jumlahTanggalDipilih');
    const inputTanggalCuti=document.getElementById('tanggal_cuti');
    const kalenderTanggal=document.getElementById('kalenderTanggalCuti');
    const bulanKalender=document.getElementById('bulanKalenderCuti');
    const btnBulanSebelumnya=document.getElementById('btnBulanSebelumnya');
    const btnBulanBerikutnya=document.getElementById('btnBulanBerikutnya');
    const btnSelesaiPilihTanggal=document.getElementById('btnSelesaiPilihTanggal');
    const jumlahTanggalSementara=document.getElementById('jumlahTanggalSementara');
    if(!statusPegawai||!jenisCuti||!jumlahHari||!potongSaldo||!cutiTerpakai||!tglMulai||!tglSelesai||!daftarTanggal||!jumlahTanggalDipilih||!inputTanggalCuti||!kalenderTanggal||!bulanKalender||!btnBulanSebelumnya||!btnBulanBerikutnya||!btnSelesaiPilihTanggal||!jumlahTanggalSementara){
        console.warn('Elemen kalender cuti belum lengkap.');
        return;
    }
    if(statusPegawai.dataset.cutiInit==='1')return;
    statusPegawai.dataset.cutiInit='1';
    let tanggalCutiTerpilih=[];
    let tanggalCutiSementara=[];
    let bulanKalenderAktif=new Date();
    let konfigurasiCuti={jatah:0,potong:'tidak'};
    function sinkronTanggal(){
        window.tanggalCutiTerpilih=tanggalCutiTerpilih.slice();
    }
    function formatTanggal(tanggal){
        const b=tanggal.split('-');
        return b[2]+'/'+b[1]+'/'+b[0];
    }
    function tanggalHariKerja(tanggal){
        const b=tanggal.split('-').map(Number);
        const hari=new Date(Date.UTC(b[0],b[1]-1,b[2])).getUTCDay();
        return hari!==0&&hari!==6;
    }
    function hitungHariKerja(tanggal){
        return tanggal.filter(tanggalHariKerja).length;
    }
    function tanggalValid(tanggal){
        return !!tglMulai.value&&!!tglSelesai.value&&tanggal>=tglMulai.value&&tanggal<=tglSelesai.value&&tanggalHariKerja(tanggal);
    }
    function batasJumlahHari(){
        const jatah=konfigurasiCuti.jatah;
        const terpakai=parseInt(cutiTerpakai.value,10)||0;
        if(jatah===0)return Infinity;
        const pilihan=konfigurasiCuti.potong==='kebijakan'?potongSaldo.value:konfigurasiCuti.potong;
        if(pilihan==='ya')return Math.max(0,jatah-terpakai);
        if(pilihan==='tidak')return jatah;
        return 0;
    }
    function perbaruiJumlahHari(){
        tanggalCutiTerpilih=[...new Set(tanggalCutiTerpilih)].filter(tanggalHariKerja).sort();
        const jumlah=hitungHariKerja(tanggalCutiTerpilih);
        jumlahHari.value=jumlah;
        inputTanggalCuti.value=JSON.stringify(tanggalCutiTerpilih);
        jumlahTanggalDipilih.textContent=jumlah+' Hari';
        sinkronTanggal();
        jumlahHari.dispatchEvent(new Event('input',{bubbles:true}));
        jumlahHari.dispatchEvent(new Event('change',{bubbles:true}));
    }
    function perbaruiDaftarTanggal(){
        daftarTanggal.innerHTML='';
        if(tanggalCutiTerpilih.length===0){
            daftarTanggal.innerHTML='<span class="text-muted small">Belum ada tanggal cuti dipilih.</span>';
        }else{
            tanggalCutiTerpilih.forEach(function(tanggal){
                const item=document.createElement('span');
                item.className='badge bg-soft-success text-success d-inline-flex align-items-center gap-2 p-2';
                const teks=document.createElement('span');
                teks.textContent=formatTanggal(tanggal);
                const tombol=document.createElement('button');
                tombol.type='button';
                tombol.className='btn-close';
                tombol.style.fontSize='9px';
                tombol.setAttribute('aria-label','Hapus tanggal');
                tombol.addEventListener('click',function(){
                    tanggalCutiTerpilih=tanggalCutiTerpilih.filter(function(t){return t!==tanggal;});
                    perbaruiDaftarTanggal();
                });
                item.appendChild(teks);
                item.appendChild(tombol);
                daftarTanggal.appendChild(item);
            });
        }
        perbaruiJumlahHari();
        perbaruiKondisiTanggal();
    }
    function rapikanPilihanTanggal(tampilkanPesan){
        const batas=batasJumlahHari();
        const jumlahAwal=tanggalCutiTerpilih.length+tanggalCutiSementara.length;
        if(jumlahAwal<=batas)return;
        const pilihan=[...tanggalCutiTerpilih,...tanggalCutiSementara].sort();
        const dipertahankan=pilihan.slice(0,batas);
        const sementara=dipertahankan.filter(function(t){return tanggalCutiSementara.includes(t);});
        tanggalCutiTerpilih=dipertahankan.filter(function(t){return !sementara.includes(t);});
        tanggalCutiSementara=sementara;
        if(tampilkanPesan)alert('Pilihan tanggal disesuaikan dengan batas maksimal '+batas+' hari kerja.');
    }
    function perbaruiKondisiTanggal(){
        const rangeValid=!!tglMulai.value&&!!tglSelesai.value&&tglMulai.value<=tglSelesai.value;
        if(rangeValid){
            const awal=tglMulai.value.substring(0,7);
            const akhir=tglSelesai.value.substring(0,7);
            const aktif=bulanKalenderAktif.getFullYear()+'-'+String(bulanKalenderAktif.getMonth()+1).padStart(2,'0');
            if(aktif<awal)bulanKalenderAktif=new Date(Number(awal.substring(0,4)),Number(awal.substring(5,7))-1,1);
            else if(aktif>akhir)bulanKalenderAktif=new Date(Number(akhir.substring(0,4)),Number(akhir.substring(5,7))-1,1);
        }
        perbaruiKalender();
    }
    function perbaruiKalender(){
        kalenderTanggal.innerHTML='';
        const rangeValid=!!tglMulai.value&&!!tglSelesai.value&&tglMulai.value<=tglSelesai.value;
        const namaBulan=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
        if(!rangeValid){
            bulanKalender.textContent='Pilih Rentang Tanggal Terlebih Dahulu';
            jumlahTanggalSementara.textContent='0 tanggal dipilih sementara';
            btnSelesaiPilihTanggal.disabled=true;
            btnBulanSebelumnya.disabled=true;
            btnBulanBerikutnya.disabled=true;
            return;
        }
        const tahun=bulanKalenderAktif.getFullYear();
        const bulan=bulanKalenderAktif.getMonth();
        const bulanAwal=tglMulai.value.substring(0,7);
        const bulanAkhir=tglSelesai.value.substring(0,7);
        const bulanAktif=tahun+'-'+String(bulan+1).padStart(2,'0');
        bulanKalender.textContent=namaBulan[bulan]+' '+tahun;
        btnBulanSebelumnya.disabled=bulanAktif<=bulanAwal;
        btnBulanBerikutnya.disabled=bulanAktif>=bulanAkhir;
        ['Sen','Sel','Rab','Kam','Jum','Sab','Min'].forEach(function(hari){
            const el=document.createElement('div');
            el.className='text-center small fw-bold text-muted py-2';
            el.textContent=hari;
            kalenderTanggal.appendChild(el);
        });
        const offset=(new Date(tahun,bulan,1).getDay()+6)%7;
        const jumlahHariBulan=new Date(tahun,bulan+1,0).getDate();
        for(let i=0;i<offset;i++)kalenderTanggal.appendChild(document.createElement('div'));
        for(let hari=1;hari<=jumlahHariBulan;hari++){
            const tanggal=tahun+'-'+String(bulan+1).padStart(2,'0')+'-'+String(hari).padStart(2,'0');
            const dalamRentang=tanggalValid(tanggal);
            const sudahDipilih=tanggalCutiTerpilih.includes(tanggal);
            const sementara=tanggalCutiSementara.includes(tanggal);
            const tombol=document.createElement('button');
            tombol.type='button';
            tombol.textContent=hari;
            tombol.className='btn btn-sm w-100';
            tombol.style.minHeight='38px';
            tombol.style.padding='4px 0';
            if(sementara)tombol.classList.add('btn-primary','bg-soft-primary');
            else if(sudahDipilih)tombol.classList.add('btn-success','bg-soft-success');
            else tombol.classList.add('btn-outline-secondary');
            tombol.disabled=!dalamRentang||sudahDipilih;
            if(!dalamRentang)tombol.classList.add('opacity-25');
            tombol.addEventListener('click',function(){
                if(!dalamRentang||sudahDipilih)return;
                const index=tanggalCutiSementara.indexOf(tanggal);
                if(index!==-1)tanggalCutiSementara.splice(index,1);
                else{
                    const batas=batasJumlahHari();
                    const sisa=batas-hitungHariKerja(tanggalCutiTerpilih);
                    if(hitungHariKerja(tanggalCutiSementara)>=sisa){
                        alert('Jumlah tanggal cuti sudah mencapai batas maksimal '+batas+' hari kerja.');
                        return;
                    }
                    tanggalCutiSementara.push(tanggal);
                }
                tanggalCutiSementara.sort();
                perbaruiKalender();
            });
            kalenderTanggal.appendChild(tombol);
        }
        jumlahTanggalSementara.textContent=hitungHariKerja(tanggalCutiSementara)+' hari kerja dipilih sementara';
        btnSelesaiPilihTanggal.disabled=tanggalCutiSementara.length===0;
    }
    function selesaiPilihTanggal(){
        if(tanggalCutiSementara.length===0){
            alert('Silakan pilih minimal satu tanggal pada kalender.');
            return;
        }
        const potong=potongSaldo.value;
        const jatah=parseInt(jenisCuti.options[jenisCuti.selectedIndex]?.dataset.maksimal,10)||0;
        const terpakai=parseInt(cutiTerpakai.value,10)||0;
        const kuota=jatah>0?jatah:12;
        const sisa=Math.max(0,kuota-terpakai);
        const gabungan=[...new Set([...tanggalCutiTerpilih,...tanggalCutiSementara])].filter(tanggalHariKerja).sort();
        const totalDipilih=gabungan.length;
        if(potong==='ya'&&totalDipilih>sisa){
            const kelebihan=totalDipilih-sisa;
            window.parent.postMessage({
                type:'flash_message',
                message:'<b>Pemilihan Tanggal Cuti Berlebih</b><br><br>Jatah cuti: '+kuota+' hari<br>Cuti terpakai: '+terpakai+' hari<br>Sisa cuti: '+sisa+' hari<br>Jumlah dipilih: '+totalDipilih+' hari<br>Silakan kurangi '+kelebihan+' tanggal cuti.',
                status:'danger'
            },'*');
            return;
        }
        if(potong===''){
            alert('Silakan pilih Ya atau Tidak pada pemotongan saldo cuti.');
            potongSaldo.focus();
            return;
        }
        tanggalCutiTerpilih=gabungan;
        tanggalCutiSementara=[];
        perbaruiDaftarTanggal();
    }
    function resetTanggalCuti(){
        tanggalCutiTerpilih=[];
        tanggalCutiSementara=[];
        sinkronTanggal();
        perbaruiDaftarTanggal();
    }
    function aturRentangTanggal(){
        if(tglMulai.value&&tglSelesai.value&&tglMulai.value>tglSelesai.value){
            alert('Batas awal tidak boleh melebihi batas akhir.');
            tglSelesai.value='';
        }
        perbaruiBatasRentangCuti();
    }
    function aturPilihanPotongSaldo(potong){
        konfigurasiCuti.potong=potong;
        potongSaldo.value=potong==='kebijakan'?'':potong;
        potongSaldo.dataset.mode=potong;
        potongSaldo.required=true;
        potongSaldo.disabled=false;
        rapikanPilihanTanggal(false);
        perbaruiDaftarTanggal();
        perbaruiBatasRentangCuti();
    }
    function pilihJenisCuti(){
        const option=jenisCuti.options[jenisCuti.selectedIndex];
        if(!option||!option.value){
            konfigurasiCuti={jatah:0,potong:'tidak'};
            aturPilihanPotongSaldo('tidak');
            resetTanggalCuti();
            return;
        }
        konfigurasiCuti.jatah=parseInt(option.dataset.maksimal,10)||0;
        konfigurasiCuti.potong=option.dataset.potong||'tidak';
        aturPilihanPotongSaldo(konfigurasiCuti.potong);
        resetTanggalCuti();
    }
    function hitungTanggalAkhirMaksimal(tanggalMulai,jumlahHari){
        if(!tanggalMulai||!jumlahHari||!isFinite(jumlahHari))return '';
        const tanggal=new Date(tanggalMulai+'T00:00:00');
        let jumlah=0;
        while(jumlah<jumlahHari){
            const hari=tanggal.getDay();
            if(hari!==0&&hari!==6)jumlah++;
            if(jumlah<jumlahHari)tanggal.setDate(tanggal.getDate()+1);
        }
        return tanggal.getFullYear()+'-'+String(tanggal.getMonth()+1).padStart(2,'0')+'-'+String(tanggal.getDate()).padStart(2,'0');
    }
    function perbaruiBatasRentangCuti(){
        if(!tglMulai.value){
            tglSelesai.removeAttribute('max');
            tanggalCutiTerpilih=[];
            tanggalCutiSementara=[];
            perbaruiDaftarTanggal();
            return;
        }
        const batas=batasJumlahHari();
        if(!isFinite(batas))tglSelesai.removeAttribute('max');
        else{
            const maksimal=hitungTanggalAkhirMaksimal(tglMulai.value,batas);
            tglSelesai.setAttribute('max',maksimal);
            if(tglSelesai.value&&tglSelesai.value>maksimal)tglSelesai.value=maksimal;
        }
        tanggalCutiTerpilih=tanggalCutiTerpilih.filter(tanggalValid);
        tanggalCutiSementara=tanggalCutiSementara.filter(tanggalValid);
        rapikanPilihanTanggal(false);
        perbaruiDaftarTanggal();
    }
    function validasiPotongSaldo(){
        if(konfigurasiCuti.potong==='kebijakan'){
            if(potongSaldo.value!=='ya'&&potongSaldo.value!=='tidak'){
                alert('Silakan pilih Ya atau Tidak untuk pemotongan saldo sesuai kebijakan.');
                potongSaldo.focus();
                return false;
            }
        }else potongSaldo.value=konfigurasiCuti.potong;
        return true;
    }
    function validasiFormCuti(){
        if(!tglMulai.value||!tglSelesai.value){
            alert('Silakan tentukan batas awal dan batas akhir pemilihan tanggal.');
            return false;
        }
        if(tglMulai.value>tglSelesai.value){
            alert('Batas awal tidak boleh melebihi batas akhir.');
            return false;
        }
        if(tanggalCutiSementara.length>0){
            alert('Masih ada tanggal yang dipilih pada kalender tetapi belum dikonfirmasi. Klik Selesai Pilih Tanggal terlebih dahulu.');
            kalenderTanggal.scrollIntoView({behavior:'smooth',block:'center'});
            return false;
        }
        if(tanggalCutiTerpilih.length===0){
            alert('Silakan pilih minimal satu tanggal cuti pada kalender.');
            kalenderTanggal.scrollIntoView({behavior:'smooth',block:'center'});
            return false;
        }
        if(!validasiPotongSaldo())return false;
        if(tanggalCutiTerpilih.some(function(t){return !tanggalValid(t);})){
            alert('Terdapat tanggal cuti di luar rentang atau jatuh pada hari Sabtu/Minggu.');
            return false;
        }
        if(hitungHariKerja(tanggalCutiTerpilih)>batasJumlahHari()){
            alert('Jumlah tanggal cuti melebihi batas saldo atau jatah yang diperbolehkan.');
            return false;
        }
        perbaruiJumlahHari();
        return true;
    }
    statusPegawai.addEventListener('change',function(){
        const status=this.value;
        jenisCuti.innerHTML='<option value="">-- Pilih Jenis Cuti --</option>';
        jenisCuti.disabled=!status;
        konfigurasiCuti={jatah:0,potong:'tidak'};
        aturPilihanPotongSaldo('tidak');
        resetTanggalCuti();
        if(!status||!dataJenisCuti[status])return;
        Object.keys(dataJenisCuti[status]).forEach(function(kategori){
            const group=document.createElement('optgroup');
            group.label=kategori;
            dataJenisCuti[status][kategori].forEach(function(item){
                const option=document.createElement('option');
                option.value=item[0];
                option.textContent=item[1];
                option.dataset.maksimal=item[2];
                option.dataset.potong=item[3];
                group.appendChild(option);
            });
            jenisCuti.appendChild(group);
        });
    });
    jenisCuti.addEventListener('change',pilihJenisCuti);
    potongSaldo.addEventListener('change',function(){
        if(konfigurasiCuti.potong!=='kebijakan'){
            potongSaldo.value=konfigurasiCuti.potong;
            return;
        }
        perbaruiBatasRentangCuti();
    });
    tglMulai.addEventListener('change',aturRentangTanggal);
    tglSelesai.addEventListener('change',aturRentangTanggal);
    btnBulanSebelumnya.addEventListener('click',function(){
        if(this.disabled)return;
        bulanKalenderAktif=new Date(bulanKalenderAktif.getFullYear(),bulanKalenderAktif.getMonth()-1,1);
        perbaruiKalender();
    });
    btnBulanBerikutnya.addEventListener('click',function(){
        if(this.disabled)return;
        bulanKalenderAktif=new Date(bulanKalenderAktif.getFullYear(),bulanKalenderAktif.getMonth()+1,1);
        perbaruiKalender();
    });
    btnSelesaiPilihTanggal.addEventListener('click',selesaiPilihTanggal);
    window.resetTanggalCuti=resetTanggalCuti;
    window.setTanggalCuti=function(data){
        try{
            const tanggal=Array.isArray(data)?data:JSON.parse(data||'[]');
            tanggalCutiTerpilih=[...new Set(tanggal.filter(function(item){
                return typeof item==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(item)&&tanggalValid(item);
            }))].sort();
            tanggalCutiSementara=[];
            rapikanPilihanTanggal(false);
            perbaruiDaftarTanggal();
        }catch(e){
            resetTanggalCuti();
        }
    };
    window.validasiFormCuti=validasiFormCuti;
    window.getTanggalCutiTerpilih=function(){return tanggalCutiTerpilih.slice();};
    perbaruiDaftarTanggal();
}

/* =========================================================
   SIMPAN CUTI PEGAWAI
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
    if(typeof window.validasiFormCuti!=='function'||!window.validasiFormCuti()){
        if(typeof window.validasiFormCuti!=='function')pesancuti('<b>GAGAL!</b><br>Validasi kalender cuti tidak ditemukan.');
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
    if(btn&&typeof window.disableSubmit==='function')window.disableSubmit(btn);
    else if(btn)btn.disabled=true;
    return true;
};

/* =========================================================
   EVENT TOMBOL
========================================================= */
$(document)
.off('click.cutiPegawai','#btnBukaModalCuti')
.on('click.cutiPegawai','#btnBukaModalCuti',function(e){
    e.preventDefault();
    if(typeof window.bukaModalAmbilPegawai==='function')window.bukaModalAmbilPegawai();
    else window.bukaModalListCutiPegawai();
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
    try{data=JSON.parse(this.getAttribute('data-cuti')||'{}');}
    catch(error){
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
   CETAK PDF
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
        if(window.parent&&typeof window.parent.callbackPage==='function')window.parent.callbackPage();
    },2500);
    return true;
});

/* =========================================================
   PAGINATION PEGAWAI
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
        semuaBaris.forEach(function(baris){baris.style.display='none';});
        var mulai=(halamanAktif-1)*perHalaman;
        var akhir=Math.min(mulai+perHalaman,total);
        hasilFilter.slice(mulai,akhir).forEach(function(baris,index){
            baris.style.display='';
            var nomor=baris.querySelector('.nomor-pegawai');
            if(nomor)nomor.textContent=mulai+index+1;
        });
        info.textContent=total?'Menampilkan '+(mulai+1)+'-'+akhir+' dari '+total+' pegawai':'Data pegawai tidak ditemukan';
        pagination.innerHTML='';
        function tambahTombol(label,halaman,disabled,aktif){
            var li=document.createElement('li');
            li.className='page-item '+(disabled?' disabled':'')+(aktif?' active':'');
            var btn=document.createElement('button');
            btn.type='button';
            btn.className='page-link';
            btn.textContent=label;
            btn.disabled=disabled;
            btn.addEventListener('click',function(){halamanAktif=halaman;renderPagination();});
            li.appendChild(btn);
            pagination.appendChild(li);
        }
        if(totalHalaman>1){
            tambahTombol('<',halamanAktif-1,halamanAktif<=1,false);
            for(var p=1;p<=totalHalaman;p++)tambahTombol(String(p),p,false,p===halamanAktif);
            tambahTombol('>',halamanAktif+1,halamanAktif>=totalHalaman,false);
        }
    }
    if(pencarian){
        $(pencarian).off('input.cutiPegawai').on('input.cutiPegawai',function(){
            var kata=this.value.toLowerCase().trim();
            hasilFilter=semuaBaris.filter(function(baris){return baris.textContent.toLowerCase().indexOf(kata)!==-1;});
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
            if(typeof window.parent.callbackPage==='function')window.parent.callbackPage();
            else window.parent.location.reload();
        }catch(e){window.parent.location.reload();}
        return false;
    }
    if(tombol){
        tombol.disabled=true;
        tombol.innerHTML='<i class="fa-light fa-spinner fa-spin"></i> Memproses...';
    }
    return true;
};

/* =========================================================
   INISIALISASI SELURUH MODUL
========================================================= */
$(function(){
    window.init_fungsi_cuti_pegawai();
    initCutiPegawai();
    initPaginationCuti();
});
})();
