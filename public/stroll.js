/**
 * SwiftAgent Stroll Engine — Automatic Mode
 *
 * Runs in the PARENT page (the customer's dashboard).
 * Loaded by widget.js on every page load.
 *
 * On each page load it:
 * 1. Waits for the page to settle (DOM stable)
 * 2. Maps every interactive element with bounding boxes
 * 3. Captures a screenshot via html2canvas
 * 4. Saves the node to sessionStorage
 * 5. Collects all internal nav links not yet visited
 * 6. Navigates to the next unvisited link
 * 7. When the queue is empty, uploads the full report to the backend
 *
 * The entire crawl is automatic — zero user interaction required.
 * State persists across page loads via sessionStorage.
 */
(function () {
  if (window.__SWIFT_AGENT_STROLL_ENGINE__) return;
  window.__SWIFT_AGENT_STROLL_ENGINE__ = true;

  // ── Config ───────────────────────────────────────────────────────────────────
  var STORAGE_KEY = '__swift_stroll_state__';
  var MAX_PAGES = 50;          // Safety cap — don't crawl more than this
  var SETTLE_DELAY = 2000;     // Wait for SPA rendering before capture
  var NAV_DELAY = 800;         // Delay before navigating to next page
  var html2canvasLoaded = false;

  // ── Storage helpers (persist across page loads) ────────────────────────────
  function getState() {
    try {
      var raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function setState(state) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('[SwiftAgent Stroll] Failed to save state:', e);
    }
  }

  function clearState() {
    sessionStorage.removeItem(STORAGE_KEY);
  }

  // ── Initialize or resume a crawl ──────────────────────────────────────────
  function initState(companyId, widgetOrigin) {
    return {
      companyId: companyId,
      widgetOrigin: widgetOrigin,
      active: true,
      visited: [],       // URLs already captured
      queue: [],         // URLs to visit next
      nodes: [],         // Captured page data
      startedAt: new Date().toISOString()
    };
  }

  // ── Load html2canvas from CDN ────────────────────────────────────────────────
  function loadHtml2Canvas(cb) {
    if (html2canvasLoaded && window.html2canvas) { cb(); return; }
    var script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    script.onload = function () { html2canvasLoaded = true; cb(); };
    script.onerror = function () {
      console.error('[SwiftAgent Stroll] Failed to load html2canvas');
      cb();
    };
    document.head.appendChild(script);
  }

  // ── Unique CSS selector generator ────────────────────────────────────────────
  function generateSelector(el) {
    if (el.id) return '#' + el.id;
    var parts = [];
    while (el && el !== document.body && el !== document.documentElement) {
      var tag = el.tagName.toLowerCase();
      var parent = el.parentElement;
      if (parent) {
        var siblings = Array.from(parent.children).filter(function (c) {
          return c.tagName === el.tagName;
        });
        if (siblings.length > 1) {
          var idx = siblings.indexOf(el) + 1;
          tag += ':nth-of-type(' + idx + ')';
        }
      }
      parts.unshift(tag);
      el = parent;
    }
    return parts.join(' > ');
  }

  // ── Normalize URL for comparison (strip hash, trailing slash) ──────────────
  function normalizeUrl(url) {
    try {
      var u = new URL(url, window.location.origin);
      // Only crawl same-origin pages
      if (u.origin !== window.location.origin) return null;
      // Strip hash and trailing slash
      return (u.origin + u.pathname).replace(/\/$/, '') + u.search;
    } catch (e) { return null; }
  }

  // ── Map all interactive elements on screen ───────────────────────────────────
  function mapElements() {
    var selectors = 'a, button, input, select, textarea, [role="button"], [role="tab"], [role="link"], [role="menuitem"], [onclick]';
    var allEls = document.querySelectorAll(selectors);
    var elements = [];

    allEls.forEach(function (el) {
      if (el.closest('.swift-agent-widget-iframe')) return;

      var rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      var style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return;

      var label = '';
      if (el.innerText) label = el.innerText.trim().substring(0, 100);
      else if (el.getAttribute('aria-label')) label = el.getAttribute('aria-label');
      else if (el.getAttribute('title')) label = el.getAttribute('title');
      else if (el.getAttribute('placeholder')) label = el.getAttribute('placeholder');
      else if (el.getAttribute('alt')) label = el.getAttribute('alt');

      var type = 'action';
      if (el.tagName === 'A' || el.getAttribute('role') === 'link') type = 'nav';

      elements.push({
        selector: generateSelector(el),
        label: label || '',
        type: type,
        href: el.getAttribute('href') || '',
        bbox: {
          x: Math.round(rect.x),
          y: Math.round(rect.y),
          w: Math.round(rect.width),
          h: Math.round(rect.height)
        }
      });
    });

    return elements;
  }

  // ── Discover all internal navigation links on the page ─────────────────────
  function discoverLinks(visited, widgetOrigin) {
    var links = [];
    var seen = {};
    var allAnchors = document.querySelectorAll('a[href]');

    allAnchors.forEach(function (a) {
      if (a.closest('.swift-agent-widget-iframe')) return;

      var href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

      var normalized = normalizeUrl(href);
      if (!normalized) return; // external link
      if (seen[normalized]) return;
      if (visited.indexOf(normalized) !== -1) return;

      // Skip links that point back to the widget's own origin (our Next.js app)
      if (widgetOrigin && normalized.startsWith(widgetOrigin)) return;

      seen[normalized] = true;
      links.push(normalized);
    });

    return links;
  }

  // ── Capture the current page ─────────────────────────────────────────────────
  function captureCurrentPage(state, callback) {
    var elements = mapElements();

    // Hide widget iframe for screenshot
    var widgetIframe = document.querySelector('.swift-agent-widget-iframe');
    var prevDisplay = '';
    if (widgetIframe) {
      prevDisplay = widgetIframe.style.display;
      widgetIframe.style.display = 'none';
    }

    function saveNode(base64) {
      if (widgetIframe) widgetIframe.style.display = prevDisplay;

      var node = {
        url: window.location.href,
        title: document.title,
        screenshot_base64: base64 || '',
        elements: elements
      };

      state.nodes.push(node);
      state.visited.push(normalizeUrl(window.location.href));

      // Discover new links and add unvisited ones to the queue
      var newLinks = discoverLinks(state.visited.concat(state.queue), state.widgetOrigin);
      state.queue = state.queue.concat(newLinks);

      // Cap total pages
      if (state.queue.length + state.nodes.length > MAX_PAGES) {
        state.queue = state.queue.slice(0, MAX_PAGES - state.nodes.length);
      }

      setState(state);
      notifyWidget({
        type: 'STROLL_PROGRESS',
        captured: state.nodes.length,
        remaining: state.queue.length,
        pageTitle: document.title
      });

      console.log('[SwiftAgent Stroll] Captured: ' + document.title + ' (' + state.nodes.length + ' done, ' + state.queue.length + ' queued)');
      callback(state);
    }

    if (window.html2canvas) {
      window.html2canvas(document.body, {
        useCORS: true,
        allowTaint: true,
        scale: 1,
        logging: false,
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: window.innerHeight,
        onclone: function (clonedDoc) {
          // Strip unsupported CSS color functions (lab, lch, oklch, oklab)
          // that html2canvas 1.4.1 cannot parse
          var unsupportedColorRe = /\b(lab|lch|oklch|oklab)\s*\([^)]*\)/gi;
          // Patch stylesheets
          var sheets = clonedDoc.styleSheets;
          for (var s = 0; s < sheets.length; s++) {
            try {
              var rules = sheets[s].cssRules;
              if (!rules) continue;
              for (var r = rules.length - 1; r >= 0; r--) {
                if (rules[r].cssText && unsupportedColorRe.test(rules[r].cssText)) {
                  sheets[s].deleteRule(r);
                }
              }
            } catch (e) { /* cross-origin stylesheet, skip */ }
          }
          // Patch inline styles
          var allEls = clonedDoc.querySelectorAll('*');
          for (var i = 0; i < allEls.length; i++) {
            var style = allEls[i].style;
            if (style.color && unsupportedColorRe.test(style.color)) style.color = '';
            if (style.backgroundColor && unsupportedColorRe.test(style.backgroundColor)) style.backgroundColor = '';
            if (style.borderColor && unsupportedColorRe.test(style.borderColor)) style.borderColor = '';
          }
        }
      }).then(function (canvas) {
        saveNode(canvas.toDataURL('image/png'));
      }).catch(function (err) {
        console.error('[SwiftAgent Stroll] Screenshot failed:', err);
        saveNode('');
      });
    } else {
      saveNode('');
    }
  }

  // ── Navigate to the next page in the queue ─────────────────────────────────
  function navigateNext(state) {
    if (state.queue.length === 0) {
      // All done — upload the report
      console.log('[SwiftAgent Stroll] Crawl complete. ' + state.nodes.length + ' pages captured. Uploading...');
      uploadReport(state);
      return;
    }

    var nextUrl = state.queue.shift();
    setState(state);

    setTimeout(function () {
      window.location.href = nextUrl;
    }, NAV_DELAY);
  }

  // ── Upload the stroll report ─────────────────────────────────────────────────
  function uploadReport(state) {
    if (state.nodes.length === 0) {
      console.log('[SwiftAgent Stroll] Nothing to upload.');
      clearState();
      return;
    }

    var payload = {
      company_id: state.companyId,
      dashboard_url: window.location.origin,
      nodes: state.nodes
    };

    // POST to the Next.js proxy route (same origin as widget) to avoid CORS
    var proxyUrl = state.widgetOrigin + '/api/stroll';

    notifyWidget({ type: 'STROLL_UPLOADING', count: state.nodes.length });
    console.log('[SwiftAgent Stroll] Uploading ' + state.nodes.length + ' pages via ' + proxyUrl);

    fetch(proxyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (res) {
      if (res.ok || res.status === 202) {
        console.log('[SwiftAgent Stroll] Upload success!');
        notifyWidget({ type: 'STROLL_COMPLETE', count: state.nodes.length });
        // Mark as done so we don't re-crawl this session
        if (state._doneKey) sessionStorage.setItem(state._doneKey, 'true');
        clearState();
      } else {
        res.text().then(function (t) { console.error('[SwiftAgent Stroll] Upload failed:', res.status, t); });
        notifyWidget({ type: 'STROLL_ERROR', message: 'Upload failed (' + res.status + ')' });
        // Keep state so it can retry on next page load
        state.active = false;
        setState(state);
      }
    }).catch(function (err) {
      console.error('[SwiftAgent Stroll] Upload error:', err);
      notifyWidget({ type: 'STROLL_ERROR', message: err.message || 'Network error' });
      state.active = false;
      setState(state);
    });
  }

  // ── Communicate with the widget iframe ───────────────────────────────────────
  function notifyWidget(data) {
    var iframe = document.querySelector('.swift-agent-widget-iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(data, '*');
    }
  }

  // ── Main: run on every page load ─────────────────────────────────────────────
  function main() {
    var state = getState();

    if (!state || !state.active) {
      // No active crawl — nothing to do, wait for START command
      return;
    }

    // Check if we already captured this page
    var currentNormalized = normalizeUrl(window.location.href);
    if (state.visited.indexOf(currentNormalized) !== -1) {
      // Already captured — skip to next
      console.log('[SwiftAgent Stroll] Already visited ' + currentNormalized + ', skipping.');
      navigateNext(state);
      return;
    }

    // Wait for page to settle (SPA rendering, lazy loads, etc.)
    setTimeout(function () {
      loadHtml2Canvas(function () {
        captureCurrentPage(state, function (updatedState) {
          navigateNext(updatedState);
        });
      });
    }, SETTLE_DELAY);
  }

  // ── Listen for AUTO_START from widget.js ────────────────────────────────
  window.addEventListener('message', function (event) {
    var data = event.data;
    if (!data || !data.type) return;

    if (data.type === 'STROLL_AUTO_START') {
      var existingState = getState();

      // Already completed a crawl for this site — don't re-crawl
      var doneKey = '__swift_stroll_done_' + data.companyId + '__';
      if (sessionStorage.getItem(doneKey)) {
        console.log('[SwiftAgent Stroll] Already mapped this session, skipping.');
        return;
      }

      // Already have an active crawl — let main() handle resuming
      if (existingState && existingState.active) return;

      console.log('[SwiftAgent Stroll] Auto-starting silent crawl...');
      var state = initState(data.companyId, data.widgetOrigin);
      state._doneKey = doneKey;
      setState(state);

      setTimeout(function () {
        loadHtml2Canvas(function () {
          captureCurrentPage(state, function (updatedState) {
            navigateNext(updatedState);
          });
        });
      }, SETTLE_DELAY);
    }
  });

  // ── Auto-resume: if there's an active crawl, continue it ─────────────────
  // Wait for page to be fully loaded before resuming
  if (document.readyState === 'complete') {
    main();
  } else {
    window.addEventListener('load', main);
  }

  notifyWidget({ type: 'STROLL_ENGINE_READY' });
})();
