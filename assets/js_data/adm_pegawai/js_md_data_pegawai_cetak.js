window.initMdDataPegawaiCetak = function(){
    if(window.mdDataPegawaiCetakEvent)return;
    window.mdDataPegawaiCetakEvent=true;

    $(document).on('click','#modal #btnCetakPegawai',async function(e){
        e.preventDefault();
        e.stopImmediatePropagation();

        const btn=this;
        const htmlAwal=btn.innerHTML;
        const modal=document.querySelector('#modal.show');
        const dialog=modal?modal.querySelector('.modal-dialog'):null;
        const modalContent=modal?modal.querySelector('.modal-content'):null;
        const content=modal?modal.querySelector('.modal-body'):null;

        if(!content||!dialog||!modalContent){
            message('<b>GAGAL!</b><br>Isi modal tidak ditemukan.','danger');
            return;
        }

        const cssAwal={
            dialogWidth:dialog.style.width,
            dialogMaxWidth:dialog.style.maxWidth,
            dialogHeight:dialog.style.height,
            dialogMaxHeight:dialog.style.maxHeight,
            dialogMargin:dialog.style.margin,
            contentWidth:modalContent.style.width,
            contentHeight:modalContent.style.height,
            contentMinHeight:modalContent.style.minHeight,
            contentMaxHeight:modalContent.style.maxHeight,
            bodyHeight:content.style.height,
            bodyMaxHeight:content.style.maxHeight,
            bodyOverflow:content.style.overflow
        };

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
                logging:false,
                scrollX:0,
                scrollY:0,
                windowWidth:Math.max(content.scrollWidth,content.clientWidth),
                windowHeight:Math.max(content.scrollHeight,content.clientHeight)
            });

            if(!canvas||!canvas.width||!canvas.height){
                throw new Error('Gagal mengambil gambar isi modal.');
            }

            const {jsPDF}=window.jspdf;
            const pdf=new jsPDF('l','mm','a4');
            const pageWidth=pdf.internal.pageSize.getWidth();
            const pageHeight=pdf.internal.pageSize.getHeight();
            const margin=5;
            const maxWidth=pageWidth-(margin*2);
            const maxHeight=pageHeight-(margin*2);

            const ratio=Math.min(
                maxWidth/canvas.width,
                maxHeight/canvas.height
            );

            const imgWidth=canvas.width*ratio;
            const imgHeight=canvas.height*ratio;
            const x=(pageWidth-imgWidth)/2;
            const y=(pageHeight-imgHeight)/2;
            const imgData=canvas.toDataURL('image/jpeg',0.95);

            pdf.addImage(imgData,'JPEG',x,y,imgWidth,imgHeight);

            const eleNama=document.getElementById('modalNamaPegawai');
            const namaPegawai=(eleNama?eleNama.textContent.trim():'Pegawai')
                .replace(/[\\/:*?"<>|]/g,'_')
                .replace(/\s+/g,'_');

            pdf.save('Data_Profil_Pegawai_'+(namaPegawai||'Pegawai')+'.pdf');

        }catch(error){
            console.error('Gagal cetak PDF:',error);
            message('<b>GAGAL!</b><br>'+String(error.message||error),'danger');
        }finally{
            dialog.style.width=cssAwal.dialogWidth;
            dialog.style.maxWidth=cssAwal.dialogMaxWidth;
            dialog.style.height=cssAwal.dialogHeight;
            dialog.style.maxHeight=cssAwal.dialogMaxHeight;
            dialog.style.margin=cssAwal.dialogMargin;

            modalContent.style.width=cssAwal.contentWidth;
            modalContent.style.height=cssAwal.contentHeight;
            modalContent.style.minHeight=cssAwal.contentMinHeight;
            modalContent.style.maxHeight=cssAwal.contentMaxHeight;

            content.style.height=cssAwal.bodyHeight;
            content.style.maxHeight=cssAwal.bodyMaxHeight;
            content.style.overflow=cssAwal.bodyOverflow;

            btn.disabled=false;
            btn.innerHTML=htmlAwal;
        }
    });
};