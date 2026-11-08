(function(){
    const URL_WILAYAH='/assets/component/wilayah.php';
    const cacheWilayah={};
    const requestWilayah={};
    function resetKota(){
        $('#kota_kabupaten').html('<option value="">Pilih Kota/Kabupaten</option>').prop('disabled',true);
    }
    function resetKecamatan(){
        $('#kecamatan').html('<option value="">Pilih Kecamatan</option>').prop('disabled',true);
    }
    function resetKelurahan(){
        $('#kelurahan').html('<option value="">Pilih Kelurahan</option>').prop('disabled',true);
    }
    function ambilDataWilayah(level,parent,callback){
        const key=level+'_'+(parent||'');
        if(cacheWilayah[key]){
            callback(true,cacheWilayah[key]);
            return;
        }
        if(requestWilayah[key]){
            requestWilayah[key].push(callback);
            return;
        }
        requestWilayah[key]=[callback];
        $.ajax({
            url:URL_WILAYAH,
            type:'GET',
            dataType:'json',
            data:{level:level,parent:parent||''},
            success:function(res){
                const berhasil=Array.isArray(res);
                if(berhasil) cacheWilayah[key]=res;
                const callbacks=requestWilayah[key]||[];
                delete requestWilayah[key];
                callbacks.forEach(function(fn){fn(berhasil,res);});
            },
            error:function(xhr){
                console.error('Gagal mengambil wilayah level '+level+':',xhr.responseText);
                const callbacks=requestWilayah[key]||[];
                delete requestWilayah[key];
                callbacks.forEach(function(fn){fn(false,[]);});
            }
        });
    }
    function isiOptionWilayah(el,placeholder,data){
        const fragment=document.createDocumentFragment();
        fragment.appendChild(new Option(placeholder,''));
        data.forEach(function(r){
            const option=new Option(r.nama,r.nama);
            option.setAttribute('data-kode',r.kode||'');
            fragment.appendChild(option);
        });
        el.empty().append(fragment);
    }
    window.loadProvinsi=function(selected,callback){
        const el=$('#provinsi');
        el.html('<option value="">Loading Provinsi...</option>').prop('disabled',true);
        ambilDataWilayah(1,'',function(berhasil,res){
            if(!berhasil){
                el.html('<option value="">Gagal memuat Provinsi</option>');
                if(typeof callback==='function') callback(false,'');
                return;
            }
            isiOptionWilayah(el,'Pilih Provinsi',res);
            el.prop('disabled',false);
            if(selected) el.val(selected);
            const kode=el.find(':selected').attr('data-kode')||'';
            if(typeof callback==='function') callback(true,kode);
        });
    };
    window.loadKota=function(kode,selected,callback){
        const el=$('#kota_kabupaten');
        resetKecamatan();
        resetKelurahan();
        if(!kode){
            resetKota();
            if(typeof callback==='function') callback(false,'');
            return;
        }
        el.html('<option value="">Loading Kota/Kabupaten...</option>').prop('disabled',true);
        ambilDataWilayah(2,kode,function(berhasil,res){
            if(!berhasil){
                el.html('<option value="">Gagal memuat Kota/Kabupaten</option>');
                if(typeof callback==='function') callback(false,'');
                return;
            }
            isiOptionWilayah(el,'Pilih Kota/Kabupaten',res);
            el.prop('disabled',false);
            if(selected) el.val(selected);
            const selectedKode=el.find(':selected').attr('data-kode')||'';
            if(typeof callback==='function') callback(true,selectedKode);
        });
    };
    window.loadKecamatan=function(kode,selected,callback){
        const el=$('#kecamatan');
        resetKelurahan();
        if(!kode){
            resetKecamatan();
            if(typeof callback==='function') callback(false,'');
            return;
        }
        el.html('<option value="">Loading Kecamatan...</option>').prop('disabled',true);
        ambilDataWilayah(3,kode,function(berhasil,res){
            if(!berhasil){
                el.html('<option value="">Gagal memuat Kecamatan</option>');
                if(typeof callback==='function') callback(false,'');
                return;
            }
            isiOptionWilayah(el,'Pilih Kecamatan',res);
            el.prop('disabled',false);
            if(selected) el.val(selected);
            const selectedKode=el.find(':selected').attr('data-kode')||'';
            if(typeof callback==='function') callback(true,selectedKode);
        });
    };
    window.loadKelurahan=function(kode,selected,callback){
        const el=$('#kelurahan');
        if(!kode){
            resetKelurahan();
            if(typeof callback==='function') callback(false);
            return;
        }
        el.html('<option value="">Loading Kelurahan...</option>').prop('disabled',true);
        ambilDataWilayah(4,kode,function(berhasil,res){
            if(!berhasil){
                el.html('<option value="">Gagal memuat Kelurahan</option>');
                if(typeof callback==='function') callback(false);
                return;
            }
            isiOptionWilayah(el,'Pilih Kelurahan',res);
            el.prop('disabled',false);
            if(selected) el.val(selected);
            if(typeof callback==='function') callback(true);
        });
    };
    window.loadWilayah=function(data,callback){
        data=data||{};
        window.dataWilayah={
            provinsi:data.provinsi||'',
            kota_kabupaten:data.kota_kabupaten||'',
            kecamatan:data.kecamatan||'',
            kelurahan:data.kelurahan||''
        };
        const w=window.dataWilayah;
        loadProvinsi(w.provinsi,function(ok,kodeProvinsi){
            if(!ok){
                if(typeof callback==='function') callback(false);
                return;
            }
            loadKota(kodeProvinsi,w.kota_kabupaten,function(ok,kodeKota){
                if(!ok){
                    if(typeof callback==='function') callback(false);
                    return;
                }
                loadKecamatan(kodeKota,w.kecamatan,function(ok,kodeKecamatan){
                    if(!ok){
                        if(typeof callback==='function') callback(false);
                        return;
                    }
                    loadKelurahan(kodeKecamatan,w.kelurahan,function(ok){
                        if(!ok){
                            if(typeof callback==='function') callback(false);
                            return;
                        }
                        if(typeof callback==='function') callback(true);
                    });
                });
            });
        });
    };
    window.resetWilayah=function(){
        window.dataWilayah={
            provinsi:'',
            kota_kabupaten:'',
            kecamatan:'',
            kelurahan:''
        };
        $('#provinsi').html('<option value="">Pilih Provinsi</option>').prop('disabled',false);
        resetKota();
        resetKecamatan();
        resetKelurahan();
    };
    $(document).on('change','#provinsi',function(){
        const kode=$(this).find(':selected').attr('data-kode')||'';
        window.dataWilayah.kota_kabupaten='';
        window.dataWilayah.kecamatan='';
        window.dataWilayah.kelurahan='';
        loadKota(kode,'',function(){});
    });
    $(document).on('change','#kota_kabupaten',function(){
        const kode=$(this).find(':selected').attr('data-kode')||'';
        window.dataWilayah.kecamatan='';
        window.dataWilayah.kelurahan='';
        loadKecamatan(kode,'',function(){});
    });
    $(document).on('change','#kecamatan',function(){
        const kode=$(this).find(':selected').attr('data-kode')||'';
        window.dataWilayah.kelurahan='';
        loadKelurahan(kode,'',function(){});
    });
})();