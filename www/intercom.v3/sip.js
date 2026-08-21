/* SIP.js V3 loader
 * Source: official SIP.js 0.21.2 GitHub release.
 * The library itself is intentionally loaded from the upstream GitHub release
 * so we do not duplicate or modify the third-party bundle in this repository.
 */
(function(){
  if(window.SIP){
    window.dispatchEvent(new Event("intercom-sipjs-loaded"));
    return;
  }
  if(window.__intercomSipJsLoading)return;
  window.__intercomSipJsLoading=true;
  const script=document.createElement("script");
  script.src="https://github.com/onsip/SIP.js/releases/download/0.21.2/sip-0.21.2.min.js";
  script.async=false;
  script.onload=()=>{
    if(window.SIP)window.dispatchEvent(new Event("intercom-sipjs-loaded"));
    else window.dispatchEvent(new Event("intercom-sipjs-error"));
  };
  script.onerror=()=>window.dispatchEvent(new Event("intercom-sipjs-error"));
  document.head.appendChild(script);
})();
