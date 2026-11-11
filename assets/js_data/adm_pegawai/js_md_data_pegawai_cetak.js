window.initMdDataPegawaiCetak=function(){
    if(window.mdDataPegawaiCetakEvent)return;
    window.mdDataPegawaiCetakEvent=true;

    $(document).on('click','#modal #btnCetakPegawai',async function(e){
        e.preventDefault();
        e.stopImmediatePropagation();

        const btn=this;
        const htmlAwal=btn.innerHTML;
        const modal=btn.closest('.modal');
        const dialog=modal?modal.querySelector('.modal-dialog'):null;
        const modalContent=modal?modal.querySelector('.modal-content'):null;
        const content=modal?modal.querySelector('.modal-body'):null;

        if(!content||!dialog||!modalContent){
            message('<b>GAGAL!</b><br>Isi modal tidak ditemukan.','danger');
            return;
        }

        if(typeof window.html2canvas!=='function'){
            message('<b>GAGAL!</b><br>Library html2canvas belum tersedia.','danger');
            return;
        }

        if(!window.jspdf||typeof window.jspdf.jsPDF!=='function'){
            message('<b>GAGAL!</b><br>Library jsPDF belum tersedia.','danger');
            return;
        }

        const elemen=[dialog,modalContent,content];
        const cssAwal=elemen.map(el=>({
            width:el.style.width,
            maxWidth:el.style.maxWidth,
            height:el.style.height,
            minHeight:el.style.minHeight,
            maxHeight:el.style.maxHeight,
            margin:el.style.margin,
            overflow:el.style.overflow
        }));

        btn.disabled=true;
        btn.innerHTML='<span class="spinner-border spinner-border-sm me-1"></span>Membuat PDF...';

        try{
            dialog.style.width='100vw';
            dialog.style.maxWidth='100vw';
            dialog.style.height='100vh';
            dialog.style.maxHeight='100vh';
            dialog.style.margin='0';

            modalContent.style.width='100%';
            modalContent.style.height='100vh';
            modalContent.style.minHeight='100vh';
            modalContent.style.maxHeight='100vh';

            content.style.height='auto';
            content.style.maxHeight='none';
            content.style.overflow='visible';

            await new Promise(resolve=>setTimeout(resolve,500));

            const canvas=await window.html2canvas(content,{
                scale:2,
                useCORS:true,
                allowTaint:false,
                backgroundColor:'#ffffff',
                logging:true,
                scrollX:0,
                scrollY:0,
                windowWidth:Math.max(content.scrollWidth,content.clientWidth),
                windowHeight:Math.max(content.scrollHeight,content.clientHeight)
            });

            if(!canvas||!canvas.width||!canvas.height){
                throw new Error('Gagal mengambil gambar isi modal.');
            }

            const jsPDF=window.jspdf.jsPDF;
            const pdf=new jsPDF({
                orientation:'landscape',
                unit:'mm',
                format:'a4'
            });

            const pageWidth=pdf.internal.pageSize.getWidth();
            const pageHeight=pdf.internal.pageSize.getHeight();
            const margin=5;
            const ratio=Math.min(
                (pageWidth-margin*2)/canvas.width,
                (pageHeight-margin*2)/canvas.height
            );

            const imgWidth=canvas.width*ratio;
            const imgHeight=canvas.height*ratio;
            const x=(pageWidth-imgWidth)/2;
            const y=(pageHeight-imgHeight)/2;

            pdf.addImage(canvas.toDataURL('image/jpeg',0.95),'JPEG',x,y,imgWidth,imgHeight);
            const eleNama=modal.querySelector('#modalNamaPegawai');
            const namaPegawai=(eleNama?eleNama.textContent.trim():'Pegawai')
                .replace(/[\\/:*?"<>|]/g,'_')
                .replace(/\s+/g,'_');

            pdf.save('Data_Profil_Pegawai_'+(namaPegawai||'Pegawai')+'.pdf');

        }catch(error){
            console.error('Gagal cetak PDF:',error);
            message('<b>GAGAL!</b><br>'+String(error.message||error),'danger');
        }finally{
            [dialog,modalContent,content].forEach((el,i)=>{
                el.style.width=cssAwal[i].width;
                el.style.maxWidth=cssAwal[i].maxWidth;
                el.style.height=cssAwal[i].height;
                el.style.minHeight=cssAwal[i].minHeight;
                el.style.maxHeight=cssAwal[i].maxHeight;
                el.style.margin=cssAwal[i].margin;
                el.style.overflow=cssAwal[i].overflow;
            });

            btn.disabled=false;
            btn.innerHTML=htmlAwal;
        }
    });
};
