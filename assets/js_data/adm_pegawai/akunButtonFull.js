(function(){
if(window.statusMassalPegawaiJsLoaded)return;
window.statusMassalPegawaiJsLoaded=true;

function prosesMassal(button,action){
	var terpilih=document.querySelectorAll('.checkAudit:checked');

	if(terpilih.length===0){
		alert('Pilih pegawai terlebih dahulu!');
		return;
	}

	var konfirmasi=action==='aktifkan_massal'
		?'Aktifkan '+terpilih.length+' pegawai yang dipilih?'
		:'Nonaktifkan '+terpilih.length+' pegawai yang dipilih?';

	if(!confirm(konfirmasi))return;

	var tombolAwal=button.innerHTML;
	button.disabled=true;
	button.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';

	var form=document.createElement('form');
	form.method='POST';
	form.action='';
	form.target='ProsesFrame';

	var data={
		csrf:window.CSRF_TOKEN,
		aksi_massal:action
	};

	Object.keys(data).forEach(function(key){
		var input=document.createElement('input');
		input.type='hidden';
		input.name=key;
		input.value=data[key]||'';
		form.appendChild(input);
	});

	terpilih.forEach(function(checkbox){
		var input=document.createElement('input');
		input.type='hidden';
		input.name='user_id[]';
		input.value=checkbox.value;
		form.appendChild(input);
	});

	window.callbackPegawaiMassalSelesai=function(){
		button.disabled=false;
		button.innerHTML=tombolAwal;
		window.callbackPegawaiMassalSelesai=null;
	};

	document.body.appendChild(form);
	form.submit();
	form.remove();
}

// CHECK ALL
$(document)
.off('change.statusMassal','#checkAllAudit')
.on('change.statusMassal','#checkAllAudit',function(){
	$('.checkAudit').prop('checked',this.checked);
});

// UPDATE CHECK ALL
$(document)
.off('change.statusMassalItem','.checkAudit')
.on('change.statusMassalItem','.checkAudit',function(){
	var semua=$('.checkAudit').length;
	var tercentang=$('.checkAudit:checked').length;
	$('#checkAllAudit').prop('checked',semua>0&&semua===tercentang);
});

// AKTIFKAN MASSAL
$(document)
.off('click.statusMassal','#btnAktifkanPegawai')
.on('click.statusMassal','#btnAktifkanPegawai',function(e){
	e.preventDefault();
	prosesMassal(this,'aktifkan_massal');
});

// NONAKTIFKAN MASSAL
$(document)
.off('click.statusMassal','#btnNonaktifkanPegawai')
.on('click.statusMassal','#btnNonaktifkanPegawai',function(e){
	e.preventDefault();
	prosesMassal(this,'nonaktifkan_massal');
});

})();