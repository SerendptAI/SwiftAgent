(function () {
    // Prevent multiple injections if the script is accidentally loaded twice or live-reloaded
    if (window.__SWIFT_AGENT_WIDGET_LOADED__) return;
    window.__SWIFT_AGENT_WIDGET_LOADED__ = true;

    // 1. Find the script tag that loaded this script to extract the company ID
    const scripts = document.getElementsByTagName('script');
    let currentScript = null;
    let companyId = null;

    for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src && scripts[i].src.includes('widget.js')) {
            currentScript = scripts[i];
            companyId = currentScript.getAttribute('data-company-id');
            break;
        }
    }

    if (!companyId) {
        console.error('Swift Agent Widget: Missing data-company-id attribute on the script tag.');
        return;
    }

    // 2. Derive the base URL from the widget script's own src so it works in both
    // local dev (localhost:3000) and production without any manual changes.
    let baseUrl = 'http://localhost:3000'; // fallback for local dev
    if (currentScript && currentScript.src) {
        try {
            baseUrl = new URL(currentScript.src).origin;
        } catch {
            // keep localhost fallback
        }
    }

    // Helper to get the appropriate banner height based on viewport width
    function getBannerHeight() {
        return window.innerWidth < 640 ? '56px' : '72px';
    }

    // 3. Create the iframe element
    const iframe = document.createElement('iframe');
    iframe.className = 'swift-agent-widget-iframe';
    iframe.src = `${baseUrl}/en/embed/widget/${companyId}`;
    iframe.setAttribute('allow', 'microphone');

    // Ensure iframe stays clickable even when host uses Lenis
    const style = document.createElement('style');
    style.textContent = 'iframe.swift-agent-widget-iframe { pointer-events: auto !important; }';
    document.head.appendChild(style);

    var bannerHeight = getBannerHeight();

    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.right = '0';
    iframe.style.border = 'none';
    iframe.style.zIndex = '2147483647';
    iframe.style.background = 'transparent';
    iframe.style.display = 'block';
    iframe.style.width = '100vw';
    iframe.style.height = bannerHeight;
    iframe.style.pointerEvents = 'auto';

    // 4. Body push so the widget banner doesn't overlap the host page header
    document.body.style.transition = 'margin-top 0.3s ease-in-out';
    document.body.style.marginTop = bannerHeight;

    // 5. Append to body — shows on ALL pages of the customer's website
    document.body.appendChild(iframe);

    // 6. Update banner height on resize
    var isFullScreen = false;
    window.addEventListener('resize', function () {
        if (!isFullScreen) {
            var newHeight = getBannerHeight();
            iframe.style.height = newHeight;
            document.body.style.marginTop = newHeight;
        }
    });

    // 7. Inject stroll.js — it auto-crawls silently in the background
    var strollScript = document.createElement('script');
    strollScript.src = baseUrl + '/stroll.js';
    strollScript.onload = function () {
        // Auto-start the crawl on first visit (stroll.js checks sessionStorage to avoid re-crawling)
        window.postMessage({
            type: 'STROLL_AUTO_START',
            companyId: companyId,
            widgetOrigin: baseUrl
        }, '*');
    };
    document.head.appendChild(strollScript);

    // 8. Message listener to handle resizing from the iframe
    window.addEventListener('message', function (event) {
        if (event.origin !== baseUrl) return;

        try {
            if (event.data && event.data.type === 'SWIFT_AGENT_WIDGET_RESIZE') {
                const { width, height, pointerEvents } = event.data;
                if (width) iframe.style.width = width;
                if (height) iframe.style.height = height;
                if (pointerEvents) iframe.style.pointerEvents = pointerEvents;

                if (height === '100vh') {
                    isFullScreen = true;
                    document.body.style.marginTop = '0px';
                    document.body.style.overflow = 'hidden';
                } else {
                    isFullScreen = false;
                    document.body.style.marginTop = height;
                    document.body.style.overflow = '';
                }
            }
        } catch {
            // Ignore parsing errors
        }
    });

})();
