/* Intercom RGB v3.0 — V3 branch-compatible copy of stable V2 RGB logic. */
(function(){
 if(window.IntercomRGBV3)return;
 window.IntercomRGBV3={error:false,missed:false,ignoreMissed:false,call:false,
  set(color){if(!window.hass)return;let rgb;switch(color){case"red":rgb=[255,0,0];break;case"green":rgb=[0,255,0];break;case"yellow":rgb=[255,180,0];break;default:window.hass.callService("light","turn_off",{entity_id:"light.panel_panel_rgb"});return}window.hass.callService("light","turn_on",{entity_id:"light.panel_panel_rgb",brightness_pct:100,rgb_color:rgb})},
  update(){if(this.error)this.set("red");else if(this.call)this.set("green");else if(this.missed)this.set("yellow");else this.set("off")},
  setError(v=true){this.error=v;this.update()},callStarted(){this.call=true;this.update()},callActive(){this.call=true;this.update()},callEnded(){this.call=false;this.update()},missedCall(){this.missed=true;this.update()},clearMissed(){this.missed=false;this.ignoreMissed=true;this.update()},
  refresh(){fetch("/local/intercom/call_history.json?"+Date.now()).then(r=>{if(!r.ok)throw Error("history missing");return r.json()}).then(data=>{if(!Array.isArray(data)||!data.length)this.missed=false;else if(!this.ignoreMissed)this.missed=data.some(x=>x.status==="missed");this.ignoreMissed=false;this.update()}).catch(e=>console.warn("[IntercomRGBV3] refresh error",e))}
 };
 setTimeout(()=>window.IntercomRGBV3.refresh(),1000);
})();
