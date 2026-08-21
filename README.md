# Home Assistant — Intercom + Kiosk Dashboard

Полный проект текущего dashboard Home Assistant: BAS-IP домофон по SIP, камера go2rtc/WebRTC, история звонков и snapshots, RGB-индикация, Dreame L20 Ultra Complete, карточка тёплого пола, мастер-выключатель, часы, погода и календарь.

## Dashboard

`config/lovelace-dashboard-example.yaml` содержит текущую раскладку целиком: домофон, камера, flip clock, погода, календарь, компактный Dreame, термостат, мастер-выключатель и отдельные страницы Dreame.

## Custom cards

- `www/intercom/intercom-card-v2.js`
- `www/intercom/intercom-card-ui-v2.js`
- `www/intercom/intercom-card-ui-v2.css`
- `www/intercom/intercom-service-v2.js`
- `www/intercom/intercom-card-sip-v2.js`
- `www/intercom/intercom-calls-v2.js`
- `www/intercom/intercom-rgb-v2.js`
- `www/dreame/dreame-card-v1.js`
- `www/dreame-button-card.js`
- `www/thermostat-button-card.js`
- `www/ru-calendar-card.js`
- `www/sip.js`

## Intercom

SIP endpoint 9100 registers to Asterisk/PJSIP over WSS. Incoming calls from 9101 (Этаж) and 9102 (Подъезд) are handled by the SIP module. 9102 can send DTMF `55` to open the door. Call history and snapshots are saved through Home Assistant services.

The UI uses Shadow DOM and explicitly restores its stylesheet after tablet wake-up.

## Dreame

Uses `vacuum.dreamebot_l20_ultra_complete` and `camera.dreamebot_l20_ultra_complete_map`. The full card supports map rotation/zoom, room selection, cleaning, pause, stop and return-to-base. The compact card navigates to `/dashboard-intercomv2/view-2?kiosk=1`.

## Thermostat

`custom:thermostat-button-card` uses `climate.thermostat`, shows actual heating state and current temperature, temporarily shows the target after arrow presses, and changes the target with `climate.set_temperature`.

## Master switch

The dashboard uses the native Home Assistant button for `switch.din_master_switch`: tap does nothing; hold toggles the switch.

## Dependencies

- Asterisk/PJSIP with WSS
- go2rtc
- `custom:webrtc-camera`
- flip-clock-card
- Home Assistant weather integration
- Dreame Vacuum integration (`dreame-vacuum`)
- Companion App entities used for tablet wake/RGB, if enabled

The Dreame Vacuum integration itself is not bundled here; this repository contains the dashboard/card layer.

## SIP.js

`www/sip.js` is SIP.js 0.21.2 and is loaded by the application as `/local/sip.js`.

## Security

Real SIP passwords, HA tokens, call history, snapshots and other runtime/private data are intentionally not committed. Put local credentials in Home Assistant secrets/configuration.

## Ringtone

The runtime expects `/local/doorbell.mp3`.

Original development source: https://www.soundjay.com/door_c2026/doorbell-1.mp3

The MP3 itself is not committed yet; the source is documented separately.
