# Context Snapshot — frontclient-phase3

- Task statement: Реализовать Phase 3 — Dashboard MVP в `FrontClient`.
- Desired outcome: Dashboard перестаёт быть placeholder и становится MVP-экраном с персональным home screen, active order, pending approvals, quick actions, ближайшей записью, пустыми/loading/error состояниями.
- Known facts/evidence:
  - UI spec: `FrontClient/CRM_CUSTOMER_UI_DESIGN_SPEC_RU.md`
  - Implementation plan: `FrontClient/CRM_CUSTOMER_FRONTEND_IMPLEMENTATION_PLAN_RU.md`
  - Phase 1 shell is implemented
  - Phase 2 client-safe mapping layer is implemented and already feeds dashboard
- Constraints:
  - dashboard must be personal, not operational
  - app-like, card-based, low-noise, mobile-first
  - no raw backend language
- Unknowns/open questions:
  - real backend aggregation endpoint for dashboard is not fixed yet
  - notifications center is a later phase, so event cards should stay lightweight
- Likely codebase touchpoints:
  - `FrontClient/src/pages/dashboard/DashboardPage.tsx`
  - `FrontClient/src/domain/client/*`
  - `FrontClient/src/components/*`
