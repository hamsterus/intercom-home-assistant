/* Intercom Card v3.1 — isolated controller. */
class IntercomCardV3 extends HTMLElement{
 constructor(){super();this.attachShadow({mode:"open"});this.config={};this._hass=null;this._historyLoaded=false;this._historyLoading=false;this._eventsBound=false;this._ready=false}
 setConfig(config){this.config=config||{};this._historyLoaded=false;if(this.shadowRoot)this.render()}
 set hass(hass){this._hass=hass;window.hass=hass;this.update()}
 async connectedCallback(){try{await this.loadService();await this.loadUI();this.init()}catch(e){console.error("[IntercomCardV3] initialization error",e);this.showError(e)}}
 loadScript(src){return new Promise((resolve,reject)=>{const existing=[...document.scripts].find(s=>s.src.includes(src.split("?")[0]));if(existing){if(existing.dataset.intercomLoaded==="1")return resolve();existing.addEventListener("load",()=>resolve(),{once:true});existing.addEventListener("error",reject,{once:true});return}const s=document.createElement("script");s.src=src;s.onload=()=>{s.dataset.intercomLoaded="1";resolve()};s.onerror=reject;document.head.appendChild(s)})}
 async loadService(){if(window.IntercomServiceV3)return;await this.loadScript("/local/intercom.v3/intercom-service.js?v=3");if(!window.IntercomServiceV3)throw new Error("IntercomServiceV3 was not loaded")}
 async loadUI(){if(window.IntercomCardUIV3)return;await this.loadScript("/local/intercom.v3/intercom-card-ui.js?v=3");if(!window.IntercomCardUIV3)throw new Error("IntercomCardUIV3 was not loaded")}
 init(){if(this._ready)return;this._ready=true;this.render();this.bindEvents();this.update();console.log("[IntercomCardV3] ready")}
 bindEvents(){if(this._eventsBound)return;this._eventsBound=true;const I=window.IntercomServiceV3;["ringing","call-started","answered","connected","call-ended","camera-change","sip-ready","sip-error"].forEach(e=>I.on(e,()=>this.update()));I.on("history-updated",()=>{this.update();this.refreshHistory()})}
 update(){if(!this.shadowRoot||!window.IntercomCardUIV3||!window.IntercomServiceV3)return;IntercomCardUIV3.updateSip(this);IntercomCardUIV3.updateState(this);IntercomCardUIV3.renderButtons(this);const I=window.IntercomServiceV3;if(!I.ringing&&!I.connected&&!this._historyLoaded)this.refreshHistory()}
 refreshHistory(){if(!this.shadowRoot||!window.IntercomCardUIV3||this._historyLoading)return;this._historyLoading=true;IntercomCardUIV3.updateHistory(this).finally(()=>this._historyLoading=false)}
 render(){if(window.IntercomCardUIV3)IntercomCardUIV3.render(this)}
 showError(error){if(!this.shadowRoot)return;this.shadowRoot.innerHTML=`<ha-card><div style="padding:16px;color:var(--error-color,#db4437)">Ошибка конфигурации<br><small>${String(error?.message||error||"Unknown error")}</small></div></ha-card>`}
 getCardSize(){return 3}
}
customElements.define("intercom-card-v3",IntercomCardV3);
