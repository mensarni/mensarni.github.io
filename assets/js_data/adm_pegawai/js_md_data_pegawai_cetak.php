
$(document).off('click.cetakPDFPegawai','#btnCetakPegawai');

$(document).on('click.cetakPDFPegawai','#btnCetakPegawai',async function(e){
    e.preventDefault();
    e.stopPropagation();

    if(typeof window.html2canvas!=='function'){
        message('<b>GAGAL!</b><br>Library html2canvas belum tersedia.','danger');
        return;
    }
    if(!window.jspdf||typeof window.jspdf.jsPDF!=='function'){
        message('<b>GAGAL!</b><br>Library jsPDF belum tersedia.','danger');
        return;
    }

    const modal=document.querySelector('.modal.show');
    if(!modal){
        message('<b>GAGAL!</b><br>Modal tidak ditemukan.','danger');
        return;
    }

    const content=modal.querySelector('.modal-body');
    if(!content){
        message('<b>GAGAL!</b><br>Isi modal tidak ditemukan.','danger');
        return;
    }

    const btn=$(this);
    const htmlAwal=btn.html();
    btn.prop('disabled',true);
    btn.html('<span class="spinner-border spinner-border-sm me-1"></span>Membuat PDF...');

    try{
        const canvas=await window.html2canvas(content,{
            scale:2,
            useCORS:true,
            backgroundColor:'#ffffff',
            windowWidth:content.scrollWidth,
            windowHeight:content.scrollHeight
        });

        const {jsPDF}=window.jspdf;
        const pdf=new jsPDF('p','mm','a4');
        const pageWidth=pdf.internal.pageSize.getWidth();
        const pageHeight=pdf.internal.pageSize.getHeight();
        const margin=5;
        const maxWidth=pageWidth-(margin*2);
        const maxHeight=pageHeight-(margin*2);
        const ratio=Math.min(maxWidth/canvas.width,maxHeight/canvas.height);
        const imgWidth=canvas.width*ratio;
        const imgHeight=canvas.height*ratio;
        const x=(pageWidth-imgWidth)/2;
        const y=(pageHeight-imgHeight)/2;
        const imgData=canvas.toDataURL('image/jpeg',0.95);

        pdf.addImage(imgData,'JPEG',x,y,imgWidth,imgHeight);
        pdf.save('Data_Mutasi_Pegawai.pdf');

        message('<b>BERHASIL!</b><br>PDF berhasil dibuat.','success');
    }catch(error){
        console.error(error);
        message('<b>GAGAL!</b><br>Gagal membuat PDF.','danger');
    }finally{
        btn.prop('disabled',false);
        btn.html(htmlAwal);
    }
});
