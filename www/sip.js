/*
 * SIP.js 0.21.2 loader
 *
 * The browser-side intercom code expects /local/sip.js to expose window.SIP.
 * The official SIP.js 0.21.2 UMD bundle is published as a GitHub release asset.
 *
 * Source:
 * https://github.com/onsip/SIP.js/releases/tag/0.21.2
 */
(function () {
    if (window.SIP) {
        return;
    }

    if (window.__IntercomSipJsLoading) {
        return;
    }

    window.__IntercomSipJsLoading = true;

    var script = document.createElement("script");
    script.src = "https://github.com/onsip/SIP.js/releases/download/0.21.2/sip-0.21.2.min.js";
    script.async = false;
    script.onload = function () {
        console.log("[SIP.js] 0.21.2 loaded from official GitHub release");
        window.dispatchEvent(new Event("intercom-sipjs-loaded"));
    };
    script.onerror = function (error) {
        console.error("[SIP.js] failed to load 0.21.2", error);
        window.__IntercomSipJsLoading = false;
        window.dispatchEvent(new CustomEvent("intercom-sipjs-error", {
            detail: error
        }));
    };

    document.head.appendChild(script);
})();
