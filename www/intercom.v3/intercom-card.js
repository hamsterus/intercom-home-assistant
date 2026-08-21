/* Intercom Card v3.2 — isolated controller with deterministic dependency loading. */
class IntercomCardV3 extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.config = {};
    this._hass = null;
    this._historyLoaded = false;
    this._historyLoading = false;
    this._eventsBound = false;
    this._ready = false;
  }

  setConfig(config) {
    this.config = config || {};
    this._historyLoaded = false;
    if (this._ready) this.render();
  }

  set hass(hass) {
    this._hass = hass;
    window.hass = hass;
    this.update();
  }

  async connectedCallback() {
    try {
      await this.loadService();
      await this.loadUI();
      this.init();
    } catch (error) {
      console.error("[IntercomCardV3] initialization error", error);
      this.showError(error);
    }
  }

  loadScript(src, globalName) {
    return new Promise((resolve, reject) => {
      if (globalName && window[globalName]) {
        resolve();
        return;
      }

      const base = src.split("?")[0];
      const existing = [...document.scripts].find((script) =>
        script.src.includes(base)
      );

      if (existing) {
        if (globalName && window[globalName]) {
          resolve();
          return;
        }
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.async = false;
      script.onload = () => {
        if (globalName && !window[globalName]) {
          reject(new Error(`${globalName} was not created by ${src}`));
          return;
        }
        resolve();
      };
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(script);
    });
  }

  async loadService() {
    if (window.IntercomServiceV3) return;
    await this.loadScript(
      "/local/intercom.v3/intercom-service.js?v=6",
      "IntercomServiceV3"
    );
  }

  async loadUI() {
    if (window.IntercomCardUIV3) return;
    await this.loadScript(
      "/local/intercom.v3/intercom-card-ui.js?v=6",
      "IntercomCardUIV3"
    );
  }

  init() {
    if (this._ready) return;
    this._ready = true;
    this.render();
    this.bindEvents();
    this.update();
    console.log("[IntercomCardV3] ready");
  }

  bindEvents() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    const service = window.IntercomServiceV3;
    [
      "ringing",
      "call-started",
      "answered",
      "connected",
      "call-ended",
      "camera-change",
      "sip-ready",
      "sip-error",
    ].forEach((event) => service.on(event, () => this.update()));
    service.on("history-updated", () => {
      this.update();
      this.refreshHistory();
    });
  }

  update() {
    if (!this.shadowRoot || !window.IntercomCardUIV3 || !window.IntercomServiceV3) {
      return;
    }

    IntercomCardUIV3.updateSip(this);
    IntercomCardUIV3.updateState(this);
    IntercomCardUIV3.renderButtons(this);

    const service = window.IntercomServiceV3;
    if (!service.ringing && !service.connected && !this._historyLoaded) {
      this.refreshHistory();
    }
  }

  refreshHistory() {
    if (
      !this.shadowRoot ||
      !window.IntercomCardUIV3 ||
      this._historyLoading
    ) {
      return;
    }
    this._historyLoading = true;
    IntercomCardUIV3.updateHistory(this).finally(() => {
      this._historyLoading = false;
    });
  }

  render() {
    if (window.IntercomCardUIV3) {
      IntercomCardUIV3.render(this);
    }
  }

  showError(error) {
    if (!this.shadowRoot) return;
    const message = String(error?.message || error || "Unknown error");
    const wrapper = document.createElement("ha-card");
    const content = document.createElement("div");
    content.style.cssText = "padding:16px;color:var(--error-color,#db4437)";
    content.innerHTML = `Ошибка конфигурации<br><small>${message}</small>`;
    wrapper.appendChild(content);
    this.shadowRoot.replaceChildren(wrapper);
  }

  getCardSize() {
    return 3;
  }

  getGridOptions() {
    return {
      rows: 10,
      columns: 6,
      min_rows: 2,
      min_columns: 3,
    };
  }
}

if (!customElements.get("intercom-card-v3")) {
  customElements.define("intercom-card-v3", IntercomCardV3);
}
