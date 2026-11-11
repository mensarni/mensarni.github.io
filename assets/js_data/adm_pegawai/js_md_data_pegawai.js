/* =========================================================
   DATA GLOBAL PEGAWAI
========================================================= */
window.dataPegawaiData=window.dataPegawaiData||[];
window.bolehKelolaDataPegawai=window.bolehKelolaDataPegawai||false;
window.modal=null;
window.pegawaiDataId=null;
window.dataPegawaiData=window.dataPegawaiData||[];

$(document).ready(function(){
	const modalElement=document.getElementById('modal');

	if(modalElement){
		window.modal=new bootstrap.Modal(modalElement,{
			backdrop:'static',
			keyboard:false
		});
	}
	
	// Menyimpan tombol proses/cetak yang sedang aktif
	window.tombolProsesPegawaiAktif=null;
	window.htmlTombolProsesPegawai='';

	// PROSES PEGAWAI
	$(document).on('click','.btn-proses-pegawai',function(e){
		e.preventDefault();
		e.stopPropagation();
		const btn=this;
		const id=$(btn).attr('data-id');
		const userData=$(btn).attr('data-user');
		if(!id){
			window.parent.postMessage({
				type:"flash_message",
				message:"<b>GAGAL!</b><br>ID pegawai tidak ditemukan.",
				status:"danger"
			},"*");
			return false;
		}
		window.tombolProsesPegawaiAktif=btn;
		window.htmlTombolProsesPegawai=btn.innerHTML;
		bukaProsesDataPegawai(id,userData,btn);
	});

	// CETAK PEGAWAI
	$(document).on('click','.btn-cetak-pegawai',function(e){
		e.preventDefault();
		e.stopPropagation();
		const btn=this;
		const id=$(btn).attr('data-id');
		const userData=$(btn).attr('data-user');
		if(!id){
			window.parent.postMessage({
				type:"flash_message",
				message:"<b>GAGAL!</b><br>ID pegawai tidak ditemukan.",
				status:"danger"
			},"*");
			return false;
		}
		window.tombolProsesPegawaiAktif=btn;
		window.htmlTombolProsesPegawai=btn.innerHTML;
		bukaCetakDataPegawai(id,userData,btn);
	});

	// KEMBALIKAN TOMBOL KETIKA MODAL DITUTUP
	$(document).on('hidden.bs.modal','.modal',function(){
		if(window.tombolProsesPegawaiAktif){
			window.tombolProsesPegawaiAktif.disabled=false;
			$(window.tombolProsesPegawaiAktif)
				.prop('disabled',false)
				.removeClass('disabled');
			window.tombolProsesPegawaiAktif.innerHTML=
				window.htmlTombolProsesPegawai;
			window.tombolProsesPegawaiAktif=null;
			window.htmlTombolProsesPegawai='';
		}
	});

	$(document).on('click','#btnSimpanDataPegawai',function(e){
		return simpanDataPegawai(this);
	});

});

function parseDataPegawai(userData){
	if(typeof userData==='object'&&userData!==null){
		return userData;
	}

	try{
		return JSON.parse(userData||'{}');
	}catch(e){
		console.error('Data pegawai bukan JSON valid:',e);
		return {};
	}
}

function bukaProsesDataPegawai(id,userData,btn){
	const user=parseDataPegawai(userData);
	if(!user||!user.user_id){
		window.parent.postMessage({
			type:"flash_message",
			message:"<b>GAGAL!</b><br>Data pegawai tidak ditemukan.",
			status:"danger"
		},"*");
		return false;
	}
	if(btn){
		disableSubmit(btn);
	}
	closeAllModal(function(){
		pegawaiDataId=id;
		window.pegawaiDataId=id;
		const form=document.getElementById('formDataPegawai');
		if(form){
			form.reset();
		}
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
				if(btn){
					btn.disabled=false;
					$(btn).prop('disabled',false);
				}
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
			// Kembalikan tombol seperti semula
			if(btn){
				btn.disabled=false;
				$(btn).prop('disabled',false);
				$(btn).html('<i class="fa-light fa-gear"></i> Proses');
			}
		});
	});
	return true;
}

function Btn_Proses(user){
	$('#modalTitle').text('Proses Data Pegawai');
	$('#modalNamaPegawai').text((user.nama_lengkap||'-'));
	$('#modalNIPKPegawai').text((user.nipk||'-'));
	$('#formDataPegawai').removeClass('d-none');
	$('#btnSimpanDataPegawai').removeClass('d-none');
	$('#boxCetakDataPegawai').addClass('d-none');
	$('#btnCetakPegawai').addClass('d-none');
	$('#modal .modal-dialog').addClass('modal-dialog-scrollable');
}

function bukaCetakDataPegawai(id,userData,btn){
	const user=parseDataPegawai(userData);
	if(!user||!user.user_id){
		window.parent.postMessage({
			type:"flash_message",
			message:"<b>GAGAL!</b><br>Data pegawai tidak ditemukan.",
			status:"danger"
		},"*");
		return false;
	}
	if(btn){
		disableSubmit(btn);
	}
	closeAllModal(function(){
		window.pegawaiDataId=id;
		const form=document.getElementById('formDataPegawai');
		if(form){
			form.reset();
		}
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
				if(btn){
					btn.disabled=false;
				}
				window.parent.postMessage({
					type:"flash_message",
					message:"<b>GAGAL!</b><br>Data wilayah gagal dimuat.",
					status:"danger"
				},"*");
				return;
			}
			Btn_Cetak(user);
			tampilkanmodal();
			// Kembalikan tombol seperti semula
			if(btn){
				btn.disabled=false;
				$(btn).prop('disabled',false);
				$(btn).html('<i class="fa-light fa-print"></i> Cetak');
			}
		});
	});
	return true;
}

function Btn_Cetak(user){
	$('#modalTitle').text('Cetak Data Pegawai');
	$('#modalNamaPegawai').text((user.nama_lengkap||'-'));
	$('#modalNIPKPegawai').text((user.nipk||'-'));
	$('#formDataPegawai').addClass('d-none');
	$('#boxCetakDataPegawai').removeClass('d-none');
	$('#btnSimpanDataPegawai').addClass('d-none');
	$('#btnCetakPegawai').removeClass('d-none');
	$('#modal .modal-dialog').removeClass('modal-dialog-scrollable');
}

function simpanDataPegawai(btn){
	const form=document.getElementById('formDataPegawai');
	if(!form){
		window.parent.postMessage({
			type:"flash_message",
			message:"<b>GAGAL!</b><br>Formulir Tidak Ditemukan!",
			status:"danger"
		},"*");
		return false;
	}
	const userId=$(form).find('[name="user_id"]').val();
	if(!userId){
		window.parent.postMessage({
			type:"flash_message",
			message:"<b>GAGAL!</b><br>Pegawai tidak ditemukan!",
			status:"danger"
		},"*");
		return false;
	}
	$(form).find('.rupiah').each(function(){
		this.value=this.value.replace(/[^\d]/g,'');
	});
	/* VALIDASI REQUIRED */
	if(!form.checkValidity()){
		form.reportValidity();
		return false;
	}
	/* BERSIHKAN FORMAT RUPIAH SEBELUM SUBMIT */
	$(form).find('.rupiah').each(function(){
		this.value=this.value.replace(/[^\d]/g,'');
	});
	form.method='POST';
	form.action='';
	form.target='ProsesFrame';

	if(btn){
		disableSubmit(btn);
	}

	return true;
}

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

	//==================================================
	// CEK ISTRI / SUAMI
	//==================================================
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

//==================================================
// TOMBOL TAMBAH ANAK
//==================================================
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

//==================================================
// TOMBOL TAMBAH ANAK
//==================================================
$(document).on('click','#btn_tambah_anak',function(){
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

//==================================================
// SAAT INPUT NAMA ANAK
//==================================================
$(document).on(
	'input change',
	'#data_pegawai_anak_1,#data_pegawai_anak_2,#data_pegawai_anak_3,#data_pegawai_anak_4',
	function(){
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
	}
);
