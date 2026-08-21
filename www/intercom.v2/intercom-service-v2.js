/* Intercom Service v2.6 */
(function(){
 if(window.IntercomServiceV2)return;
 window.IntercomServiceV2={version:"2.6",started:false,sipInitialized:false,userAgent:null,registerer:null,currentSession:null,currentCaller:null,callStarted:null,callAnswered:false,ringing:false,connected:false,canOpenDoor:false,callDevice:null,callType:null,cameraActive:false,videoStream:null,videoUrl:null,audioActive:false,currentPhotoFile:null,activeCard:null,uiState:"idle",listeners:{},
  on(e,cb){if(!this.listeners[e])this.listeners[e]=[];this.listeners[e].push(cb)},off(e,cb){if(!this.listeners[e])return;this.listeners[e]=this.listeners[e].filter(x=>x!==cb)},emit(e,data={}){(this.listeners[e]||[]).forEach(cb=>{try{cb(data)}catch(x){console.error("[IntercomServiceV2] event error",e,x)}})},
  async loadRGBModule(){if(window.IntercomRGBV2)return;await this.loadScript("/local/intercom.v2/intercom-rgb-v2.js")},
  async loadCallsModule(){if(window.IntercomCallsV2)return;await this.loadScript("/local/intercom.v2/intercom-calls-v2.js")},
  async loadSIPModule(){if(window.IntercomSIPV2){this.initSIP();return}await this.loadScript("/local/intercom.v2/intercom-card-sip-v2.js");this.initSIP()},
  loadScript(src){return new Promise((resolve,reject)=>{const s=document.createElement("script");s.src=src;s.onload=resolve;s.onerror=reject;document.head.appendChild(s)})},
  async initSIP(){if(this.sipInitialized||!window.IntercomSIPV2)return;const audio=document.createElement("audio");audio.autoplay=true;audio.playsInline=true;audio.style.display="none";document.body.appendChild(audio);await IntercomSIPV2.start(audio)},
  markSipInitialized(){this.sipInitialized=true},resetSip(){this.started=false;this.sipInitialized=false;this.userAgent=null;this.registerer=null},
  toggleCamera(){this.cameraActive?this.hideCamera():this.showCamera()},showCamera(){this.cameraActive=true;if(window.hass)window.hass.callService("input_boolean","turn_on",{entity_id:"input_boolean.intercom_camera"});this.emit("camera-change",{active:true})},hideCamera(){this.cameraActive=false;if(window.hass)window.hass.callService("input_boolean","turn_off",{entity_id:"input_boolean.intercom_camera"});this.emit("camera-change",{active:false})},
  startCall(caller){if(window.hass)window.hass.callService("switch","turn_on",{entity_id:"switch.rk3576_u_screen"});this.currentCaller=caller;this.callStarted=new Date();this.callDevice=caller;this.callType=caller==="9101"?"floor":"entrance";this.ringing=true;this.connected=false;this.uiState="ringing";if(window.IntercomRGBV2)IntercomRGBV2.callStarted();this.emit("ringing",{caller});this.emit("call-started",{caller})},
  connectCall(){this.ringing=false;this.connected=true;this.audioActive=true;this.uiState="connected";if(window.IntercomRGBV2)IntercomRGBV2.callActive();this.emit("connected")},answerCall(){this.callAnswered=true;this.ringing=false;this.uiState="talking";this.emit("answered")},
  log:[],addLog(message){const now=new Date();this.log.push(now.toLocaleDateString("ru-RU")+" "+now.toLocaleTimeString("ru-RU")+" "+message);while(this.log.length>200)this.log.shift();console.log("[IntercomV2]",message)},
  clearCall(){this.currentSession=null;this.currentCaller=null;this.callStarted=null;this.callAnswered=false;this.canOpenDoor=false;this.callDevice=null;this.callType=null;this.audioActive=false;this.videoStream=null;this.videoUrl=null;this.currentPhotoFile=null;this.ringing=false;this.connected=false;this.uiState="idle";if(window.IntercomRGBV2)IntercomRGBV2.callEnded();this.emit("call-ended")}
 };
 setTimeout(async()=>{try{await IntercomServiceV2.loadRGBModule();await IntercomServiceV2.loadCallsModule();await IntercomServiceV2.loadSIPModule()}catch(e){console.error("[IntercomServiceV2] module load error",e)}},0);
})();
