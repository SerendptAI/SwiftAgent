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

    // 3. Create the iframe element
    const iframe = document.createElement('iframe');
    iframe.className = 'swift-agent-widget-iframe';
    iframe.src = `${baseUrl}/en/embed/widget/${companyId}`;
    iframe.setAttribute('allow', 'microphone');

    // Ensure iframe stays clickable even when host uses Lenis
    const style = document.createElement('style');
    style.textContent = 'iframe.swift-agent-widget-iframe { pointer-events: auto !important; }';
    document.head.appendChild(style);

    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.right = '0';
    iframe.style.border = 'none';
    iframe.style.zIndex = '2147483647';
    iframe.style.background = 'transparent';
    iframe.style.display = 'block';
    iframe.style.width = '100vw';
    iframe.style.height = '72px';
    iframe.style.pointerEvents = 'auto';

    // 4. Body push so the widget banner doesn't overlap the host page header
    document.body.style.transition = 'margin-top 0.3s ease-in-out';
    document.body.style.marginTop = '72px';

    // 5. Append to body — shows on ALL pages of the customer's website
    document.body.appendChild(iframe);

    // 6. Message listener to handle resizing from the iframe (banner ↔ fullscreen call)
    window.addEventListener('message', function (event) {
        if (event.origin !== baseUrl) return;

        try {
            if (event.data && event.data.type === 'SWIFT_AGENT_WIDGET_RESIZE') {
                const { width, height, pointerEvents } = event.data;
                if (width) iframe.style.width = width;
                if (height) iframe.style.height = height;
                if (pointerEvents) iframe.style.pointerEvents = pointerEvents;

                if (height === '100vh') {
                    document.body.style.marginTop = '0px';
                } else if (height === '72px') {
                    document.body.style.marginTop = '72px';
                }
            }
        } catch {
            // Ignore parsing errors
        }
    });

})();
