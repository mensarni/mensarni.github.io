(function(){
if(window.auditPegawaiJsLoaded)return;
window.auditPegawaiJsLoaded=true;

window.toggleChanges=function(el){
	var parent=el.closest('td');
	var full=el.nextElementSibling;
	var pendek=parent.querySelector('.sort-changes');
	var tampil=full.style.display==='none';
	full.style.display=tampil?'block':'none';
	pendek.style.display=tampil?'none':'block';
	el.innerText=tampil?'Sembunyikan':'Lihat Semua';
};

// SELECT ALL AUDIT
$(document)
.off('change.audit','#checkAllAudit')
.on('change.audit','#checkAllAudit',function(){
	var status=this.checked;
	$('.checkAudit').prop('checked',status);
});

// SINKRONISASI SELECT ALL
$(document)
.off('change.auditItem','.checkAudit')
.on('change.auditItem','.checkAudit',function(){
	var total=$('.checkAudit').length;
	var terpilih=$('.checkAudit:checked').length;
	$('#checkAllAudit').prop('checked',total>0&&total===terpilih);
});

// HAPUS AUDIT
$(document)
.off('click.audit','#btnHapusAudit')
.on('click.audit','#btnHapusAudit',function(){
	var btnHapus=this;
	var terpilih=$('.checkAudit:checked');

	if(!terpilih.length){
		alert('Pilih data audit yang ingin dihapus!');
		return;
	}
	if(!confirm('Hapus '+terpilih.length+' data audit yang dipilih?'))return;

	var tombolAwal=btnHapus.innerHTML;
	disableSubmit(btnHapus);

	var form=document.createElement('form');
	form.method='POST';
	form.target='ProsesFrame';

	var csrf=document.createElement('input');
	csrf.type='hidden';
	csrf.name='csrf';
	csrf.value=window.csrfAudit||'';
	form.appendChild(csrf);

	terpilih.each(function(){
		var input=document.createElement('input');
		input.type='hidden';
		input.name='audit_id[]';
		input.value=this.value;
		form.appendChild(input);
	});

	window.callbackAuditSelesai=function(){
		btnHapus.disabled=false;
		btnHapus.innerHTML=tombolAwal;
		window.callbackAuditSelesai=null;
	};

	document.body.appendChild(form);
	form.submit();
	form.remove();
});

// RESET FILTER
window.initFilterAudit=function(){
	$('.filter-pegawai').each(function(){
		this.selectedIndex=0;
	});
};

window.initFilterAudit();
})();