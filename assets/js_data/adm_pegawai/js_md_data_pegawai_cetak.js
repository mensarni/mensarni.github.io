(function(){
    if(window.cetakPegawaiJsLoaded) return;
    window.cetakPegawaiJsLoaded=true;
    $(document).on('click','#btnCetakPegawai',async function(e){
        e.preventDefault();
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
        const htmlAwal=btn.html();
        btn.prop('disabled',true);
        btn.html('<span class="spinner-border spinner-border-sm me-1"></span>Membuat PDF...');
        try{
            const canvas=await html2canvas(content,{
                scale:2,
                useCORS:true,
                backgroundColor:'#ffffff'
            });
            const {jsPDF}=window.jspdf;
            const pdf=new jsPDF('p','mm','a4');
            const pageWidth=pdf.internal.pageSize.getWidth();
            const pageHeight=pdf.internal.pageSize.getHeight();
            const margin=5;
            const pdfWidth=pageWidth-(margin*2);
            const pdfHeight=canvas.height*pdfWidth/canvas.width-50;
            const imgData=canvas.toDataURL('image/jpeg',0.95);
            let heightLeft=pdfHeight;
            let position=margin;
            pdf.addImage(imgData,'JPEG',margin,position,pdfWidth,pdfHeight);
            heightLeft-=pageHeight-(margin*2);
            while(heightLeft>0){
                position=heightLeft-pdfHeight+margin;
                pdf.addPage();
                pdf.addImage(imgData,'JPEG',margin,position,pdfWidth,pdfHeight);
                heightLeft-=pageHeight-(margin*2);
            }
            pdf.save('Data_Mutasi_Pegawai.pdf');
        }catch(error){
            console.error(error);
            alert('Gagal membuat PDF.');
        }finally{
            btn.prop('disabled',false);
            btn.html(htmlAwal);
        }
    });
})();
