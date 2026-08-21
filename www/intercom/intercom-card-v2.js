/*
    Intercom Card v2.7

    Controller only
*/

class IntercomCardV2 extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.config = {};
        this._hass = null;
        this._historyLoaded = false;
        this._historyLoading = false;
    }

    setConfig(config) {
        this.config = config || {};
        this._historyLoaded = false;
        if (this.shadowRoot) this.render();
    }

    set hass(hass) {
        this._hass = hass;
        window.hass = hass;
        this.update();
    }

    connectedCallback() {
        this.loadUI();
        this.init();
    }

    async loadUI() {
        if (window.IntercomCardUIV2) return;
        const script = document.createElement("script");
        script.src = "/local/intercom/intercom-card-ui-v2.js?v=3";
        script.onload = () => {
            console.log("[IntercomCardV2] UI loaded");
            this.render();
            this.update();
        };
        script.onerror = () => console.error("[IntercomCardV2] UI load error");
        document.head.appendChild(script);
    }

    init() {
        if (window.IntercomCardUIV2) this.render();
        this.bindEvents();
        this.update();
        console.log("[IntercomCardV2] ready");
    }

    bindEvents() {
        const I = IntercomServiceV2;
        ["ringing", "call-started", "answered", "connected", "call-ended", "camera-change", "sip-ready", "sip-error"].forEach(event => {
            I.on(event, () => this.update());
        });
        I.on("history-updated", () => {
            this.update();
            this.refreshHistory();
        });
    }

    update() {
        if (!this.shadowRoot || !window.IntercomCardUIV2) return;
        IntercomCardUIV2.updateSip(this);
        IntercomCardUIV2.updateState(this);
        IntercomCardUIV2.renderButtons(this);
        const I = IntercomServiceV2;
        if (!I.ringing && !I.connected && !this._historyLoaded) this.refreshHistory();
    }

    refreshHistory() {
        if (!this.shadowRoot || !window.IntercomCardUIV2 || this._historyLoading) return;
        this._historyLoading = true;
        IntercomCardUIV2.updateHistory(this).finally(() => {
            this._historyLoading = false;
        });
    }

    render() {
        if (!window.IntercomCardUIV2) return;
        IntercomCardUIV2.render(this);
    }

    getCardSize() { return 3; }
}

customElements.define("intercom-card-v2", IntercomCardV2);
