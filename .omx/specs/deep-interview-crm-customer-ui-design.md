# Deep Interview Spec — CRM Customer UI Design

## Metadata

- Profile: standard
- Rounds: 6
- Final ambiguity: 0.10
- Threshold: 0.20
- Context type: brownfield
- Context snapshot: `.omx/context/crm-customer-ui-design-20260514T155415Z.md`
- Transcript: `.omx/interviews/crm-customer-ui-design-20260514T155415Z.md`

## Clarity Breakdown

- Intent: 0.92
- Outcome: 0.90
- Scope: 0.88
- Constraints: 0.84
- Success: 0.90
- Context: 0.88

## Intent

Create a client CRM UI that prioritizes speed and convenience, letting customers reach the needed information or action with minimal friction.

## Desired Outcome

Produce a UI design specification for `FrontClient` that guides implementation of a cross-platform, app-like, card-based interface shared conceptually by web and future mobile application.

## In-Scope

- Navigation model for web and mobile
- Screen-pattern rules
- Visual system baseline
- Information hierarchy
- UI principles for dashboard, orders, vehicles, approvals, loyalty, documents, profile
- Client-safe simplification boundaries
- Testable UX rules

## Out-of-Scope / Non-goals

- Staff-style dense CRM UI
- Exposing internal operational details to customers
- Letting the main order screen become a raw backend/staff data dump

## Decision Boundaries

The agent may decide autonomously:
- screen patterns and navigation
- baseline visual system

## Constraints

- Separate project: `FrontClient`
- Must align with `ContextProject/Now/CRM_CUSTOMER_FRONTEND_CONCEPT_RU.md`
- Must leverage brownfield reference `../autoshop-web-spec` without copying staff UX
- Web and future mobile app should share one UI language
- UI must be app-like, card-based, and low-decorative

## Testable Acceptance Criteria

- Key information is reachable in 3 clicks or fewer
- The main screens avoid clutter and show only needed information
- No more than 7 important objects compete for attention at once
- The main order experience foregrounds customer-relevant data only
- Internal operational details remain hidden from regular customer views
- Web UI design is reusable as the basis for future mobile UI

## Assumptions Exposed + Resolutions

- Assumption challenged: “there are no prohibitions”
- Resolution: internal operational details are explicitly hidden

## Pressure-pass Findings

Revisiting the “no prohibitions” answer changed the spec materially by making non-goals explicit.

## Brownfield Evidence vs Inference

### Evidence
- Staff routes and shell are employee-oriented in `../autoshop-web-spec/src/app/App.tsx:72`
- Staff navigation is role/internal-section oriented in `../autoshop-web-spec/src/layouts/AppLayout.tsx:34`
- Concept explicitly says client UI must not copy staff CRM and should be clearer, calmer, more card/timeline based in `ContextProject/Now/CRM_CUSTOMER_FRONTEND_CONCEPT_RU.md:35`

### Inference
- A shared app-like visual language for web and mobile is the best fit for the user’s stated speed/convenience goal
- The design spec should prefer card stacks, action-first composition, and reduced density over table-centric patterns
