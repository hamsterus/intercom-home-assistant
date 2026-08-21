# Home Assistant — Intercom + Kiosk Dashboard

Полный проект текущего dashboard Home Assistant: BAS-IP домофон по SIP, камера go2rtc/WebRTC, история звонков и snapshots, RGB-индикация, Dreame L20 Ultra Complete, карточка тёплого пола, мастер-выключатель, часы, погода и календарь.

## Структура проекта

Проект разделён по версиям. Текущая разработка — **V3** и находится в отдельных папках, поэтому существующая конфигурация Home Assistant не затрагивается.

```text
www/
├── intercom.v3/
│   ├── intercom-card.js
│   ├── intercom-card-ui.js
│   ├── intercom-card-ui.css
│   ├── intercom-card-sip.js
│   ├── intercom-service.js
│   ├── intercom-calls.js
│   ├── intercom-rgb.js
│   └── sip.js
│
└── dreame.v3/
    ├── dreame-card.js
    └── dreame-button-card.js
```

Внутри V3 имена файлов не содержат `v3` или `v1`: версия определяется папкой (`intercom.v3`, `dreame.v3`). Это позволяет в дальнейшем делать V4 рядом с V3 без конфликтов и без изменения существующей версии.

## Dashboard

`config/lovelace-dashboard-example.yaml` содержит текущую раскладку целиком:

- BAS-IP домофон;
- камера go2rtc/WebRTC;
- часы;
- погода;
- календарь;
- компактная карточка Dreame;
- карточка тёплого пола;
- мастер-выключатель;
- отдельная страница Dreame с картой.

## Intercom V3

V3 состоит из независимых модулей:

- `www/intercom.v3/intercom-card.js` — controller custom card;
- `www/intercom.v3/intercom-card-ui.js` — UI, история и photo viewer;
- `www/intercom.v3/intercom-card-ui.css` — стили Shadow DOM;
- `www/intercom.v3/intercom-card-sip.js` — SIP.js, регистрация 9100, входящие вызовы, answer/hangup, DTMF, audio и ringtone;
- `www/intercom.v3/intercom-service.js` — global state manager;
- `www/intercom.v3/intercom-calls.js` — история звонков и snapshots;
- `www/intercom.v3/intercom-rgb.js` — RGB-индикация планшета;
- `www/intercom.v3/sip.js` — SIP.js 0.21.2.

SIP endpoint 9100 регистрируется в Asterisk/PJSIP по WSS. Входящие вызовы от 9101 (`Этаж`) и 9102 (`Подъезд`) обрабатываются SIP-модулем. Для 9102 используется DTMF `55` для открытия двери.

UI использует Shadow DOM и отдельную загрузку CSS с восстановлением stylesheet после пробуждения планшета.

### SIP status sensors

В Home Assistant используются REST sensors для проверки состояния PJSIP endpoints 9100, 9101 и 9102 через Asterisk ARI. Конфигурация находится в:

`config/packages/intercom_status.yaml`

## Dreame V3

Карточки Dreame находятся в:

`www/dreame.v3/`

Используются:

- `vacuum.dreamebot_l20_ultra_complete`;
- `camera.dreamebot_l20_ultra_complete_map`.

Файлы карточек:

- `www/dreame.v3/dreame-card.js` — полноэкранная карта и управление Dreame;
- `www/dreame.v3/dreame-button-card.js` — компактная карточка для основного dashboard.

Полная карточка поддерживает карту, rotation/zoom, комнаты, уборку, pause, stop и возврат на базу. Компактная карточка используется на основном dashboard и ведёт на отдельную страницу Dreame.

## Thermostat

`custom:thermostat-button-card` использует `climate.thermostat`, показывает состояние нагрева и температуру, временно показывает target после нажатия стрелок и меняет target через `climate.set_temperature`.

## Master switch

На dashboard используется штатная Home Assistant button card для `switch.din_master_switch`: обычное нажатие ничего не делает, удержание переключает мастер-выключатель.

## Ringtone

Runtime ожидает файл:

`/local/doorbell.mp3`

Источник использованного звонка:

https://www.soundjay.com/door_c2026/doorbell-1.mp3

Сам MP3 не входит в репозиторий.

## Dependencies

- Home Assistant;
- Asterisk/PJSIP с WSS;
- go2rtc;
- `custom:webrtc-camera`;
- flip-clock-card;
- Home Assistant weather integration;
- Dreame Vacuum integration (`dreame-vacuum`);
- Companion App entities для управления экраном/RGB, если используются.

Dreame Vacuum integration не входит в репозиторий — здесь находятся dashboard и custom-card файлы.

## Security

Реальные SIP-пароли, HA tokens, история звонков, snapshots и другие runtime/private данные не должны попадать в Git. Credentials должны храниться в локальной конфигурации Home Assistant / secrets.

## Development principle

V3 разрабатывается **рядом с существующей рабочей конфигурацией**, а не поверх неё. Пока V3 не проверена в Home Assistant, старые рабочие файлы не заменяются. Это позволяет безопасно тестировать новые изменения на планшете и откатываться без повреждения текущего dashboard.