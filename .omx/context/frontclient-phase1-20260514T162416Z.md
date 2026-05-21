# Context Snapshot — frontclient-phase1

- Task statement: Реализовать Phase 1 — App shell, providers и identity в `FrontClient` на основе UI spec и implementation plan.
- Desired outcome: В `FrontClient` существует рабочий клиентский React/Vite/MUI scaffold с app shell, providers, routing, protected/public routes, login screen и базовым auth bootstrap.
- Known facts/evidence:
  - UI design spec: `FrontClient/CRM_CUSTOMER_UI_DESIGN_SPEC_RU.md`
  - Implementation plan: `FrontClient/CRM_CUSTOMER_FRONTEND_IMPLEMENTATION_PLAN_RU.md`
  - Brownfield auth/bootstrap reference: `../autoshop-web-spec/src/app/App.tsx`, `../autoshop-web-spec/src/auth/storage.ts`, `../autoshop-web-spec/src/api/authApi.ts`
- Constraints:
  - `FrontClient` is a separate project
  - keep client UI app-like, card-based, mobile-first
  - Phase 1 scope: shell, providers, identity, placeholders for core sections
- Unknowns/open questions:
  - exact backend client auth endpoints availability
  - whether register/recovery are implemented backend-side yet
- Likely codebase touchpoints:
  - `FrontClient/*`
  - `../autoshop-web-spec/src/styles/theme.ts`
  - `../autoshop-web-spec/src/app/App.tsx`
  - `../autoshop-web-spec/src/auth/storage.ts`
