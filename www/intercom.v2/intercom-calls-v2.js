/* Intercom Calls v2.1 */
(function(){
 if(window.IntercomCallsV2)return;
 window.IntercomCallsV2={
  version:"2.1",currentCall:null,
  startCall(device){const now=new Date();const id=now.getFullYear()+String(now.getMonth()+1).padStart(2,"0")+String(now.getDate()).padStart(2,"0")+"-"+String(now.getHours()).padStart(2,"0")+String(now.getMinutes()).padStart(2,"0")+String(now.getSeconds()).padStart(2,"0");const filename=id+"_"+device+".jpg";this.currentCall={id,time:now.toLocaleString("ru-RU"),timestamp:now.toISOString(),device,name:this.getName(device),status:"ringing",photo:filename};this.snapshot(filename);},
  answerCall(){if(this.currentCall)this.currentCall.status="answered";},
  endCall(){if(!this.currentCall)return;if(this.currentCall.status!=="answered")this.currentCall.status="missed";if(this.currentCall.status==="missed"&&window.IntercomRGBV2)IntercomRGBV2.missedCall();this.save();this.currentCall=null;},
  snapshot(filename){if(!window.hass)return;window.hass.callService("script","intercom_make_snapshot",{filename:filename.replace(".jpg","")});},
  save(){if(!this.currentCall||!window.hass)return;window.hass.callService("shell_command","intercom_save_call",{id:this.currentCall.id,time:this.currentCall.time,timestamp:this.currentCall.timestamp,device:this.currentCall.device,name:this.currentCall.name,status:this.currentCall.status,photo:this.currentCall.photo});setTimeout(()=>{if(window.IntercomServiceV2)IntercomServiceV2.emit("history-updated");if(window.IntercomRGBV2)IntercomRGBV2.refresh();},1000);},
  clearHistory(){if(!window.hass)return;window.hass.callService("script","intercom_clear_history");if(window.IntercomRGBV2)IntercomRGBV2.clearMissed();setTimeout(()=>{if(window.IntercomServiceV2)IntercomServiceV2.emit("history-updated");},1500);},
  getName(device){switch(device){case"9101":return"Этаж";case"9102":return"Подъезд";default:return device;}}
 };
 console.log("[IntercomCallsV2] loaded");
})();
