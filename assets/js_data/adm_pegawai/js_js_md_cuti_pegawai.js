(function(){
if(window.cutiPegawaiJsLoaded)return;
window.cutiPegawaiJsLoaded=true;
function initCutiPegawai(){
const dataJenisCuti = {
    PKWT: {
        "CUTI TAHUNAN": [
            ["cuti_tahunan","Cuti Tahunan",12,"ya"],
            ["cuti_besar","Cuti Besar",60,"tidak"],
            ["cuti_bersama","Cuti Bersama",0,"kebijakan"]
        ],
        "CUTI KESEHATAN": [
            ["cuti_sakit","Cuti Sakit",0,"tidak"],
            ["cuti_haid","Cuti Haid",2,"tidak"],
            ["cuti_keguguran","Cuti Keguguran",45,"tidak"]
        ],
        "CUTI KELUARGA": [
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
        "CUTI KEHAMILAN DAN PERSALINAN": [
            ["cuti_melahirkan","Cuti Melahirkan",90,"tidak"],
            ["cuti_perpanjangan_melahirkan","Perpanjangan Cuti Melahirkan",90,"tidak"],
            ["izin_pemeriksaan_kehamilan","Pemeriksaan Kehamilan",0,"tidak"],
            ["izin_laktasi","Izin/Fasilitas Laktasi",0,"tidak"]
        ],
        "CUTI KHUSUS": [
            ["cuti_ibadah","Cuti Ibadah",0,"kebijakan"],
            ["cuti_pendidikan","Cuti Pendidikan",0,"kebijakan"],
            ["cuti_pribadi","Cuti Pribadi",0,"kebijakan"],
            ["cuti_tanpa_upah","Cuti Tanpa Upah",0,"tidak"],
            ["izin_darurat","Izin Darurat",0,"kebijakan"],
            ["izin_pribadi","Izin Pribadi",0,"kebijakan"]
        ]
    }
};
dataJenisCuti.PKWTT = JSON.parse(JSON.stringify(dataJenisCuti.PKWT));
const statusPegawai = document.getElementById('status_pegawai');
const jenisCuti = document.getElementById('jenis_cuti');
const jumlahHari = document.getElementById('jumlah_hari');
const potongSaldo = document.getElementById('potong_saldo');
const cutiTerpakai = document.getElementById('cuti_terpakai');
const tglMulai = document.getElementById('tgl_mulai');
const tglSelesai = document.getElementById('tgl_selesai');
const daftarTanggal = document.getElementById('daftarTanggalCuti');
const jumlahTanggalDipilih = document.getElementById('jumlahTanggalDipilih');
const inputTanggalCuti = document.getElementById('tanggal_cuti');
const kalenderTanggal = document.getElementById('kalenderTanggalCuti');
const bulanKalender = document.getElementById('bulanKalenderCuti');
const btnBulanSebelumnya = document.getElementById('btnBulanSebelumnya');
const btnBulanBerikutnya = document.getElementById('btnBulanBerikutnya');
const btnSelesaiPilihTanggal = document.getElementById('btnSelesaiPilihTanggal');
const jumlahTanggalSementara = document.getElementById('jumlahTanggalSementara');
if(!statusPegawai||!jenisCuti||!jumlahHari||!potongSaldo||!cutiTerpakai||!tglMulai||!tglSelesai||!daftarTanggal||!jumlahTanggalDipilih||!inputTanggalCuti||!kalenderTanggal||!bulanKalender||!btnBulanSebelumnya||!btnBulanBerikutnya||!btnSelesaiPilihTanggal||!jumlahTanggalSementara){
    window.cutiPegawaiJsLoaded=false;
    return;
}
let tanggalCutiTerpilih = [];
let tanggalCutiSementara = [];
let bulanKalenderAktif = new Date();
let konfigurasiCuti = {jatah:0,potong:'tidak'};
function formatTanggal(tanggal){
    const bagian = tanggal.split('-');
    return bagian[2]+'/'+bagian[1]+'/'+bagian[0];
}
function tanggalHariKerja(tanggal){
    const bagian = tanggal.split('-').map(Number);
    const hari = new Date(Date.UTC(bagian[0],bagian[1]-1,bagian[2])).getUTCDay();
    return hari!==0&&hari!==6;
}
function hitungHariKerja(tanggal){
    return tanggal.filter(tanggalHariKerja).length;
}
function tanggalValid(tanggal){
    return !!tglMulai.value&&!!tglSelesai.value&&tanggal>=tglMulai.value&&tanggal<=tglSelesai.value&&tanggalHariKerja(tanggal);
}
function batasJumlahHari(){
    const jatah = konfigurasiCuti.jatah;
    const potong = konfigurasiCuti.potong;
    const terpakai = parseInt(cutiTerpakai.value,10)||0;
    if(jatah===0)return Infinity;
    const pilihan = potong==='kebijakan'?potongSaldo.value:potong;
    if(pilihan==='ya')return Math.max(0,jatah-terpakai);
    if(pilihan==='tidak')return jatah;
    return 0;
}
function perbaruiJumlahHari(){
    tanggalCutiTerpilih = [...new Set(tanggalCutiTerpilih)].filter(tanggalHariKerja).sort();
    const jumlah = hitungHariKerja(tanggalCutiTerpilih);
    jumlahHari.value = jumlah;
    inputTanggalCuti.value = JSON.stringify(tanggalCutiTerpilih);
    jumlahTanggalDipilih.textContent = jumlah+' Hari';
    jumlahHari.dispatchEvent(new Event('input',{bubbles:true}));
    jumlahHari.dispatchEvent(new Event('change',{bubbles:true}));
}
function perbaruiDaftarTanggal(){
    daftarTanggal.innerHTML = '';
    if(tanggalCutiTerpilih.length===0){
        daftarTanggal.innerHTML = '<span class="text-muted small">Belum ada tanggal cuti dipilih.</span>';
    }else{
        tanggalCutiTerpilih.forEach(function(tanggal){
            const item = document.createElement('span');
            item.className = 'badge bg-soft-success text-success d-inline-flex align-items-center gap-2 p-2';
            const teks = document.createElement('span');
            teks.textContent = formatTanggal(tanggal);
            const tombol = document.createElement('button');
            tombol.type = 'button';
            tombol.className = 'btn-close';
            tombol.style.fontSize = '9px';
            tombol.setAttribute('aria-label','Hapus tanggal');
            tombol.addEventListener('click',function(){
                tanggalCutiTerpilih = tanggalCutiTerpilih.filter(function(item){
                    return item!==tanggal;
                });
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
    const batas = batasJumlahHari();
    const jumlahAwal = tanggalCutiTerpilih.length+tanggalCutiSementara.length;
    if(jumlahAwal<=batas)return;
    tanggalCutiTerpilih.sort();
    tanggalCutiSementara.sort();
    const pilihan = [...tanggalCutiTerpilih,...tanggalCutiSementara].sort();
    const dipertahankan = pilihan.slice(0,batas);
    const sementara = dipertahankan.filter(function(tanggal){
        return tanggalCutiSementara.includes(tanggal);
    });
    tanggalCutiTerpilih = dipertahankan.filter(function(tanggal){
        return !sementara.includes(tanggal);
    });
    tanggalCutiSementara = sementara;
    if(tampilkanPesan){
        alert('Pilihan tanggal disesuaikan dengan batas maksimal '+batas+' hari kerja.');
    }
}
function perbaruiKondisiTanggal(){
    const rangeValid = !!tglMulai.value&&!!tglSelesai.value&&tglMulai.value<=tglSelesai.value;
    if(rangeValid){
        const bulanAwal = tglMulai.value.substring(0,7);
        const bulanAkhir = tglSelesai.value.substring(0,7);
        const bulanAktif = bulanKalenderAktif.getFullYear()+'-'+String(bulanKalenderAktif.getMonth()+1).padStart(2,'0');
        if(bulanAktif<bulanAwal){
            bulanKalenderAktif = new Date(Number(tglMulai.value.substring(0,4)),Number(tglMulai.value.substring(5,7))-1,1);
        }else if(bulanAktif>bulanAkhir){
            bulanKalenderAktif = new Date(Number(tglSelesai.value.substring(0,4)),Number(tglSelesai.value.substring(5,7))-1,1);
        }
    }
    perbaruiKalender();
}
function perbaruiKalender(){
    if(!kalenderTanggal)return;
    kalenderTanggal.innerHTML = '';
    const rangeValid = !!tglMulai.value&&!!tglSelesai.value&&tglMulai.value<=tglSelesai.value;
    const namaBulan = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
    if(!rangeValid){
        bulanKalender.textContent = 'Pilih Rentang Tanggal Terlebih Dahulu';
        jumlahTanggalSementara.textContent = '0 tanggal dipilih sementara';
        btnSelesaiPilihTanggal.disabled = true;
        btnBulanSebelumnya.disabled = true;
        btnBulanBerikutnya.disabled = true;
        return;
    }
    const tahun = bulanKalenderAktif.getFullYear();
    const bulan = bulanKalenderAktif.getMonth();
    const bulanAwal = tglMulai.value.substring(0,7);
    const bulanAkhir = tglSelesai.value.substring(0,7);
    const bulanAktif = tahun+'-'+String(bulan+1).padStart(2,'0');
    bulanKalender.textContent = namaBulan[bulan]+' '+tahun;
    btnBulanSebelumnya.disabled = bulanAktif<=bulanAwal;
    btnBulanBerikutnya.disabled = bulanAktif>=bulanAkhir;
    const namaHari = ['Sen','Sel','Rab','Kam','Jum','Sab','Min'];
    namaHari.forEach(function(hari){
        const el = document.createElement('div');
        el.className = 'text-center small fw-bold text-muted py-2';
        el.textContent = hari;
        kalenderTanggal.appendChild(el);
    });
    const hariPertama = new Date(tahun,bulan,1).getDay();
    const offset = (hariPertama+6)%7;
    const jumlahHariBulan = new Date(tahun,bulan+1,0).getDate();
    for(let i=0;i<offset;i++){
        kalenderTanggal.appendChild(document.createElement('div'));
    }
    for(let hari=1;hari<=jumlahHariBulan;hari++){
        const tanggal = tahun+'-'+String(bulan+1).padStart(2,'0')+'-'+String(hari).padStart(2,'0');
        const dalamRentang = tanggalValid(tanggal);
        const sudahDipilih = tanggalCutiTerpilih.includes(tanggal);
        const sementara = tanggalCutiSementara.includes(tanggal);
        const tombol = document.createElement('button');
        tombol.type = 'button';
        tombol.textContent = hari;
        tombol.className = 'btn btn-sm w-100';
        tombol.style.minHeight = '38px';
        tombol.style.padding = '4px 0';
        if(sementara){
            tombol.classList.add('btn-primary','bg-soft-primary');
        }else if(sudahDipilih){
            tombol.classList.add('btn-success','bg-soft-success');
        }else{
            tombol.classList.add('btn-outline-secondary');
        }
        tombol.disabled = !dalamRentang||sudahDipilih;
        if(!dalamRentang)tombol.classList.add('opacity-25');
        tombol.addEventListener('click',function(){
            if(!dalamRentang||sudahDipilih)return;
            const index = tanggalCutiSementara.indexOf(tanggal);
            if(index!==-1){
                tanggalCutiSementara.splice(index,1);
            }else{
                const batas = batasJumlahHari();
                const jumlahTerpilih = hitungHariKerja(tanggalCutiTerpilih);
                const jumlahSementara = hitungHariKerja(tanggalCutiSementara);
                const sisa = batas-jumlahTerpilih;
                if(jumlahSementara>=sisa){
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
    jumlahTanggalSementara.textContent = hitungHariKerja(tanggalCutiSementara)+' hari kerja dipilih sementara';
    btnSelesaiPilihTanggal.disabled = tanggalCutiSementara.length===0;
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
				type: "flash_message",
				message: '<b>Pemilihan Tanggal Cuti Berlebih</b><br>'+
						 '<br>'+
						 'Jatah cuti: '+kuota+' hari\n<br>'+
						 'Cuti terpakai: '+terpakai+' hari\n<br>'+
						 'Sisa cuti: '+sisa+' hari\n<br>'+
						 'Jumlah dipilih: '+totalDipilih+' hari\n\n<br>'+
						 'Silakan kurangi '+kelebihan+' tanggal cuti.',
				status: 'danger'
			}, "*");
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
    tanggalCutiTerpilih = [];
    tanggalCutiSementara = [];
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
    konfigurasiCuti.potong = potong;
    potongSaldo.value = potong==='kebijakan'?'':potong;
    potongSaldo.dataset.mode = potong;
    potongSaldo.required = true;
    potongSaldo.disabled = false;
    rapikanPilihanTanggal(false);
    perbaruiDaftarTanggal();
	perbaruiBatasRentangCuti();
}
function pilihJenisCuti(){
    const option = jenisCuti.options[jenisCuti.selectedIndex];
    if(!option||!option.value){
        konfigurasiCuti = {jatah:0,potong:'tidak'};
        aturPilihanPotongSaldo('tidak');
        resetTanggalCuti();
        return;
    }
    konfigurasiCuti.jatah = parseInt(option.dataset.maksimal,10)||0;
    konfigurasiCuti.potong = option.dataset.potong||'tidak';
    aturPilihanPotongSaldo(konfigurasiCuti.potong);
    resetTanggalCuti();
}
function hitungTanggalAkhirMaksimal(tanggalMulai, jumlahHari){
    if(!tanggalMulai || !jumlahHari || !isFinite(jumlahHari))return '';
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
    if(!isFinite(batas)){
        tglSelesai.removeAttribute('max');
    }else{
        const tanggalMaksimal=hitungTanggalAkhirMaksimal(tglMulai.value,batas);
        tglSelesai.setAttribute('max',tanggalMaksimal);
        if(tglSelesai.value&&tglSelesai.value>tanggalMaksimal){
            tglSelesai.value=tanggalMaksimal;
        }
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
    }else{
        potongSaldo.value = konfigurasiCuti.potong;
    }
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
    if(tanggalCutiTerpilih.some(function(tanggal){return !tanggalValid(tanggal);})){
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
    const status = this.value;
    jenisCuti.innerHTML = '<option value="">-- Pilih Jenis Cuti --</option>';
    jenisCuti.disabled = !status;
    konfigurasiCuti = {jatah:0,potong:'tidak'};
    aturPilihanPotongSaldo('tidak');
    resetTanggalCuti();
    if(!status||!dataJenisCuti[status])return;
    Object.keys(dataJenisCuti[status]).forEach(function(kategori){
        const group = document.createElement('optgroup');
        group.label = kategori;
        dataJenisCuti[status][kategori].forEach(function(item){
            const option = document.createElement('option');
            option.value = item[0];
            option.textContent = item[1];
            option.dataset.maksimal = item[2];
            option.dataset.potong = item[3];
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
    bulanKalenderAktif = new Date(bulanKalenderAktif.getFullYear(),bulanKalenderAktif.getMonth()-1,1);
    perbaruiKalender();
});
btnBulanBerikutnya.addEventListener('click',function(){
    if(this.disabled)return;
    bulanKalenderAktif = new Date(bulanKalenderAktif.getFullYear(),bulanKalenderAktif.getMonth()+1,1);
    perbaruiKalender();
});
btnSelesaiPilihTanggal.addEventListener('click',selesaiPilihTanggal);
window.resetTanggalCuti = resetTanggalCuti;
window.setTanggalCuti = function(data){
    try{
        const tanggal = Array.isArray(data)?data:JSON.parse(data||'[]');
        tanggalCutiTerpilih = [...new Set(tanggal.filter(function(item){
            return typeof item==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(item)&&tanggalValid(item);
        }))].sort();
        tanggalCutiSementara = [];
        rapikanPilihanTanggal(false);
        perbaruiDaftarTanggal();
    }catch(e){
        resetTanggalCuti();
    }
};
window.validasiFormCuti = validasiFormCuti;
window.getTanggalCutiTerpilih = function(){
    return tanggalCutiTerpilih.slice();
};
perbaruiDaftarTanggal();
}
if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',initCutiPegawai,{once:true});
}else{
    initCutiPegawai();
}
})();