/**
 * SwiftAgent Widget — Universal JavaScript Loader
 *
 * Works with any framework or vanilla JS. No dependencies.
 *
 * Usage:
 *   <script src="swift-agent-loader.js"></script>
 *   <script>
 *     SwiftAgentLoader.load("your-company-id");
 *   </script>
 *
 * Or as ES module:
 *   import { loadSwiftAgent } from "./swift-agent-loader.js";
 *   loadSwiftAgent("your-company-id");
 */

(function (root) {
  "use strict";

  var WIDGET_SCRIPT_URL = "https://app.swiftagents.org/widget-ui.js";

  /**
   * Load and mount the SwiftAgent widget.
   *
   * @param {string} companyId — Your company ID from the SwiftAgent dashboard
   * @param {object} [options]
   * @param {string} [options.scriptUrl] — Override the widget script URL
   */
  function load(companyId, options) {
    if (!companyId) {
      console.error("[SwiftAgent] companyId is required");
      return;
    }

    var scriptUrl = (options && options.scriptUrl) || WIDGET_SCRIPT_URL;

    // Already loaded?
    if (root.SwiftAgentWidget && root.SwiftAgentWidget.isLoaded) {
      return;
    }

    // Already loading?
    if (document.querySelector('script[src="' + scriptUrl + '"]')) {
      // Wait for it to finish
      var check = setInterval(function () {
        if (root.SwiftAgentWidget) {
          clearInterval(check);
          try {
            root.SwiftAgentWidget.mount(companyId, new URL(scriptUrl).origin);
          } catch (e) {
            root.SwiftAgentWidget.mount(companyId);
          }
        }
      }, 100);
      return;
    }

    var script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;

    script.onload = function () {
      try {
        var baseUrl = new URL(scriptUrl).origin;
        root.SwiftAgentWidget.mount(companyId, baseUrl);
      } catch (e) {
        root.SwiftAgentWidget.mount(companyId);
      }
    };

    script.onerror = function () {
      console.error("[SwiftAgent] Failed to load widget from:", scriptUrl);
    };

    document.head.appendChild(script);
  }

  /**
   * Unmount and remove the widget.
   */
  function unload() {
    if (root.SwiftAgentWidget) {
      root.SwiftAgentWidget.unmount();
    }
  }

  // Expose as global + ES module
  var api = { load: load, unload: unload };
  root.SwiftAgentLoader = api;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : this);
