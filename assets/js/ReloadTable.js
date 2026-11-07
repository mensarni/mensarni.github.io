
"use strict";
window.skipLoader = false;
/* ========================================================= MENU NAVIGATION ========================================================= */
$(document).on("click", ".menu-btn[href]", function (e) {
    const href = $(this).attr("href");
    if (!href) return;
    if (href.indexOf("/logout.php") !== -1 || href.indexOf("logout.php") !== -1) return;
    e.preventDefault();
    window.skipLoader = true;
    $("#loadingOverlay").hide();
    history.pushState({}, "", href);
    $("#PageReload").html(`<div class="d-flex flex-column justify-content-center align-items-center" style="position:absolute; inset:0;"><div class="d-flex"><div class="spinner-grow text-primary me-2"></div><div class="spinner-grow text-danger me-2"></div><div class="spinner-grow text-warning"></div></div><div class="fw-bold mt-3 text-center">Loading Page...</div></div>`);
    $.get(href, function (html) {
        const temp = $("<div>").html(html);
        const page = temp.find("#PageReload").html();
        if (page !== undefined) {
            destroyCharts();
            $("#PageReload").html(page);
        }
        temp.find("#PageReload script").each(function () {
            $.globalEval(this.text || this.textContent || this.innerHTML || "");
        });
        initAll();
        if (typeof closeModal === "function") closeModal();
        window.skipLoader = false;
    }).fail(function () {
        window.skipLoader = false;
        $("#PageReload").html(`<div class="alert alert-danger">Gagal memuat halaman.</div>`);
    });
});
/* ========================================================= CONTENT NAVIGATION ========================================================= */
let contentRequest = null;
function encodeCT(val) {
    return btoa(val).replace(/=/g, "");
}
function loadContent(encoded) {
    const url = new URL(window.location.href);
    url.searchParams.set("ct", encoded);
    if (contentRequest) {
        contentRequest.abort();
    }
    $("#contentBody").html(`
        <div class="d-flex justify-content-center align-items-center py-5">
            <div class="spinner-grow text-primary me-2"></div>
            <div class="spinner-grow text-danger me-2"></div>
            <div class="spinner-grow text-warning"></div>
        </div>
        <div class="text-center fw-bold mt-2">Loading Content...</div>
    `);
    contentRequest = $.get(url.toString(), function (html) {
        const temp = $("<div>").html(html);
        const contentBody = temp.find("#contentBody").first();

        if (!contentBody.length) {
            $("#contentBody").html(
                '<div class="alert alert-danger">Konten halaman tidak ditemukan.</div>'
            );
            return;
        }
        // Ambil script sebelum konten dimasukkan
        const scripts = contentBody.find("script").detach();
        // Ambil konten tanpa script
        const content = contentBody.html();
        // Hapus grafik lama
        destroyCharts();
        // Masukkan konten
        $("#contentBody").html(content);
        // Jalankan script inline satu kali
        scripts.each(function () {
            if (!this.src) {
                $.globalEval(this.text || this.textContent || "");
            }
        });
        // Inisialisasi tabel
        initDataTable();
    }).fail(function (xhr, status) {
        if (status !== "abort") {
            $("#contentBody").html(
                '<div class="alert alert-danger">Gagal memuat halaman.</div>'
            );
        }
    }).always(function () {
        contentRequest = null;
    });
}
function goCT(ct) {
    const encoded = encodeCT(ct);
    const url = new URL(window.location.href);
    url.searchParams.set("ct", encoded);
    history.pushState({}, "", url);
    loadContent(encoded);
}
window.addEventListener("popstate", function () {
    const ct = new URL(window.location.href).searchParams.get("ct");
    if (ct) {
        loadContent(ct);
        window.tampilNavMSN();
        window.autoHideNavMSN();
    }
});
/* ========================================================= DATATABLES ========================================================= */
function initDataTable() {
    try {
        if (typeof $.fn.DataTable === "undefined") return;
        $.fn.dataTable.ext.errMode = "none";
        const tabel = $("#TabelPelamar");
        if (!tabel.length) return;
        let table;
        if ($.fn.DataTable.isDataTable(tabel[0])) {
            table = tabel.DataTable();
        } else {
            table = tabel.DataTable({
                deferRender: true,
                pageLength: 10,
                lengthMenu: [
                    [10, 25, 50, -1],
                    [10, 25, 50, "Semua"]
                ],
                searchDelay: 300,
                autoWidth: false,
                order: [],
                columnDefs: [
                    { targets: 0, orderable: false }
                ],
                language: {
                    processing: "Memuat data...",
                    search: "<i class='fa-light fa-search'></i>",
                    lengthMenu: "<i class='fa-light fa-binoculars'></i> _MENU_",
                    info: "Menampilkan _START_ - _END_ dari _TOTAL_ data",
                    infoEmpty: "Tidak ada data",
                    zeroRecords: "Data tidak ditemukan",
                    emptyTable: "Tidak ada data tersedia",
                    paginate: {
                        previous: "<i class='fa-light fa-angle-left'></i>",
                        next: "<i class='fa-light fa-angle-right'></i>"
                    }
                }
            });
        }
        function updateTotal() {
            const info = table.page.info();
            $("#totalData").text(info.recordsDisplay);
        }
        table.off(".updateTotalPegawai");
        table.on(
            "draw.dt.updateTotalPegawai search.dt.updateTotalPegawai",
            updateTotal
        );
        updateTotal();
    } catch (e) {
        console.log("initDataTable:", e);
    }
}
/* ========================================================= RELOAD TABLE ========================================================= */
function reloadTable(callback) {
    enableProcessButtons();
    $.get(window.location.pathname + window.location.search, function (html) {
        const newBody = $(html).find("#TabelPelamar tbody").html();
        if ($.fn.DataTable.isDataTable("#TabelPelamar")) {
            $("#TabelPelamar").DataTable().destroy();
        }
        if (newBody !== undefined) {
            $("#TabelPelamar tbody").html(newBody);
        }
        initDataTable();
        if (typeof callback === "function") callback();
    });
}
function reloadPPK(callback2) {
    $.get(window.location.pathname + window.location.search, function (html) {
        const newBody = $(html).find("#Table_PPK tbody").html();
        if ($.fn.DataTable.isDataTable("#Table_PPK")) {
            $("#Table_PPK").DataTable().destroy();
        }
        if (newBody !== undefined) {
            $("#Table_PPK tbody").html(newBody);
        }
        closeModal();
        if (typeof callback2 === "function") callback2();
    });
}
/* ========================================================= BUTTON PROCESS ========================================================= */
function disableSubmit(btn) {
    const form = btn.closest("form");
    if (form && !form.checkValidity()) {
        form.reportValidity();
        return false;
    }
    if (!btn.dataset.html) btn.dataset.html = btn.innerHTML;
    const modal = btn.closest(".modal");
    setTimeout(function () {
        if (modal) {
            modal.querySelectorAll("button").forEach(function (b) {
                if (!b.dataset.html) b.dataset.html = b.innerHTML;
                b.disabled = true;
                b.classList.add("disabled");
                b.setAttribute("aria-disabled", "true");
            });
        }
        if (form) {
            form.querySelectorAll("button").forEach(function (b) {
                b.disabled = true;
            });
        }
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span> Processing...';
    }, 0);
    return true;
}
function enableProcessButtons() {
    $(".modal button").each(function () {
        const btn = this;
        if (btn.dataset.html) {
            btn.innerHTML = btn.dataset.html;
            delete btn.dataset.html;
        }
        btn.disabled = false;
        $(btn).removeClass("disabled").removeAttr("aria-disabled");
    });
    $("button[type='submit']").each(function () {
        const btn = this;
        if (btn.dataset.html) {
            btn.innerHTML = btn.dataset.html;
            delete btn.dataset.html;
        }
        btn.disabled = false;
        $(btn).removeClass("disabled").removeAttr("aria-disabled");
    });
}
/* ========================================================= MODAL ========================================================= */
function closeModal() {
    const modalEl = document.querySelector(".modal.show");
    if (modalEl) {
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
    }
    document.querySelectorAll(".modal-backdrop").forEach(function (el) {
        el.remove();
    });
    document.body.classList.remove("modal-open");
    document.body.style.removeProperty("overflow");
    document.body.style.removeProperty("padding-right");
}
$(document).on("hidden.bs.modal", ".modal", function () {
    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open").css({overflow: "", paddingRight: ""});
});
function proses_reload(btn) {
    if (!btn.dataset.html) btn.dataset.html = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Processing...';
    reloadTable(function () {
        btn.disabled = false;
        btn.innerHTML = btn.dataset.html;
        delete btn.dataset.html;
    });
}
function closeAllModal() {
    document.querySelectorAll(".modal.show").forEach(function (modal) {
        const bs = bootstrap.Modal.getInstance(modal);
        if (bs) bs.hide();
    });
    setTimeout(function () {
        document.querySelectorAll(".modal-backdrop").forEach(function (el) {
            el.remove();
        });
        document.body.classList.remove("modal-open");
        document.body.style.removeProperty("overflow");
        document.body.style.removeProperty("padding-right");
    }, 300);
}
/* ========================================================= MODAL WATCHDOG ========================================================= */
window.modalWatchdog = null;
function startModalWatchdog() {
    clearTimeout(window.modalWatchdog);
    window.modalWatchdog = setTimeout(function () {
        closeAllModal();
        alert("Proses terlalu lama. Data akan dimuat ulang.");
        if (typeof reloadTable === "function") {
            reloadTable();
        } else {
            location.reload();
        }
    }, 300000);
}
function stopModalWatchdog() {
    clearTimeout(window.modalWatchdog);
    window.modalWatchdog = null;
}
document.addEventListener("shown.bs.modal", function () {
    startModalWatchdog();
});
document.addEventListener("hidden.bs.modal", function () {
    if (!document.querySelector(".modal.show")) stopModalWatchdog();
});
/* ========================================================= CALLBACK PAGE ========================================================= */
window.callbackPage = function (options) {
    options = options || {};
    if (typeof hideLoader === "function") hideLoader();
    document.querySelectorAll(".modal.show").forEach(function (modal) {
        let bs = bootstrap.Modal.getInstance(modal);
        if (!bs) bs = new bootstrap.Modal(modal);
        bs.hide();
    });
    document.querySelectorAll(".modal-backdrop").forEach(function (el) {
        el.remove();
    });
    document.body.classList.remove("modal-open");
    document.body.style.removeProperty("padding-right");
    document.body.style.removeProperty("overflow");
    if (options.reloadTable !== false) {
        if (typeof reloadTable === "function") {
            reloadTable();
        } else {
            location.reload();
        }
    }
    if (options.message && typeof toast === "function") toast(options.message);
};
window.callbackPagePPK = function (options) {
    options = options || {};
    if (typeof hideLoader === "function") hideLoader();
    closeAllModal();
    if (typeof reloadTable === "function") {
        reloadTable();
    } else {
        location.replace(location.href);
    }
};
/* ========================================================= SELECT / INPUT ========================================================= */
function cekSelectKosong(el) {
    const v = $(el).val();
    $(el).css("background", (v === "" || v === null || v === undefined || v === "0" || v === 0) ? "#f8f9fa" : "#fff");
}
$(document).on("change", "select", function () {
    cekSelectKosong(this);
});
$(document).on("change", "input", function () {
    cekSelectKosong(this);
});
/* ========================================================= RUPIAH ========================================================= */
function formatRupiah(angka) {
    angka = parseInt(angka) || 0;
    if (angka <= 0) return "";
    return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
function toNumber(rp) {
    return parseInt(String(rp || "").replace(/\./g, "")) || 0;
}
function initRupiah(modal) {
    $(modal).find(".rupiah").each(function () {
        const val = toNumber($(this).val());
        $(this).val(formatRupiah(val));
        const hidden = $(this).closest(".form-floating").find("input[type='hidden']");
        if (hidden.length) hidden.val(val);
    });
    if (typeof hitungTotal === "function") hitungTotal();
}
$(document).on("shown.bs.modal", ".modal", function () {
    initRupiah(this);
});
$(document).on("input", ".rupiah", function () {
    const val = toNumber($(this).val());
    $(this).val(formatRupiah(val));
    const hidden = $(this).closest(".form-floating").find("input[type='hidden']");
    if (hidden.length) hidden.val(val);
    if (typeof hitungTotal === "function") hitungTotal();
});
/* ========================================================= HELPER MODAL ========================================================= */
function reloadHelperModal() {
    $("#helper_modal").load(window.location.pathname + window.location.search + " #helper_modal > *");
}
/* ========================================================= RANDOM COLOR ========================================================= */
function getRandomColor() {
    const r = 255;
    const g = Math.floor(Math.random() * 100) + 20;
    const b = Math.floor(Math.random() * 40);
    return "#" + r.toString(16).padStart(2, "0") + g.toString(16).padStart(2, "0") + b.toString(16).padStart(2, "0");
}
function getContrastColor(hex) {
    hex = hex.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return yiq >= 128 ? "#0ff" : "#f00";
}
function initRandomButtons() {
    $(".btn_rand").each(function () {
        const bgColor = getRandomColor();
        $(this).css({backgroundColor: bgColor, color: getContrastColor(bgColor)});
    });
}
function initRandomButtonColor() {
    $(".btn_rand").each(function () {
        const bgColor = getRandomColor();
        $(this).css({backgroundColor: bgColor, color: getContrastColor(bgColor)});
    });
}
/* ========================================================= FLASH MESSAGE ========================================================= */
(function () {
    if (window.__flashMessageInitialized) return;
    window.__flashMessageInitialized = true;
    window.__flashMessageLast = new Map();
    window.addEventListener("message", function (e) {
        if (!e.data || e.data.type !== "flash_message") return;
        const message = String(e.data.message || "");
        if (!message || !document.body) return;
        const status = e.data.status || "success";
        const fingerprint = JSON.stringify([message, status]);
        const sekarang = Date.now();
        window.__flashMessageLast.forEach(function (waktu, key) {
            if (sekarang - waktu >= 7000) window.__flashMessageLast.delete(key);
        });
        if (window.__flashMessageLast.has(fingerprint)) return;
        window.__flashMessageLast.set(fingerprint, sekarang);
        const classMap = {success: "bg-soft-success", danger: "bg-soft-danger", warning: "bg-soft-warning", primary: "bg-soft-primary", info: "bg-soft-info"};
        const bgClass = classMap[status] || "bg-soft-success";
        let container = document.getElementById("flashMessageContainer");
        if (!container) {
            container = document.createElement("div");
            container.id = "flashMessageContainer";
            document.body.appendChild(container);
        }
        const box = document.createElement("div");
        box.className = "flash-item";
        const flash = document.createElement("div");
        flash.className = "flash-message " + bgClass + " bg-opacity-25";
        flash.innerHTML = message;
        box.appendChild(flash);
        container.insertBefore(box, container.firstChild);
        box.__timer = setTimeout(function () {
            window.tutupFlashMessage(box);
        }, 7000);
    });
    window.tutupFlashMessage = function (box) {
        if (!box || box.dataset.closing === "1" || !box.parentNode) return;
        box.dataset.closing = "1";
        clearTimeout(box.__timer);
        const flash = box.querySelector(".flash-message");
        if (!flash) {
            box.remove();
            return;
        }
        flash.style.animation = "flashKeluar .4s ease-in forwards";
        setTimeout(function () {
            if (box.parentNode) {
                const container = box.parentNode;
                box.remove();
                if (container.id === "flashMessageContainer" && container.children.length === 0) container.remove();
            }
        }, 450);
    };
})();
/* ========================================================= LOGIN AKTIF MESSAGE ========================================================= */
(function () {
    function initIdleTimer() {
        if (!document.body) return;
        if (document.getElementById("idleWarningBox")) return;
        let waktu = 15 * 60;
        let timer = null;
        const box = document.createElement("div");
        box.id = "idleWarningBox";
        box.style.cssText = `position: fixed; top: 20px; right: 20px; z-index: 999999; display: none; min-width: 320px;`;
        box.innerHTML = `<div class="alert alert-warning shadow"><div class="fw-bold">Peringatan Sesi</div><div class="mt-1">Anda akan logout dalam <strong id="idleCountdown">01:00</strong></div><button type="button" class="btn btn-sm btn-dark mt-2" id="idleContinue">Tetap Login</button></div>`;
        document.body.appendChild(box);
        const countdown = box.querySelector("#idleCountdown");
        const continueButton = box.querySelector("#idleContinue");
        if (!countdown || !continueButton) {
            console.warn("Idle timer: elemen countdown/button tidak ditemukan.");
            return;
        }
        function formatTime(seconds) {
            const menit = Math.floor(seconds / 60);
            const detik = seconds % 60;
            return String(menit).padStart(2, "0") + ":" + String(detik).padStart(2, "0");
        }
        function mulaiTimer() {
            waktu = 15 * 60;
            box.style.display = "none";
            countdown.textContent = "01:00";
            if (timer) clearInterval(timer);
            timer = setInterval(function () {
                waktu--;
                if (waktu <= 60 && waktu > 0) {
                    box.style.display = "block";
                    countdown.textContent = formatTime(waktu);
                } else {
                    box.style.display = "none";
                }
                if (waktu <= 0) {
                    clearInterval(timer);
                    timer = null;
                    window.location.href = "logout.php?all=1";
                }
            }, 1000);
        }
        continueButton.addEventListener("click", function () {
            mulaiTimer();
        });
        mulaiTimer();
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initIdleTimer, {once: true});
    } else {
        initIdleTimer();
    }
})();
/* ========================================================= DOWNLOAD ========================================================= */
function startDownload() {
    const form = document.getElementById("formDownload");
    const tombol = document.getElementById("btnDownload");
    if (!form || !tombol || tombol.disabled) return;
    const teksAwal = tombol.innerHTML;
    tombol.disabled = true;
    tombol.innerHTML = '<i class="fa-light spinner-border spinner-border-sm me-1"></i> Memproses...';
    let iframe = document.getElementById("downloadFrame");
    if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.id = "downloadFrame";
        iframe.name = "downloadFrame";
        iframe.style.display = "none";
        document.body.appendChild(iframe);
    }
    form.target = "downloadFrame";
    form.submit();
    setTimeout(function () {
        tombol.disabled = false;
        tombol.innerHTML = teksAwal;
    }, 10000);
}
/* ========================================================= PAGE LOADER ========================================================= */
function initPageLoader() {
    if (window.pageLoaderEventTerpasang) return;
    window.pageLoaderEventTerpasang = true;
    window.addEventListener("beforeunload", function () {
        const loader = document.getElementById("loadingOverlay");
        if (!loader) return;
        if (!window.skipLoader && (document.visibilityState === "hidden" || performance.navigation.type === 1)) {
            loader.style.display = "flex";
        }
    });
    const loader = document.getElementById("loadingOverlay");
    if (loader) {
        setTimeout(function () {
            loader.style.display = "none";
        }, 300);
    }
}
/* ========================================================= CHART ========================================================= */
function destroyCharts() {
    if (typeof Chart !== "undefined") {
        Object.values(Chart.instances || {}).forEach(function (chart) {
            chart.destroy();
        });
    }
}
/* ========================================================= INIT ALL ========================================================= */
function initAll() {
    initDataTable();
    initPageLoader();
    initRandomButtons();
}
$(document).ready(function () {
    initAll();
});
