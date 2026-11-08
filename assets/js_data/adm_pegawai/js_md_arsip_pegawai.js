(function(){
if(window.arsipPegawaiJsLoaded)return;
window.arsipPegawaiJsLoaded=true;
window.dataArsipPegawai=window.dataArsipPegawai||[];
window.modal=null;
window.pegawaiArsipId=null;
window.initArsipPegawai=function(){
	const modalElement=document.getElementById('modal');
	if(modalElement){
		window.modal=bootstrap.Modal.getOrCreateInstance(modalElement,{backdrop:'static',keyboard:false});
	}
};
$(document).on('click','.btn-proses-arsip-pegawai',function(e){
	e.preventDefault();
	e.stopPropagation();
	const id=$(this).attr('data-id')||$(this).attr('data-user-id');
	const userData=$(this).attr('data-user');
	if(!id){
		window.parent.postMessage({type:"flash_message",message:"<b>GAGAL!</b><br>ID pegawai tidak ditemukan.",status:"danger"},"*");
		return false;
	}
	bukaProsesArsipPegawai(id,userData);
	return false;
});
$(document).on('click','.btn-riwayat-arsip-pegawai',function(e){
	e.preventDefault();
	e.stopPropagation();
	const id=$(this).attr('data-id')||$(this).attr('data-user-id');
	const userData=$(this).attr('data-user');
	if(!id){
		window.parent.postMessage({type:"flash_message",message:"<b>GAGAL!</b><br>ID pegawai tidak ditemukan.",status:"danger"},"*");
		return false;
	}
	bukaArsipPegawai(id,userData);
	return false;
});
$(document).on('click','#btnSimpanArsipPegawai',function(e){
	return simpanArsipPegawai(this);
});
function parseDataArsipPegawai(data){
	if(typeof data==='object'&&data!==null)return data;
	try{return JSON.parse(data||'{}');}catch(e){console.error('JSON pegawai tidak valid:',e);return {};}
}
function bukaProsesArsipPegawai(id,userData){
	const user=parseDataArsipPegawai(userData);
	if(!user||!user.user_id){
		window.parent.postMessage({type:"flash_message",message:"<b>GAGAL!</b><br>Data pegawai tidak ditemukan.",status:"danger"},"*");
		return;
	}
	closeAllModal(function(){
		window.pegawaiArsipId=id;
		const form=document.getElementById('form_arsip_pegawai');
		if(form)form.reset();
		$('#pegawai_user_id').val(id);
		WarnaPrimary();
		isiDataPegawai(user);
		Btn_ProsesArsip(user);
		tampilkanmodal();
	});
}
function bukaArsipPegawai(id,userData){
	const user=parseDataArsipPegawai(userData);
	if(!user||!user.user_id){
		window.parent.postMessage({type:"flash_message",message:"<b>GAGAL!</b><br>Data pegawai tidak ditemukan.",status:"danger"},"*");
		return;
	}
	closeAllModal(function(){
		window.pegawaiArsipId=id;
		const form=document.getElementById('form_arsip_pegawai');
		if(form)form.reset();
		$('#pegawai_user_id').val(id);
		WarnaSuccess();
		isiDataPegawai(user);
		isiListArsipPegawai(user);
		Btn_ListArsip(user);
		tampilkanmodal();
	});
}
function Btn_ProsesArsip(user){
	$('#modalTitle').text('Proses Update Arsip / Dokumen Pegawai');
	$('#modalNamaPegawai').text(user.nama_lengkap||user.name||'-');
	$('#modalNIPKPegawai').text(user.nipk||'-');
	$('#FormArsipPegawai').removeClass('d-none');
	$('#boxListArsipPegawai').addClass('d-none');
	$('#btnSimpanArsipPegawai').removeClass('d-none');
	$('#form_action').val('update');
}
function Btn_ListArsip(user){
	$('#modalTitle').text('Arsip / Dokumen Pegawai');
	$('#modalNamaPegawai').text(user.nama_lengkap||user.name||'-');
	$('#modalNIPKPegawai').text(user.nipk||'-');
	$('#FormArsipPegawai').addClass('d-none');
	$('#boxListArsipPegawai').removeClass('d-none');
	$('#btnSimpanArsipPegawai').addClass('d-none');
}
function isiListArsipPegawai(user){
	const list=user.arsip_bpjs||[];
	let html='';
	$.each(list,function(i,row){
		html+='<tr><td>'+(i+1)+'</td><td>'+escapeHtml(row.jenis||'')+'</td><td>'+escapeHtml(row.nomor||'')+'</td><td>'+escapeHtml(row.status||'')+'</td><td><button type="button" class="btn btn-success btn-sm bg-soft-success m-1" data-id="'+escapeHtml(row.id||'')+'"><i class="fa-light fa-eye me-1"></i>Lihat</button></td></tr>';
	});
	if(!html)html='<tr><td colspan="5" class="text-center text-muted">Belum ada arsip BPJS.</td></tr>';
	$('#list_arsip_pegawai').html(html);
}
function simpanArsipPegawai(btn){
	const form=document.getElementById('form_arsip_pegawai');
	if(!form){
		window.parent.postMessage({type:"flash_message",message:"<b>GAGAL!</b><br>Form arsip dokumen tidak ditemukan.",status:"danger"},"*");
		return false;
	}
	const userId=$(form).find('[name="user_id"]').val();
	if(!userId){
		window.parent.postMessage({type:"flash_message",message:"<b>GAGAL!</b><br>ID pegawai tidak ditemukan.",status:"danger"},"*");
		return false;
	}
	let valid=true;
	$(form).find('[required]').each(function(){
		if(!String($(this).val()||'').trim()){
			valid=false;
			$(this).addClass('is-invalid');
			$(this).focus();
			return false;
		}
		$(this).removeClass('is-invalid');
	});
	if(!valid){
		window.parent.postMessage({type:"flash_message",message:"<b>GAGAL!</b><br>Data wajib diisi.",status:"danger"},"*");
		return false;
	}
	['bpjs_jht','bpjs_jp','bpjs_jkk','bpjs_jkm','bpjs_jkp'].forEach(function(nama){
		const checkbox=$(form).find('input[type="checkbox"][name="'+nama+'"],input[type="checkbox"][data-bpjs-checkbox="'+nama+'"]').first();
		if(!checkbox.length)return;
		checkbox.attr('data-bpjs-checkbox',nama);
		let hidden=$(form).find('input[type="hidden"][data-bpjs-hidden="'+nama+'"]');
		if(!hidden.length)hidden=$('<input>',{type:'hidden',name:nama,'data-bpjs-hidden':nama}).appendTo(form);
		hidden.val(checkbox.prop('checked')?'1':'0');
		checkbox.removeAttr('name');
	});
	form.method='POST';
	form.action='';
	form.target='ProsesFrame';
	if(btn)disableSubmit(btn);
	return true;
}
function escapeHtml(value){
	return $('<div>').text(value==null?'':value).html();
}
})();