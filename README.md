# Finsurance

Client-first MVP for structured suspicious transaction report drafting.

## Product

Finsurance converts a structured suspicious activity scenario into:

- a deterministic red-flag summary
- a suspicion-strength assessment
- a draft STR narrative
- a compliance checklist
- missing-information prompts

It is positioned as a drafting assistant, not an AML platform or filing engine.

## Current Flow

`Landing -> Intake -> Risk Signals -> Narrative -> Output`

The app supports:

- blank starts
- scenario presets for common STR patterns
- structured transaction capture
- customer-data capture
- deterministic rule evaluation
- editable narrative output

## Scripts

- `npm run dev`
- `npm run check`
- `npm test`
- `npm run build`

## Notes

- No login is required for the current MVP.
- No persistence is enabled for the current MVP.
- The backend only serves the app bundle and a lightweight health endpoint.
