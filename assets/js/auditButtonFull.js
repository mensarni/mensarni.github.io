function toggleChanges(el) {
    var parent = el.closest('td');
    var full = el.nextElementSibling;
    var pendek = parent.querySelector('.sort-changes');
    var tampil = full.style.display === 'none';

    full.style.display = tampil ? 'block' : 'none';
    pendek.style.display = tampil ? 'none' : 'block';
    el.innerText = tampil ? 'Sembunyikan' : 'Lihat Semua';
}

document.addEventListener('DOMContentLoaded', function () {
    var btnHapus = document.getElementById('btnHapusAudit');
    var checkAll = document.getElementById('checkAllAudit');

    if (checkAll) {
        checkAll.addEventListener('change', function () {
            document.querySelectorAll('.checkAudit').forEach(function (checkbox) {
                checkbox.checked = checkAll.checked;
            });
        });
    }

    if (btnHapus) {
        btnHapus.addEventListener('click', function () {
            var terpilih = document.querySelectorAll('.checkAudit:checked');

            if (!terpilih.length) {
                alert('Pilih data audit yang ingin dihapus!');
                return;
            }

            if (!confirm('Hapus ' + terpilih.length + ' data audit yang dipilih?')) {
                return;
            }

            var tombolAwal = this.innerHTML;
            disableSubmit(this);

            var form = document.createElement('form');
            form.method = 'POST';
            form.target = 'ProsesFrame';

            var csrf = document.createElement('input');
            csrf.type = 'hidden';
            csrf.name = 'csrf';
            csrf.value = document.querySelector('meta[name="csrf-token"]')?.content || '';
            form.appendChild(csrf);

            terpilih.forEach(function (checkbox) {
                var input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'audit_id[]';
                input.value = checkbox.value;
                form.appendChild(input);
            });

            window.callbackAuditSelesai = function () {
                btnHapus.disabled = false;
                btnHapus.innerHTML = tombolAwal;
                window.callbackAuditSelesai = null;
            };

            document.body.appendChild(form);
            form.submit();
            form.remove();
        });
    }

    // RESET FILTER SAAT AWAL LOAD
    if (window.jQuery) {
        $('.filter-pegawai').each(function () {
            this.selectedIndex = 0;
        });
    }
});