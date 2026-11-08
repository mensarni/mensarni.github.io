(function(){
if(window.kontrakPegawaiJsLoaded)return;
window.kontrakPegawaiJsLoaded=true;
window.initKontrakPegawai=function(){
	const modalElement=document.getElementById('modal');
	if(modalElement){
		window.modal=bootstrap.Modal.getOrCreateInstance(modalElement,{backdrop:'static',keyboard:false});
	}
	hitungDurasiKerja();
	updateTanggalPegawai();
	hitungTotalGajiPegawai();
};
window.dataKontrakPegawai=window.dataKontrakPegawai||[];
window.modal=null;
window.pegawaiKontrakId=null;
window.pegawaiSuratId=null;
$(document).on('click','.btn-kontrak-pegawai',function(e){
	e.preventDefault();
	e.stopPropagation();
	const btn=this;
	const id=$(btn).attr('data-id')||$(btn).attr('data-user-id');
	const userData=$(btn).attr('data-user');
	if(!id){
		window.parent.postMessage({type:"flash_message",message:"<b>GAGAL!</b><br>ID pegawai tidak ditemukan.",status:"danger"},"*");
		return false;
	}
	disableSubmit(btn);
	bukaKontrakPegawai(id,userData,btn);
	initPopoverPegawai();
	$('#modal_size').removeClass('modal-lg').addClass('modal-xl');
	return false;
});
$(document).on('click','.btn-proses-pegawai-spk',function(e){
	e.preventDefault();
	e.stopPropagation();
	const btn=this;
	const id=$(btn).attr('data-id')||$(btn).attr('data-user-id');
	const userData=$(btn).attr('data-user');
	if(!id){
		window.parent.postMessage({type:"flash_message",message:"<b>GAGAL!</b><br>ID pegawai tidak ditemukan.",status:"danger"},"*");
		return false;
	}
	disableSubmit(btn);
	bukaProsesPegawai(id,userData,btn);
	return false;
});
$(document).on('click','.btn-adendum-pegawai',function(e){
	e.preventDefault();
	e.stopPropagation();
	const btn=this;
	const id=$(btn).attr('data-id')||'';
	if(!id){
		window.parent.postMessage({type:"flash_message",message:"<b>GAGAL!</b><br>ID kontrak tidak ditemukan.",status:"danger"},"*");
		return false;
	}
	bukaAdendumPegawai(id,btn);
	$('#modal_size').removeClass('modal-xl').addClass('modal-lg');
	return false;
});
$(document).on('click','.btn-edit-pegawai',function(e){
	e.preventDefault();
	e.stopPropagation();
	const btn=this;
	const id=$(btn).attr('data-id')||'';
	if(!id){
		window.parent.postMessage({type:"flash_message",message:"<b>GAGAL!</b><br>ID kontrak tidak ditemukan.",status:"danger"},"*");
		return false;
	}
	bukaEditPegawai(id,btn);
	$('#modal_size').removeClass('modal-xl').addClass('modal-lg');
	return false;
});
$(document).on('click','.btn-cetak-spk-pegawai',function(e){
	e.preventDefault();
	e.stopPropagation();
	const btn=this;
	const id=$(btn).attr('data-id')||'';
	if(!id){
		window.parent.postMessage({type:"flash_message",message:"<b>GAGAL!</b><br>ID kontrak tidak ditemukan.",status:"danger"},"*");
		return false;
	}
	disableSubmit(btn);
	cetakSPKPegawai(id,btn);
	return false;
});
$(document).on('click','#btnSimpanLanjutKontrak',function(){
	return simpanLanjutKontrak(this);
});
$(document).on('input change','#data_pegawai_tgl_mulai_kerja,#data_pegawai_tgl_akhir_kerja',function(){
	hitungDurasiKerja();
	updateTanggalPegawai();
});
$(document).on('input change','[id*="gaji_"]',function(){
	hitungTotalGajiPegawai();
});
function parseDataKontrakPegawai(data){
	if(typeof data==='object'&&data!==null)return data;
	try{return JSON.parse(data||'{}');}catch(e){console.error('JSON pegawai tidak valid:',e);return {};}
}
function bukaKontrakPegawai(id,userData,btn){
	const user=parseDataKontrakPegawai(userData);
	if(!user||!user.user_id){
		if(btn){
			btn.disabled=false;
			$(btn).prop('disabled',false).removeAttr('disabled').html('<i class="fa-light fa-gear"></i> Proses');
		}
		window.parent.postMessage({type:"flash_message",message:"<b>GAGAL!</b><br>Data pegawai tidak ditemukan.",status:"danger"},"*");
		return false;
	}
	if(btn)disableSubmit(btn);
	closeAllModal(function(){
		window.pegawaiKontrakId=id;
		const form=document.getElementById('form_lanjut_kontrak');
		if(form)form.reset();
		$('#pegawai_user_id').val(id);
		WarnaSuccess();
		isiDataPegawai(user);
		isiListKontrak(user);
		Btn_List(user);
		tampilkanmodal();
		if(btn){
			btn.disabled=false;
			$(btn).prop('disabled',false).removeAttr('disabled').html('<i class="fa-light fa-folder-open"></i> Data Kontrak/Tugas');
			setTimeout(function(){
				btn.disabled=false;
				$(btn).prop('disabled',false).removeAttr('disabled').html('<i class="fa-light fa-folder-open"></i> Data Kontrak/Tugas');
			},100);
		}
	});
	return true;
}
function findKontrakPegawai(id){
	let hasil=null;
	$.each(window.dataKontrakPegawai||[],function(i,user){
		const list=Array.isArray(user.riwayat_surat)?user.riwayat_surat:[];
		$.each(list,function(j,row){
			if(String(row.id||'')===String(id)||String(row.id_surat||'')===String(id)){
				hasil={user:user,kontrak:row};
				return false;
			}
		});
		if(hasil)return false;
	});
	return hasil;
}
function bukaProsesPegawai(id,userData,btn){
	const user=parseDataKontrakPegawai(userData);
	if(!user||!user.user_id){
		if(btn){
			btn.disabled=false;
			$(btn).prop('disabled',false).removeAttr('disabled').html('<i class="fa-light fa-gear"></i> Proses');
		}
		window.parent.postMessage({type:"flash_message",message:"<b>GAGAL!</b><br>Data pegawai tidak ditemukan.",status:"danger"},"*");
		return false;
	}
	if(btn)disableSubmit(btn);
	closeAllModal(function(){
		window.pegawaiKontrakId=id;
		const form=document.getElementById('form_lanjut_kontrak');
		if(form)form.reset();
		$('#pegawai_user_id').val(id);
		WarnaPrimary();
		isiDataPegawai(user);
		hitungTotalGajiPegawai();
		hitungDurasiKerja();
		loadOrganisasi({departemen:user.departemen||'',divisi:user.divisi||'',unit_usaha:user.unit_usaha||'',jabatan:user.jabatan||''});
		Btn_Proses(user);
		tampilkanmodal();
		if(btn){
			btn.disabled=false;
			$(btn).prop('disabled',false).removeAttr('disabled').html('<i class="fa-light fa-gears"></i> Proses Kontrak');
			setTimeout(function(){
				btn.disabled=false;
				$(btn).prop('disabled',false).removeAttr('disabled').html('<i class="fa-light fa-gears"></i> Proses Kontrak');
			},100);
		}
	});
	return true;
}
function bukaAdendumPegawai(id,btn){
	const hasil=findKontrakPegawai(id);
	if(!hasil){
		if(typeof enableButton==='function')enableButton(btn);
		window.postMessage({type:'error',message:'Data surat tidak ditemukan.'},'*');
		return false;
	}
	const user=hasil.user;
	const kontrak=hasil.kontrak;
	closeAllModal(function(){
		window.pegawaiKontrakId=user.user_id;
		window.pegawaiSuratId=kontrak.id||kontrak.id_surat||'';
		const form=document.getElementById('form_lanjut_kontrak');
		if(form)form.reset();
		$('#pegawai_user_id').val(user.user_id);
		let inputIdSurat=document.getElementById('pegawai_surat_id');
		if(!inputIdSurat&&form){
			inputIdSurat=document.createElement('input');
			inputIdSurat.type='hidden';
			inputIdSurat.id='pegawai_surat_id';
			inputIdSurat.name='id_surat';
			form.appendChild(inputIdSurat);
		}
		if(inputIdSurat)inputIdSurat.value=window.pegawaiSuratId;
		WarnaPurple();
		if(!isiDataSurat(user,id)){
			alert('Data surat tidak ditemukan.');
			return;
		}
		isiDataPegawai(user);
		hitungDurasiKerja();
		hitungTotalGajiPegawai();
		updateTanggalPegawai();
		loadOrganisasi({departemen:user.departemen||'',divisi:user.divisi||'',unit_usaha:user.unit_usaha||'',jabatan:user.jabatan||''});
		Btn_Adendum(user);
		tampilkanmodal();
		if(btn){
			btn.disabled=false;
			btn.innerHTML='<i class="fa fa-file-contract"></i> Adendum';
		}
	});
}
function bukaEditPegawai(id,btn){
	const hasil=findKontrakPegawai(id);
	if(!hasil){
		if(typeof enableButton==='function')enableButton(btn);
		window.postMessage({type:'error',message:'Data surat tidak ditemukan.'},'*');
		return false;
	}
	const user=hasil.user;
	const kontrak=hasil.kontrak;
	closeAllModal(function(){
		window.pegawaiKontrakId=user.user_id;
		window.pegawaiSuratId=kontrak.id||kontrak.id_surat||'';
		const form=document.getElementById('form_lanjut_kontrak');
		if(form)form.reset();
		$('#pegawai_user_id').val(user.user_id);
		let inputIdSurat=document.getElementById('pegawai_surat_id');
		if(!inputIdSurat&&form){
			inputIdSurat=document.createElement('input');
			inputIdSurat.type='hidden';
			inputIdSurat.id='pegawai_surat_id';
			inputIdSurat.name='id_surat';
			form.appendChild(inputIdSurat);
		}
		if(inputIdSurat)inputIdSurat.value=window.pegawaiSuratId;
		WarnaInfo();
		if(!isiDataSurat(user,id)){
			alert('Data surat tidak ditemukan.');
			return;
		}
		loadOrganisasi({departemen:user.departemen||'',divisi:user.divisi||'',unit_usaha:user.unit_usaha||'',jabatan:user.jabatan||''});
		isiDataPegawai(user);
		updateTanggalPegawai();
		hitungDurasiKerja();
		hitungTotalGajiPegawai();
		Btn_Edit_SPK(user);
		tampilkanmodal();
		if(btn){
			btn.disabled=false;
			btn.innerHTML='<i class="fa fa-edit"></i> Edit SPK';
		}
	});
}
function isiListKontrak(user){
	const list=user.riwayat_surat||[];
	let html='';
	if(list.length){
		$.each(list,function(i,row){
			const nama=(user.nama_lengkap||'-').toUpperCase();
			const nipk=user.nipk||'';
			const noSurat=row.no_surat||row.no_spk||'';
			const tglSurat=row.tgl_surat||row.tgl_spk||'';
			const ketSurat=row.ket_surat||'';
			const catatan=row.catatan_pelamar||'';
			let badge='secondary';
			if(ketSurat==='Surat_Tugas')badge='primary';
			else if(ketSurat==='SPK')badge='success';
			html+='<tr class="text-center">';
			html+='<td>'+(i+1)+'</td>';
			html+='<td>'+(noSurat?escapeHtml(noSurat):'<i class="fa-light fa-dash text-danger fs-3"></i>')+'</td>';
			html+='<td><div class="text-danger">'+(row.instansi?escapeHtml(row.instansi):'<i class="fa-light fa-dash text-danger fs-3"></i>')+'</div><div class="text-success">'+(row.departemen?escapeHtml(row.departemen):'<i class="fa-light fa-dash text-danger fs-3"></i>')+'</div></td>';
			html+='<td><div class="text-primary">'+(row.divisi?escapeHtml(row.divisi):'<i class="fa-light fa-dash text-danger fs-3"></i>')+'</div><div class="text-info">'+(row.unit_usaha?escapeHtml(row.unit_usaha):'<i class="fa-light fa-dash text-danger fs-3"></i>')+'</div><div class="text-purple">'+(row.jabatan?escapeHtml(row.jabatan):'<i class="fa-light fa-dash text-danger fs-3"></i>')+'</div></td>';
			html+='<td>'+(row.mulai?escapeHtml(row.mulai):'<i class="fa-light fa-dash text-danger fs-3"></i>')+'<br>'+(row.akhir?escapeHtml(row.akhir):'<i class="fa-light fa-dash text-danger fs-3"></i>')+'</td>';
			html+='<td>'+(row.ket_surat?escapeHtml(row.ket_surat):'<i class="fa-light fa-dash text-danger fs-3"></i>')+'</td>';
			html+='<td class="text-center">';
			html+='<form method="POST" target="ProsesFrame" action="/Backend_VD/process/adm_pegawai/proses_cetak_spk.php">';
			html+='<input type="hidden" name="csrf" value="'+escapeHtml(window.csrfToken||'')+'">';
			html+='<input type="hidden" name="id" value="'+escapeHtml(row.id||row.id_surat||'')+'">';
			html+='<input type="hidden" name="user_id" value="'+escapeHtml(user.user_id||'')+'">';
			html+='<input type="hidden" class="lock_ket_surat" name="ket_surat" value="SPK">';
			html+='<div class="form-floating mb-2"><select name="template_word" class="form-control req-field" required><option value="">Pilih File</option>';
			if(Array.isArray(window.templateWordPegawai)){
				const unitUsaha=(user.unit_usaha||'').trim().toLowerCase();
				const noSuratLower=String(noSurat||'').split('/').slice(-2,-1)[0].toLowerCase().trim();
				$.each(window.templateWordPegawai,function(x,file){
					const namaFile=file.nama||file.name||'';
					const fileName=file.file||file.filename||namaFile;
					const namaTemplateLower=namaFile.toLowerCase();
					if(noSuratLower&&namaTemplateLower.indexOf(noSuratLower)===-1)return;
					if(unitUsaha===''){
						if(namaTemplateLower.indexOf('(ho)')===-1)return;
					}else{
						if(namaTemplateLower.indexOf('(ho)')!==-1)return;
					}
					html+='<option value="'+escapeHtml(fileName)+'">'+escapeHtml(namaFile.replace(/\.docx$/i,''))+'</option>';
				});
			}
			html+='</select><label>Template File</label></div>';
			html+='<button type="submit" name="cetakPDF" class="btn btn-danger bg-soft-danger btn-sm btn-download-pdf"><i class="fa-light fa-file-pdf me-1"></i> Download SPK</button></form></td>';
			const bolehTampil=window.aksesAdminKontrak===true||!row.tgl_akhir_kerja||new Date(String(row.tgl_akhir_kerja).substring(0,10)+'T00:00:00')>=new Date(new Date().setHours(0,0,0,0));
			const tdkbolehTampil=window.aksesAdminKontrak===true;
			html+='<td class="lock_td_btn">';
			if(bolehTampil){
				const ket=String(row.ket_surat||'').toLowerCase();
				const namaSurat=ket.includes('spk')?'SPK':ket.includes('surat_tugas')?'ST':escapeHtml(row.ket_surat||'');
				if(tdkbolehTampil){
					html+='<button type="button" class="btn btn-info bg-soft-info btn-sm btn-edit-pegawai mb-1" style="min-width:150px" name="surat_tampil" value="edit" data-id="'+escapeHtml(row.id||'')+'"><i class="fa-light fa-file-pen me-1"></i> Edit '+namaSurat+'</button>';
					$('#data_pegawai_catatan').val('Edit '+namaSurat);
				}else{
					html+='<button class="btn btn-secondary btn-sm bg-soft-secondary" style="min-width:150px"><i class="fa-light fa-lock text-danger"></i> Edit Only Admin</button>';
				}
				if(ket.includes('spk')){
					html+='<button type="button" class="btn btn-primary bg-soft-purple btn-sm btn-adendum-pegawai mt-1" style="min-width:150px" data-id="'+escapeHtml(row.id||'')+'"><i class="fa-light fa-file-pen me-1"></i> Adendum '+namaSurat+'</button>';
				}
			}else{
				html+='<button class="btn btn-secondary btn-sm bg-soft-secondary"><i class="fa-light fa-lock text-danger"></i> Edit Only Admin</button>';
			}
			html+='</td></tr>';
		});
	}else{
		html+='<tr><td colspan="8" class="text-center text-muted">Belum ada data surat/kontrak pegawai.</td></tr>';
	}
	$('#list_kontrak_pegawai').html(html);
	$('#list_kontrak_pegawai').off('click','.btn-download-pdf').on('click','.btn-download-pdf',function(e){
		const btn=this;
		const form=btn.closest('form');
		if(!form){
			e.preventDefault();
			window.parent.postMessage({type:'flash_message',message:'<b>Gagal !</b><br>Formulir tidak ditemukan.',status:'danger'},'*');
			return false;
		}
		if(!form.checkValidity()){
			e.preventDefault();
			window.parent.postMessage({type:'flash_message',message:'<b>Gagal !</b><br>Silakan lengkapi data terlebih dahulu.',status:'danger'},'*');
			return false;
		}
		disableSubmit(btn);
		setTimeout(function(){
			window.parent.postMessage({type:'flash_message',message:'<b>Berhasil !</b><br>SPK berhasil di cetak silahkan tunggu!',status:'succes'},'*');
			if(window.parent&&typeof window.parent.callbackPage==='function')window.parent.callbackPage();
		},2500);
		return true;
	});
	$('#list_kontrak_pegawai [data-bs-toggle="popover"]').each(function(){
		bootstrap.Popover.getOrCreateInstance(this);
	});
	$('#modal .lock_td_btn').each(function(index){
		if(index>=2){
			$(this).css({'pointer-events':'none','opacity':'0.5'});
			$(this).find('.lock_ket_surat').text('');
		}
	});
}
function Btn_Proses(user){
	$('#modalTitle').text('Proses Kontrak Pegawai');
	$('#modalNamaPegawai').text(user.nama_lengkap||'-');
	$('#modalNIPKPegawai').text(user.nipk||'-');
	$('#FormLanjutKontrak').removeClass('d-none');
	$('#boxListKontrakPegawai').addClass('d-none');
	$('#btnLanjutKontrak').removeClass('d-none');
	$('#form_action').val('lanjut_kontrak');
	$('#btnSimpanLanjutKontrak').removeClass().addClass('btn btn-primary btn-sm bg-soft-primary').html('<i class="fa-light fa-floppy-disk me-1"></i> Proses Kontrak');
}
function Btn_List(user){
	$('#modalTitle').text('Riwayat Kontrak dan Tugas Pegawai');
	$('#modalNamaPegawai').text(user.nama_lengkap||'-');
	$('#modalNIPKPegawai').text(user.nipk||'-');
	$('#boxListKontrakPegawai').removeClass('d-none');
	$('#FormLanjutKontrak').addClass('d-none');
	$('#btnKembali,#btnSimpanLanjutKontrak').addClass('d-none');
	$('#btnTutup').removeClass('d-none');
}
function Btn_Adendum(user){
	$('#modalTitle').text('Proses Adendum Kontrak Pegawai');
	$('#dt_pelatihan').addClass('d-none');
	$('#modalNamaPegawai').text(user.nama_lengkap||'-');
	$('#modalNIPKPegawai').text(user.nipk||'-');
	$('#FormLanjutKontrak').removeClass('d-none');
	$('#boxListKontrakPegawai').addClass('d-none');
	$('#list_adendum').removeClass('d-none');
	$('#jenis_adendum').prop('required',true).prop('disabled',false);
	$('#btnSimpanLanjutKontrak').removeClass().addClass('btn btn-primary btn-sm bg-soft-purple').html('<i class="fa-light fa-floppy-disk me-1"></i> Proses Adendum');
	$('#form_action').val('adendum');
	$('#data_pegawai_catatan').val(user.gg_catatan_pegawai||'');
	$('#btnKembali').removeClass('d-none');
	$('#btnSimpanLanjutKontrak').removeClass('d-none');
	$('#btnTutup').addClass('d-none');
	const catatan=String(user.gg_catatan_pegawai||'');
	if(catatan.toLowerCase().indexOf('draft')!==-1){
		$('#btnSimpanLanjutKontrak').prop('disabled',true).addClass('btn btn-danger btn-sm bg-soft-danger').text('Menunggu Persetujuan Keuangan');
	}else{
		$('#btnSimpanLanjutKontrak').prop('disabled',false).addClass('btn btn-primary btn-sm bg-soft-purple').html('<i class="fa-light fa-floppy-disk me-1"></i> Proses Adendum').removeAttr('title');
	}
	const data=window.dataSuratTerpilih||{};
	const ketSurat=String(data.ket_surat||'').trim().toLowerCase();
	$('#data_pegawai_catatan_surat').val('Draft Adendum '+(data.ket_surat||'').replace(/_/g,' '));
	const ketAdendum=($('#data_pegawai_catatan_surat').val()||'').toLowerCase().trim();
	const tampilAdendum=ketAdendum.includes('adendum');
	const tampilSPK=ketSurat.includes('spk')||tampilAdendum;
	const tampilST=ketSurat==='surat_tugas'||tampilAdendum;
	$('#area_surat_spk').toggle(tampilSPK);
	$('#area_surat_tugas').toggle(tampilST);
	$('#surat_pegawai_tgl_spk').prop('disabled',!tampilSPK).prop('required',tampilSPK);
	$('#surat_pegawai_no_spk').prop('disabled',!tampilSPK);
	$('#surat_pegawai_tgl_st').prop('disabled',!tampilST).prop('required',tampilST);
	$('#surat_pegawai_no_st').prop('disabled',!tampilST);
	$('#modalTitle').text('Proses '+$('#data_pegawai_catatan_surat').val());
	var catatanAwalAdendum='';
	$('#jenis_adendum').off('focus.kontrak change.kontrak');
	$('#jenis_adendum').on('focus.kontrak',function(){
		if(catatanAwalAdendum==='')catatanAwalAdendum=$('#data_pegawai_catatan_surat').val();
	});
	$('#jenis_adendum').on('change.kontrak',function(){
		if(catatanAwalAdendum==='')catatanAwalAdendum=$('#data_pegawai_catatan_surat').val();
		$('#data_pegawai_catatan_surat').val(catatanAwalAdendum.replace(/adendum/gi,'adendum-'+$(this).val()));
	});
}
function Btn_Edit_SPK(user){
	$('#dt_pelatihan').addClass('d-none');
	$('#modalNamaPegawai').text(user.nama_lengkap||'-');
	$('#modalNIPKPegawai').text(user.nipk||'-');
	$('#FormLanjutKontrak').removeClass('d-none');
	$('#boxListKontrakPegawai').addClass('d-none');
	$('#list_adendum').addClass('d-none');
	$('#jenis_adendum').prop('required',false).prop('disabled',true);
	$('#data_pegawai_jenis').val(user.jenis||'-');
	$('#btnSimpanLanjutKontrak').removeClass().addClass('btn btn-primary btn-sm bg-soft-info').html('<i class="fa-light fa-floppy-disk me-1"></i> Proses Edit');
	$('#form_action').val('Edit');
	$('#data_pegawai_catatan').val(user.gg_catatan_pegawai||'');
	$('#btnKembali').removeClass('d-none');
	$('#btnSimpanLanjutKontrak').removeClass('d-none');
	$('#btnTutup').addClass('d-none');
	const catatan=String(user.gg_catatan_pegawai||'');
	if(catatan.toLowerCase().indexOf('draft')!==-1){
		$('#btnSimpanLanjutKontrak').prop('disabled',true).removeClass().addClass('btn btn-danger btn-sm bg-soft-danger').text('Menunggu Persetujuan Keuangan');
	}else{
		$('#btnSimpanLanjutKontrak').prop('disabled',false).removeClass().addClass('btn btn-primary btn-sm bg-soft-info').html('<i class="fa-light fa-floppy-disk me-1"></i> Proses Edit').removeAttr('title');
	}
	const data=window.dataSuratTerpilih||{};
	const ketSurat=String(data.ket_surat||'').trim().toLowerCase();
	$('#data_pegawai_catatan_surat').val('Draft Edit '+(data.ket_surat||'').replace(/_/g,' '));
	const tampilSPK=ketSurat.includes('spk');
	const tampilST=ketSurat==='surat_tugas';
	$('#area_surat_spk').toggle(tampilSPK);
	$('#area_surat_tugas').toggle(tampilST);
	$('#surat_pegawai_tgl_spk').prop('disabled',!tampilSPK).prop('required',tampilSPK);
	$('#surat_pegawai_no_spk').prop('disabled',!tampilSPK);
	$('#surat_pegawai_tgl_st').prop('disabled',!tampilST).prop('required',tampilST);
	$('#surat_pegawai_no_st').prop('disabled',!tampilST);
	$('#modalTitle').text('Proses '+$('#data_pegawai_catatan_surat').val());
}
window.btn_kembali=function(){
	$('#modalTitle').text('Riwayat Kontrak dan Tugas Pegawai');
	$('#boxListKontrakPegawai').removeClass('d-none');
	$('#FormLanjutKontrak').addClass('d-none');
	const userId=window.pegawaiKontrakId;
	let user=null;
	$.each(window.dataKontrakPegawai||[],function(i,data){
		if(String(data.user_id||'')===String(userId||'')){user=data;return false;}
	});
	if(!user){
		window.parent.postMessage({type:'flash_message',message:'<b>GAGAL!</b><br>Data riwayat kontrak pegawai tidak ditemukan.',status:'danger'},'*');
		return;
	}
	isiListKontrak(user);
	$('#modal_size').removeClass('modal-lg').addClass('modal-xl');
	$('#btnSimpanLanjutKontrak,#btnKembali').addClass('d-none');
	$('#btnTutup').removeClass('d-none');
	WarnaSuccess();
};
function simpanLanjutKontrak(btn){
	const form=document.getElementById('form_lanjut_kontrak');
	if(!form){
		window.parent.postMessage({type:"flash_message",message:"<b>GAGAL!</b><br>Formulir Tidak Ditemukan!",status:"danger"},"*");
		return false;
	}
	const userId=$(form).find('[name="user_id"]').val();
	if(!userId){
		window.parent.postMessage({type:"flash_message",message:"<b>GAGAL!</b><br>Pegawai tidak ditemukan!",status:"danger"},"*");
		return false;
	}
	if(!form.checkValidity()){
		window.parent.postMessage({type:"flash_message",message:"<b>GAGAL!</b><br>Silakan lengkapi data terlebih dahulu.",status:"danger"},"*");
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
function hitungDurasiKerja(){
	var mulai=document.getElementById('data_pegawai_tgl_mulai_kerja');
	var akhir=document.getElementById('data_pegawai_tgl_akhir_kerja');
	var durasi=document.getElementById('data_pegawai_durasi_kerja');
	if(!mulai||!akhir||!durasi)return;
	if(!mulai.value||!akhir.value){durasi.value='';return;}
	var a=mulai.value.split('-').map(Number);
	var b=akhir.value.split('-').map(Number);
	var awal=new Date(a[0],a[1]-1,a[2]);
	var akhirTanggal=new Date(b[0],b[1]-1,b[2]);
	if(a.length!==3||b.length!==3||isNaN(awal.getTime())||isNaN(akhirTanggal.getTime())||awal.getFullYear()!==a[0]||awal.getMonth()!==a[1]-1||awal.getDate()!==a[2]||akhirTanggal.getFullYear()!==b[0]||akhirTanggal.getMonth()!==b[1]-1||akhirTanggal.getDate()!==b[2]){
		durasi.value='Cek kembali tanggal';
		return;
	}
	if(akhirTanggal<awal){durasi.value='Cek kembali tanggal';return;}
	var bulan=(b[0]-a[0])*12+(b[1]-a[1]);
	function tanggalPatokan(jumlahBulan){
		var total=a[1]-1+jumlahBulan;
		var tahun=a[0]+Math.floor(total/12);
		var bulanIndex=((total%12)+12)%12;
		var hariMaks=new Date(tahun,bulanIndex+1,0).getDate();
		return new Date(tahun,bulanIndex,Math.min(a[2],hariMaks));
	}
	if(tanggalPatokan(bulan)>akhirTanggal)bulan--;
	var hari=Math.round((akhirTanggal-tanggalPatokan(bulan))/86400000);
	durasi.value=bulan+' bulan '+hari+' hari';
}
function updateTanggalPegawai(){
	const mulai=document.getElementById('data_pegawai_tgl_mulai_kerja');
	const tmt=document.getElementById('data_pegawai_tmt_100');
	const akhirPelatihan=document.getElementById('data_pegawai_tgl_akhir_pelatihan');
	if(!mulai)return;
	if(tmt)tmt.value=mulai.value;
	if(akhirPelatihan){
		if(mulai.value){
			const tanggal=new Date(mulai.value+'T00:00:00');
			tanggal.setDate(tanggal.getDate()-1);
			akhirPelatihan.value=tanggal.getFullYear()+'-'+String(tanggal.getMonth()+1).padStart(2,'0')+'-'+String(tanggal.getDate()).padStart(2,'0');
		}else{
			akhirPelatihan.value='';
		}
	}
}
function hitungTotalGajiPegawai(){
	var total=0;
	$('[id*="gaji_"]').each(function(){
		if(this.id.indexOf('gaji_total')!==-1)return;
		var nilai=String($(this).val()||'').replace(/\D/g,'');
		total+=Number(nilai)||0;
	});
	$('#surat_pegawai_gaji_total').val('Rp '+total.toLocaleString('id-ID'));
}
function escapeHtml(value){
	return $('<div>').text(value==null?'':value).html();
}
function enableButton(btn){
	if(!btn)return;
	btn.disabled=false;
	$(btn).prop('disabled',false);
}
})();