# `autoshop-client-web` — CI and Container Setup Guide

## Goal

Подготовить репозиторий `autoshop-client-web` к production-style доставке через Docker image и GitHub Actions reusable workflow из репозитория организации `autoshop-crm/.github`.

После выполнения всех шагов этот репозиторий должен:

- собираться в production Docker image;
- публиковать image в GHCR;
- не требовать сборки на сервере;
- использовать centralized reusable workflow из `autoshop-crm/.github`.

Итоговый image должен публиковаться как:

- `ghcr.io/autoshop-crm/autoshop-client-web`

---

## Important Repository Context

В этом репозитории приложение лежит не в корне, а в подкаталоге:

- `FrontClient`

Это ключевой момент.

Значит, для CI и Docker build нужно выбрать один из двух путей:

### Option A — keep current structure
Оставить `FrontClient` как есть и строить image из этого подкаталога.

### Option B — flatten repository
Перенести содержимое `FrontClient` в корень репозитория.

### Recommendation

Для первой версии рекомендую **Option A**:

- не ломать существующую структуру;
- просто учесть `FrontClient` как build context.

Это безопаснее и быстрее.

---

## What This Repo Should Do After Setup

После настройки pipeline поведение должно быть таким:

1. Разработчик пушит изменения в `main` или `staging`.
2. GitHub Actions запускает caller workflow.
3. Caller workflow вызывает reusable workflow из `autoshop-crm/.github`.
4. Reusable workflow:
   - checkout-ит код;
   - логинится в GHCR;
   - собирает Docker image из `FrontClient`;
   - пушит image в GHCR.
5. `autoshop-infrastructure` использует образ:
   - `ghcr.io/autoshop-crm/autoshop-client-web`

---

## Files To Add

Поскольку приложение находится в `FrontClient`, рекомендую добавить файлы именно туда:

```text
FrontClient/Dockerfile
FrontClient/.dockerignore
FrontClient/nginx.conf
.github/workflows/deploy.yml
```

---

## 1. Add Caller Workflow

### File

```text
.github/workflows/deploy.yml
```

### Recommended Content

```yaml
name: Build and Push

on:
  push:
    branches:
      - main
      - staging
  workflow_dispatch:

jobs:
  call-shared-workflow:
    uses: autoshop-crm/.github/.github/workflows/shared-build.yml@main
    with:
      image_name: autoshop-crm/autoshop-client-web
      dockerfile: FrontClient/Dockerfile
      context: FrontClient
      push_latest: true
```

### Why Context Must Be `FrontClient`

Потому что именно там находятся:

- `package.json`
- frontend source code
- Vite config
- npm lockfile

Если поставить `context: .`, Docker build может начать тянуть лишнее и усложнится структура `COPY`.

---

## 2. Add Production Dockerfile

### File

```text
FrontClient/Dockerfile
```

### Recommended Content

```dockerfile
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
```

### Why This Dockerfile Works Well

Такой Dockerfile:

- использует `FrontClient` как build context;
- не тянет весь repository root в image;
- отделяет build и runtime;
- делает контейнер production-friendly.

---

## 3. Add SPA Nginx Config

### File

```text
FrontClient/nginx.conf
```

### Recommended Content

```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }
}
```

### Why It Is Needed

Как и для `autoshop-web-spec`, без SPA fallback будут ломаться прямые ссылки на внутренние маршруты клиентского кабинета.

---

## 4. Add `.dockerignore`

### File

```text
FrontClient/.dockerignore
```

### Recommended Content

```text
node_modules
dist
.git
.github
.idea
.vscode
*.log
npm-debug.log*
.DS_Store
```

---

## 5. Validate Package Scripts

### What To Check

В `FrontClient/package.json` должен быть рабочий production build:

```json
{
  "scripts": {
    "build": "tsc -b && vite build"
  }
}
```

Также нужно проверить:

- `npm ci` выполняется без ручных правок;
- `npm run build` создаёт `dist/`;
- build не зависит от dev-only proxy logic в runtime.

---

## 6. Review Runtime Env Strategy

### Important Context

Сейчас repo использует dev proxy и переменные вроде:

- `VITE_GATEWAY_PROXY_TARGET`
- `VITE_GATEWAY_BASE_URL`

Для production container нужно убедиться, что runtime не завязан на Vite dev server.

### Recommended Runtime Model

На production/staging frontend должен работать через same-origin вызовы:

- `/api/auth/...`
- `/api/files/...`
- `/api/...`

А infra nginx должен проксировать их дальше в backend.

### What To Check In Code

Проверь, что production build:

- не требует Vite dev server;
- не зависит от `localhost:5174`;
- не жёстко пришивает dev proxy в production bundle.

---

## 7. Local Validation Before Push

Так как app живёт в `FrontClient`, локальная проверка должна выглядеть так:

```bash
cd FrontClient
npm ci
npm run build
docker build -t autoshop-client-web:test .
docker run --rm -p 8080:80 autoshop-client-web:test
```

### Manual Browser Check

Открыть:

- `http://localhost:8080`

Проверить:

- UI загружается;
- прямой переход на глубокий route не даёт 404;
- клиентский кабинет отдаётся корректно как SPA.

---

## 8. GitHub Repository Settings To Check

В `autoshop-client-web` проверь:

- `Settings` → `Actions` → `General`
- workflows разрешены;
- reusable workflows разрешены;
- GitHub Actions не ограничены organization policy.

---

## 9. Expected Image Tags

После push в `main` или `staging` должны появляться теги примерно такого вида:

- `main`
- `staging`
- `sha-<short-commit>`
- `latest` для `main`

---

## 10. How Infra Will Use It

После публикации image инфраструктура должна использовать:

```env
CLIENT_WEB_IMAGE=ghcr.io/autoshop-crm/autoshop-client-web
CLIENT_WEB_IMAGE_TAG=latest
```

или фиксированный tag:

```env
CLIENT_WEB_IMAGE_TAG=sha-1a2b3c4
```

---

## 11. Recommended Commit Sequence

### Step 1
Добавить:

- `FrontClient/Dockerfile`
- `FrontClient/nginx.conf`
- `FrontClient/.dockerignore`
- `.github/workflows/deploy.yml`

### Step 2
Сделать локальную проверку build в `FrontClient`.

### Step 3
Сделать commit:

```bash
git add .
git commit -m "ci: add reusable build and docker publish workflow"
```

### Step 4
Запушить в `main` или `staging`.

### Step 5
Проверить GitHub Actions run и package в GHCR.

---

## Definition of Done

Считать задачу завершенной, когда:

- в `FrontClient` есть `Dockerfile`;
- в `FrontClient` есть `nginx.conf` с SPA fallback;
- в `FrontClient` есть `.dockerignore`;
- в repo есть `.github/workflows/deploy.yml`;
- GitHub Actions успешно собирает image;
- image появляется в `ghcr.io/autoshop-crm/autoshop-client-web`;
- image можно локально запустить через `docker run`;
- `autoshop-infrastructure` может использовать этот image в `staging/prod`.

---

## Practical Recommendation

Для `autoshop-client-web` это тоже нужно сделать обязательно.

Этот репозиторий должен перейти с модели:

- build from source on server

на модель:

- build in CI from `FrontClient`
- push to GHCR
- pull on server

