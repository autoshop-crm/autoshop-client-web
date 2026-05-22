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

По текущему customer auth контракту frontend должен использовать canonical customer auth routes:

- `POST /api/customer-auth/register`
- `POST /api/customer-auth/login`
- `POST /api/customer-auth/refresh`
- `GET /api/customer-auth/me`
- `POST /api/customer-auth/logout`

Self-service регистрация, recovery, customer profile, vehicles, loyalty, files и booking как public customer API на backend пока не подтверждены полностью и требуют отдельных customer-safe endpoint'ов или BFF.
