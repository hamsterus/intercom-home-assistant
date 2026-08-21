/* Russian calendar card */
(() => {
  if(customElements.get("ru-calendar-card"))return;
  class RuCalendarCard extends HTMLElement{
    constructor(){super();this.attachShadow({mode:"open"});this._hass=null;this._config={};}
    setConfig(c){this._config={entity:"calendar.kalendar",...c};this._render();}
    set hass(h){this._hass=h;this._render();}
    getCardSize(){return 4;}
    _render(){const events=this._hass?.states?.[this._config.entity]?.attributes?.events||[];const d=new Date();const y=d.getFullYear(),m=d.getMonth(),days=new Date(y,m+1,0).getDate(),first=new Date(y,m,1).getDay();let html='';for(let i=0;i<(first+6)%7;i++)html+='<div></div>';for(let day=1;day<=days;day++){const wd=new Date(y,m,day).getDay();html+=`<div class="day ${wd===0||wd===6?'weekend':''}"><b>${day}</b></div>`;}this.shadowRoot.innerHTML=`<style>:host{display:block}ha-card{padding:12px;border:1px solid var(--divider-color);border-radius:12px}.head{font-size:16px;font-weight:500;margin-bottom:10px;text-align:center}.grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;text-align:center}.dow{font-size:11px;color:var(--secondary-text-color)}.day{height:28px;display:grid;place-items:center;border-radius:7px;font-size:12px}.weekend{color:var(--error-color,#f44336)}.today{background:var(--primary-color);color:var(--text-primary-color,#fff)}</style><ha-card><div class="head">${d.toLocaleDateString('ru-RU',{month:'long',year:'numeric'})}</div><div class="grid"><div class="dow">Пн</div><div class="dow">Вт</div><div class="dow">Ср</div><div class="dow">Чт</div><div class="dow">Пт</div><div class="dow">Сб</div><div class="dow">Вс</div>${html}</div></ha-card>`;const n=d.getDate();this.shadowRoot.querySelectorAll('.day')[n-1]?.classList.add('today');}
  }customElements.define("ru-calendar-card",RuCalendarCard);window.customCards=window.customCards||[];window.customCards.push({type:"ru-calendar-card",name:"Russian Calendar Card"});
})();
