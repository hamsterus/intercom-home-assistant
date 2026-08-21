/* Intercom Card v3.0 — isolated controller. V2 remains untouched. */
class IntercomCardV3 extends HTMLElement{
 constructor(){super();this.attachShadow({mode:"open"});this.config={};this._hass=null;this._historyLoaded=false;this._historyLoading=false}
 setConfig(config){this.config=config||{};this._historyLoaded=false;if(this.shadowRoot) this.render()}
 set hass(hass){this._hass=hass;window.hass=hass;this.update()}
 connectedCallback(){this.loadUI();this.init()}
 async loadUI(){if(window.IntercomCardUIV3)return;const s=document.createElement("script");s.src="/local/intercom/intercom-card-ui-v3.js?v=3";s.onload=()=>{this.render();this.update()};s.onerror=e=>console.error("[IntercomCardV3] UI load error",e);document.head.appendChild(s)}
 init(){if(window.IntercomCardUIV3)this.render();this.bindEvents();this.update();console.log("[IntercomCardV3] ready")}
 bindEvents(){const I=IntercomServiceV3;["ringing","call-started","answered","connected","call-ended","camera-change","sip-ready","sip-error"].forEach(e=>I.on(e,()=>this.update()));I.on("history-updated",()=>{this.update();this.refreshHistory()})}
 update(){if(!this.shadowRoot||!window.IntercomCardUIV3)return;IntercomCardUIV3.updateSip(this);IntercomCardUIV3.updateState(this);IntercomCardUIV3.renderButtons(this);const I=IntercomServiceV3;if(!I.ringing&&!I.connected&&!this._historyLoaded)this.refreshHistory()}
 refreshHistory(){if(!this.shadowRoot||!window.IntercomCardUIV3||this._historyLoading)return;this._historyLoading=true;IntercomCardUIV3.updateHistory(this).finally(()=>this._historyLoading=false)}
 render(){if(window.IntercomCardUIV3)IntercomCardUIV3.render(this)}
 getCardSize(){return 3}
}
customElements.define("intercom-card-v3",IntercomCardV3);
