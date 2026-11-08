function loadOrganisasi(data){
    data=data||{};
    const departemen=$('#data_pegawai_departemen');
    const divisi=$('#data_pegawai_divisi');
    const unit=$('#data_pegawai_unit_usaha');
    const jabatan=$('#data_pegawai_jabatan');
    const vDep=$.trim(data.departemen||'');
    const vDiv=$.trim(data.divisi||'');
    const vUnit=$.trim(data.unit_usaha||'');
    const vJab=$.trim(data.jabatan||'');
    departemen.html('<option value="">- Pilih Departemen -</option>');
    divisi.html('<option value="">- Pilih Divisi -</option>');
    unit.html('<option value="">- Pilih Unit Usaha -</option>');
    jabatan.html('<option value="">- Pilih Jabatan -</option>');
    unit.closest('.form-floating').hide();
    const depSet=new Set();
    (window.dataFilter||[]).forEach(function(d){
        const value=$.trim(d.list1||'');
        if(value) depSet.add(value);
    });
    depSet.forEach(function(v){
        departemen.append($('<option>',{value:v,text:v}));
    });
    if(vDep){
        departemen.val(vDep);
        loadDivisi(vDep,vDiv,vUnit,vJab);
    }
}
function loadDivisi(depValue,divValue,unitValue,jabValue){
    const divisi=$('#data_pegawai_divisi');
    const unit=$('#data_pegawai_unit_usaha');
    const jabatan=$('#data_pegawai_jabatan');
    const vDiv=$.trim(divValue||'');
    divisi.html('<option value="">- Pilih Divisi -</option>');
    unit.html('<option value="">- Pilih Unit Usaha -</option>');
    jabatan.html('<option value="">- Pilih Jabatan -</option>');
    unit.closest('.form-floating').hide();
    if(!depValue) return;
    const set=new Set();
    (window.dataFilter||[]).forEach(function(d){
        if($.trim(d.list1||'')===$.trim(depValue)&&$.trim(d.list2||'')){
            set.add($.trim(d.list2));
        }
    });
    set.forEach(function(v){
        divisi.append($('<option>',{value:v,text:v}));
    });
    if(vDiv) divisi.val(vDiv);
    if(divisi.val()){
        loadUnitAtauJabatan(divisi.val(),unitValue,jabValue);
    }
}
function loadUnitAtauJabatan(divValue,unitValue,jabValue){
    const unit=$('#data_pegawai_unit_usaha');
    const jabatan=$('#data_pegawai_jabatan');
    const vUnit=$.trim(unitValue||'');
    const vJab=$.trim(jabValue||'');
    unit.html('<option value="">- Pilih Unit Usaha -</option>');
    jabatan.html('<option value="">- Pilih Jabatan -</option>');
    unit.closest('.form-floating').hide();
    if(!divValue) return;
    if($.trim(divValue).toLowerCase()==='outsourcing'){
        unit.closest('.form-floating').show();
        const set=new Set();
        (window.dataFilter||[]).forEach(function(d){
            if($.trim(d.list2||'')===$.trim(divValue)&&$.trim(d.list4||'')){
                set.add($.trim(d.list4));
            }
        });
        set.forEach(function(v){
            unit.append($('<option>',{value:v,text:v}));
        });
        if(vUnit) unit.val(vUnit);
        loadJabatan(divValue,unit.val()||'',vJab);
        unit.prop('disabled',false);
    }else{
        loadJabatan(divValue,'',vJab);
    }
}
function loadJabatan(divValue,unitValue,jabValue){
    const jabatan=$('#data_pegawai_jabatan');
    const vJab=$.trim(jabValue||'');
    jabatan.html('<option value="">- Pilih Jabatan -</option>');
    if(!divValue) return;
    const set=new Set();
    (window.dataFilter||[]).forEach(function(d){
        if($.trim(d.list2||'')!==$.trim(divValue)) return;
        if(unitValue&&$.trim(d.list4||'')!==$.trim(unitValue)) return;
        if($.trim(d.list3||'')) set.add($.trim(d.list3));
    });
    set.forEach(function(v){
        jabatan.append($('<option>',{value:v,text:v}));
    });
    if(vJab) jabatan.val(vJab);
    jabatan.prop('disabled',false);
}
$(document).on('change','#data_pegawai_departemen',function(){
    const dep=$.trim($(this).val());
    const divisi=$('#data_pegawai_divisi');
    const unit=$('#data_pegawai_unit_usaha');
    const jabatan=$('#data_pegawai_jabatan');
    divisi.html('<option value="">- Pilih Divisi -</option>');
    unit.html('<option value="">- Pilih Unit Usaha -</option>');
    jabatan.html('<option value="">- Pilih Jabatan -</option>');
    divisi.prop('disabled',true);
    unit.prop('disabled',true);
    jabatan.prop('disabled',true);
    unit.closest('.form-floating').hide();
    if(!dep) return;
    const set=new Set();
    (window.dataFilter||[]).forEach(function(d){
        if($.trim(d.list1||'')===dep&&$.trim(d.list2||'')){
            set.add($.trim(d.list2));
        }
    });
    set.forEach(function(v){
        divisi.append($('<option>',{value:v,text:v}));
    });
    divisi.prop('disabled',false);
});
$(document).on('change','#data_pegawai_divisi',function(){
    const div=$.trim($(this).val());
    const unit=$('#data_pegawai_unit_usaha');
    const jabatan=$('#data_pegawai_jabatan');
    unit.html('<option value="">- Pilih Unit Usaha -</option>');
    jabatan.html('<option value="">- Pilih Jabatan -</option>');
    unit.prop('disabled',true);
    jabatan.prop('disabled',true);
    unit.closest('.form-floating').hide();
    if(!div) return;
    if(div.toLowerCase()==='outsourcing'){
        unit.closest('.form-floating').show();
        const set=new Set();
        (window.dataFilter||[]).forEach(function(d){
            if($.trim(d.list2||'')===div&&$.trim(d.list4||'')){
                set.add($.trim(d.list4));
            }
        });
        set.forEach(function(v){
            unit.append($('<option>',{value:v,text:v}));
        });
        unit.prop('disabled',false);
    }else{
        loadJabatan(div,'','');
        jabatan.prop('disabled',false);
    }
});
$(document).on('change','#data_pegawai_unit_usaha',function(){
    const div=$.trim($('#data_pegawai_divisi').val()||'');
    const unit=$.trim($(this).val()||'');
    loadJabatan(div,unit,'');
    $('#data_pegawai_jabatan').prop('disabled',!unit);
});