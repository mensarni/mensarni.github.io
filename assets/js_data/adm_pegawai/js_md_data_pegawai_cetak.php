$(document).ready(function(){
    $('#btnCetakPegawai').on('click',async function(){
        if(typeof window.html2canvas!=='function'){
            alert('Library html2canvas belum tersedia.');
            return;
        }
        if(!window.jspdf || typeof window.jspdf.jsPDF!=='function'){
            alert('Library jsPDF belum tersedia.');
            return;
        }
        const modal=document.querySelector('.modal.show');
        if(!modal){
            alert('Modal tidak ditemukan.');
            return;
        }
        const content=modal.querySelector('.modal-body');
        if(!content){
            alert('Isi modal tidak ditemukan.');
            return;
        }
        const btn=$(this);
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
        }catch(error){
            console.error(error);
            alert('Gagal membuat PDF.');
        }finally{
            btn.prop('disabled',false);
            btn.html('<i class="fa-light fa-print me-1"></i>Cetak');
        }
    });
});
