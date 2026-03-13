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

    // Derive the base URL from the widget script's own src so it works in both
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

    // Ensure iframe stays clickable even when host uses Lenis (e.g. .lenis.lenis-scrolling iframe { pointer-events: none })
    const style = document.createElement('style');
    style.textContent = 'iframe.swift-agent-widget-iframe { pointer-events: auto !important; }';
    document.head.appendChild(style);

    // Set the source to the special Next.js embed route
    // Assuming default locale 'en' for now, can be made dynamic later
    iframe.src = `${baseUrl}/en/embed/widget/${companyId}`;

    // 4. Style the iframe to bridge the gap and stay out of the way
    // These styles ensure it sits politely in the top right corner
    // and has a transparent background to blend with the host site.
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.right = '0';
    iframe.style.border = 'none';
    iframe.style.zIndex = '2147483647'; // Maximum possible z-index
    iframe.style.background = 'transparent';
    iframe.style.display = 'block';
    // Allow microphone access for WebRTC
    iframe.setAttribute('allow', 'microphone');

    // Start with a small size (just the button) or full size if you want the banner
    // We will make it large enough to fit the banner initially.
    // We can add message passing later to dynamically resize it based on state (banner vs module)
    iframe.style.width = '100vw';
    iframe.style.height = '72px'; // Height of the banner + border + shadow padding
    // Keep pointer events auto so the user can click the button. 
    // Because it only takes up 72px at the bottom, it won't block the rest of the site.
    iframe.style.pointerEvents = 'auto';

    // 5. "Body Push" logic to prevent overlapping host headers
    // We add a margin to the body and a smooth transition.
    document.body.style.transition = 'margin-top 0.3s ease-in-out';
    document.body.style.marginTop = '72px';

    // 6. Append to the document body
    document.body.appendChild(iframe);

    // 7. Set up message listener to handle resizing from the iframe
    window.addEventListener('message', function (event) {
        if (event.origin !== baseUrl) return;

        try {
            if (event.data && event.data.type === 'SWIFT_AGENT_WIDGET_RESIZE') {
                const { width, height, pointerEvents } = event.data;
                if (width) iframe.style.width = width;
                if (height) iframe.style.height = height;
                if (pointerEvents) iframe.style.pointerEvents = pointerEvents;

                // If height is 100vh (fullscreen call), we might want to remove the push 
                // to avoid double scrollbars or weird spacing in modal mode.
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
