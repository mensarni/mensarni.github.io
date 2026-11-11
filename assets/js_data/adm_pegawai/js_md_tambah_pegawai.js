(function(){
if(window.akunPegawaiJsLoaded)return;
window.akunPegawaiJsLoaded=true;

window.initAkunPegawai=function(){
	const modalElement=document.getElementById('modal');
	if(modalElement){
		window.modal=bootstrap.Modal.getOrCreateInstance(modalElement,{
			backdrop:'static',
			keyboard:false
		});
	}
};

function Btn_Tambah(){
	$('#modalTitle').text('Proses Tambah Akun Pegawai');
	$('#modalTitle').addClass('text-purple');
	$('#judulProses .modal-header').attr('class','modal-header').addClass('text-success border-0');
	$('#modalProfil .modal-body .card form div').addClass('text-success bg-light rounded');
	$('#modalProfil .modal-body').addClass('border-0 shadow-none text-primary bg-soft-purple rounded');
}

// MODAL TAMBAH PEGAWAI
$(document)
.off('click.akunPegawaiTambah','.btn-tambah_pegawai')
.on('click.akunPegawaiTambah','.btn-tambah_pegawai',function(e){
	e.preventDefault();
	e.stopPropagation();
	const modalElement=document.getElementById('modalProfil');
	if(!modalElement){
		console.error('Modal #modalProfil tidak ditemukan.');
		return false;
	}
	const modal=bootstrap.Modal.getOrCreateInstance(modalElement,{
		backdrop:'static',
		keyboard:false
	});
	Btn_Tambah();
	modal.show();
	$('#modalProfil .btn-close').prop('disabled',false);
	return false;
});

// MODAL EDIT PEGAWAI
$(document)
.off('click.akunPegawaiEdit','.btn-edit')
.on('click.akunPegawaiEdit','.btn-edit',function(e){
	e.preventDefault();
	e.stopPropagation();
	const rawData=$(this).attr('data-user');
	const btn=this;
	if(!rawData){
		window.parent.postMessage({
			type:'flash_message',
			message:'<b>GAGAL!</b><br>Data pegawai tidak ditemukan.',
			status:'danger'
		},'*');
		return false;
	}
	const user=parseDataPegawai(rawData);
	if(!user||!user.user_id){
		window.parent.postMessage({
			type:'flash_message',
			message:'<b>GAGAL!</b><br>Data pegawai tidak valid.',
			status:'danger'
		},'*');
		return false;
	}
	bukaEditPegawai(user,btn);
	return false;
});

// VERIFIKASI PASSWORD
$(document)
.off('input.akunPegawaiPassword','#edit_password,#edit_password_confirm')
.on('input.akunPegawaiPassword','#edit_password,#edit_password_confirm',function(){
	const password=document.getElementById('edit_password');
	const confirm=document.getElementById('edit_password_confirm');
	const message=document.getElementById('password_match_message');
	if(password&&confirm&&message){
		checkPasswordPegawai(password,confirm,message);
	}
});

// VALIDASI PASSWORD SAAT SUBMIT
$(document)
.off('submit.akunPegawaiPassword','#formEditPegawai')
.on('submit.akunPegawaiPassword','#formEditPegawai',function(e){
	const password=document.getElementById('edit_password');
	const confirm=document.getElementById('edit_password_confirm');
	const message=document.getElementById('password_match_message');
	if(password&&confirm&&message&&!checkPasswordPegawai(password,confirm,message)){
		e.preventDefault();
		confirm.focus();
		return false;
	}
});

window.parseDataPegawai=function(data){
	if(typeof data==='object'&&data!==null)return data;
	try{
		return JSON.parse(data||'{}');
	}catch(e){
		console.error('JSON ERROR:',e);
		console.log('RAW DATA:',data);
		return null;
	}
};

window.bukaEditPegawai=function(user,btn){
	if(!user||!user.user_id){
		if(btn){
			$(btn).prop('disabled',false).removeAttr('disabled').html('<i class="fa-light fa-gear"></i> Proses');
		}
		window.parent.postMessage({
			type:'flash_message',
			message:'<b>GAGAL!</b><br>Data pegawai tidak ditemukan.',
			status:'danger'
		},'*');
		return false;
	}
	closeAllModal(function(){
		const form=document.getElementById('formEditPegawai');
		if(form)form.reset();
		isiProfilPegawai(user);
		isiDataUsers(user);
		WarnaPrimary();
		Btn_Proses(user);
		$('#edit_password,#edit_password_confirm').val('').removeClass('is-valid is-invalid');
		$('#password_match_message').text('').removeClass('text-danger text-success');
		$('#edit_status').val(user.status||'aktif');
		const roleMap={
			'admin':'#A91$7K2@X',
			'pegawai':'#P31$9F2@Q',
			'adm_pegawai':'#K82$4M7@R',
			'adm_pelamar':'#L45$8N3@T',
			'adm_keuangan':'#F72$6P4@W',
			'adm_pengajian':'#G63$5H9@Z',
			'adm_pemasaran':'#M28$1C6@V'
		};
		$('#edit_role').val(roleMap[user.role]||'');
		tampilkanmodal();
		if(btn){
			$(btn).prop('disabled',false).removeAttr('disabled');
		}
	});
	return true;
};

window.Btn_Proses=function(user){
	$('#modalTitle').text('Proses Edit Akun Pegawai');
	$('#modalNamaPegawai').text(user.nama_lengkap||'-');
	$('#modalNIPKPegawai').text(user.nipk||'-');
	$('#FormLanjutKontrak').removeClass('d-none');
};

window.togglePassword=function(inputId,button){
	const input=document.getElementById(inputId);
	if(!input)return;
	const icon=button.querySelector('i');
	if(input.type==='password'){
		input.type='text';
		if(icon){
			icon.classList.remove('fa-eye');
			icon.classList.add('fa-eye-slash');
		}
		button.setAttribute('aria-label','Sembunyikan password');
	}else{
		input.type='password';
		if(icon){
			icon.classList.remove('fa-eye-slash');
			icon.classList.add('fa-eye');
		}
		button.setAttribute('aria-label','Tampilkan password');
	}
};

window.checkPasswordPegawai=function(password,confirm,message){
	const pass=password.value;
	const conf=confirm.value;
	if(pass===''&&conf===''){
		message.textContent='';
		message.className='';
		password.classList.remove('is-valid','is-invalid');
		confirm.classList.remove('is-valid','is-invalid');
		return true;
	}
	if(pass!==''&&conf===''){
		message.textContent='Verifikasi password wajib diisi.';
		message.className='text-danger';
		confirm.classList.add('is-invalid');
		confirm.classList.remove('is-valid');
		return false;
	}
	if(pass===''&&conf!==''){
		message.textContent='Password baru wajib diisi.';
		message.className='text-danger';
		password.classList.add('is-invalid');
		password.classList.remove('is-valid');
		return false;
	}
	if(pass!==conf){
		message.textContent='Password tidak sama.';
		message.className='text-danger';
		confirm.classList.add('is-invalid');
		confirm.classList.remove('is-valid');
		return false;
	}
	message.textContent='Password cocok.';
	message.className='text-success';
	password.classList.add('is-valid');
	password.classList.remove('is-invalid');
	confirm.classList.add('is-valid');
	confirm.classList.remove('is-invalid');
	return true;
};

window.validatePasswordBeforeSubmit=function(btn){
	const password=document.getElementById('edit_password');
	const confirm=document.getElementById('edit_password_confirm');
	if(!password||!confirm)return disableSubmit(btn);
	const pass=password.value;
	const conf=confirm.value;
	if(pass===''&&conf==='')return disableSubmit(btn);
	if(pass!==''&&conf===''){
		alert('Verifikasi password wajib diisi.');
		confirm.focus();
		return false;
	}
	if(pass===''&&conf!==''){
		alert('Password baru wajib diisi.');
		password.focus();
		return false;
	}
	if(pass!==conf){
		alert('Password baru dan verifikasi password tidak sama.');
		confirm.focus();
		return false;
	}
	return disableSubmit(btn);
};

})();
