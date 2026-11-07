
(function () {
    "use strict";

    if (window.MSNRealtimeEngine) {
        return;
    }

    const config = window.MSN_REALTIME_CONFIG || {};

    let currentVersion = 0;
    let currentDatabase = config.database || "";
    let isChecking = false;
    let realtimeTimer = null;

    const CHECK_URL = config.checkUrl || "";
    const STATUS_ID = "#realtimeStatus";
    const CONTENT_ID = "#contentBody";
    const INTERVAL = 5000;

    function isNoRealtime() {
        return $(CONTENT_ID).find("#noRealtime").length > 0;
    }

    function formatDate(date) {
        const pad = n => String(n).padStart(2, "0");

        return (
            pad(date.getDate()) + "-" +
            pad(date.getMonth() + 1) + "-" +
            date.getFullYear() + " " +
            pad(date.getHours()) + ":" +
            pad(date.getMinutes()) + ":" +
            pad(date.getSeconds())
        );
    }

    function clearLogBrowser() {
        var methods = ["log", "info", "warn", "error", "debug", "xhr", "css"];

        methods.forEach(function (method) {
            if (window.console && typeof window.console[method] === "function") {
                window.console[method] = function () {};
            }
        });

        if (window.console && typeof window.console.clear === "function") {
            window.console.clear();
        }
    }

    function updateStatus(version, updated = false) {
        let html =
            "<i class='fa-light fa-cloud-check text-success fw-bold'></i> " +
            "Realtime Data | " +
            "<b>DB : </b>" + currentDatabase + " | " +
            "<b>Token : </b>" + version + " | " +
            "<b>Last Check : </b>" +
            formatDate(new Date());

        if (updated) {
            html +=
                " | <span class='text-primary'>" +
                "<i class='fa-light fa-arrows-rotate'></i> Data Diperbarui" +
                "</span>";
        }

        $(STATUS_ID).html(html);
    }

    function updateDisabled() {
        $(STATUS_ID).html(
            "<span class='text-secondary'>" +
            "<i class='fa-light fa-cloud-slash fw-bold'></i> " +
            "Realtime Disabled | " +
            "<b>DB : </b>" + currentDatabase +
            "</span>"
        );
    }

    function updateOffline() {
        $(STATUS_ID).html(
            "<span class='text-danger'>" +
            "<i class='fa-light fa-cloud-xmark fw-bold'></i> " +
            "Realtime Offline | " +
            "<b>DB : </b>" + currentDatabase +
            "</span>"
        );
    }

    function stopRealtime() {
        if (realtimeTimer !== null) {
            clearTimeout(realtimeTimer);
            realtimeTimer = null;
        }

        isChecking = false;
    }

    function reloadContentData() {
        if (isNoRealtime()) {
            return;
        }

        if (typeof reloadTable === "function") {
            reloadTable();
        }
    }

    function checkVersion() {
        if (isNoRealtime()) {
            stopRealtime();
            updateDisabled();
            return;
        }

        if (isChecking) {
            return;
        }

        isChecking = true;

        $.ajax({
            url: CHECK_URL,
            type: "GET",
            dataType: "json",
            cache: false,

            success: function (r) {
                if (!r || typeof r.version === "undefined") {
                    return;
                }

                const version = parseInt(r.version, 10) || 0;

                currentDatabase = r.database || config.database || "";

                clearLogBrowser();

                updateStatus(version, false);

                if (currentVersion === 0) {
                    currentVersion = version;
                    return;
                }

                if (currentVersion !== version) {
                    currentVersion = version;

                    updateStatus(version, true);

                    setTimeout(function () {
                        if (!isNoRealtime()) {
                            reloadContentData();
                        }
                    }, 300);
                }
            },

            error: function (xhr, status, error) {
                updateOffline();
            },

            complete: function () {
                isChecking = false;

                if (isNoRealtime()) {
                    stopRealtime();
                    updateDisabled();
                    return;
                }

                realtimeTimer = setTimeout(checkVersion, INTERVAL);
            }
        });
    }

    function startRealtimeObserver() {
        const content = document.getElementById("contentBody");

        if (!content) {
            return;
        }

        const observer = new MutationObserver(function () {
            if (isNoRealtime()) {
                stopRealtime();
                updateDisabled();
            } else {
                if (realtimeTimer === null && !isChecking) {
                    currentVersion = 0;
                    checkVersion();
                }
            }
        });

        observer.observe(content, {
            childList: true,
            subtree: true
        });

        window.realtimeObserver = observer;
    }

    function initRealtime() {
        if (!CHECK_URL) {
            console.error("Konfigurasi CHECK_URL Realtime belum tersedia.");
            return;
        }

        if (isNoRealtime()) {
            updateDisabled();
        } else {
            checkVersion();
        }

        startRealtimeObserver();
    }

    window.realtimeCheckState = function () {
        if (isNoRealtime()) {
            stopRealtime();
            updateDisabled();
        } else {
            currentVersion = 0;
            stopRealtime();
            checkVersion();
        }
    };

    window.MSNRealtimeEngine = {
        init: initRealtime,
        check: checkVersion,
        stop: stopRealtime
    };

    $(document).ready(function () {
        initRealtime();
    });

})();
