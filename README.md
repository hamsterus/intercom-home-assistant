# Intercom Home Assistant v2

SIP-based BAS-IP intercom integration for Home Assistant.

## Components

- `intercom-card-v2.js` — card controller
- `intercom-card-ui-v2.js` — Shadow DOM UI
- `intercom-card-ui-v2.css` — card styles
- `intercom-service-v2.js` — global state manager
- `intercom-card-sip-v2.js` — SIP.js integration
- `intercom-calls-v2.js` — call history and snapshots
- `intercom-rgb-v2.js` — tablet RGB status
- `sip.js` — SIP.js 0.21.2

## Runtime requirements

- Home Assistant
- Asterisk/PJSIP with WSS
- go2rtc
- `custom:webrtc-camera`
- `input_boolean.intercom_camera`
- Companion App HTTP API for tablet wake/sound, if used

## Security

Secrets and passwords are intentionally omitted from the repository. Put credentials into your local Home Assistant configuration or secrets management.

Call history and snapshots are runtime data and should not be committed.

## Ringtone

The runtime configuration can use a local `doorbell.mp3`. The original source used during development was SoundJay:

https://www.soundjay.com/door_c2026/doorbell-1.mp3
