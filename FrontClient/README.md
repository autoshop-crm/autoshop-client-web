# FrontClient

Клиентский кабинет AutoShop.

## Dev backend integration

- UI запускается на `http://localhost:5174`
- Все запросы браузера должны идти только на `http://localhost:5174/api/...`
- Vite proxy перенаправляет `/api/*` в `VITE_GATEWAY_PROXY_TARGET` или по умолчанию в `http://localhost:8088`

## `.env`

Скопируйте `.env.example` в `.env` и при необходимости измените:

- `VITE_ENABLE_AUTH_MOCK=false`
- `VITE_GATEWAY_PROXY_TARGET=http://localhost:8088`

`VITE_GATEWAY_BASE_URL` лучше оставить пустым для dev, чтобы запросы шли через Vite proxy.

## Важно по backend contract

По `CRM_CUSTOMER_API_DOCUMENTATION_RU.md` сейчас реально доступны прежде всего:

- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- часть customer order/approval flows

Self-service регистрация, recovery, customer profile, vehicles, loyalty, files и booking как public customer API на backend пока не подтверждены полностью и требуют отдельных customer-safe endpoint'ов или BFF.
