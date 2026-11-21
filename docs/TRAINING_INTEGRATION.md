# Training integration contract

## Product role

Diagnosis Assistant is a visual learning and practice surface. It is not the canonical crop-diagnosis record, field geofence, pesticide registry or management recommendation engine. The operational workflow belongs in CABI Diagnosis.

## Reuse boundaries

- Reuse interaction patterns and independently authored training logic: question sequencing, answer feedback, confidence prompts, symptom-vs-sign teaching, abiotic-vs-biotic reasoning and offline fallback patterns.
- Do not make the assistant's heuristic result authoritative or silently merge its output into a CABI diagnosis.
- Do not copy Plantwise/CABI translated text, tables, photographs, illustrations or captions from the Diagnostic Field Guide unless the applicable licence and attribution requirements have been checked. The guide documents a CC BY-NC adaptation.
- Preserve Bangla-first labels, accessible controls, static-export compatibility, the existing PWA base path and offline heuristic behavior.
- AI is optional assistance. A missing key, unavailable provider or network failure must not block the learning flow.

## Integration contract with CABI Diagnosis

CABI may link to this app for guided learning or adopt independently authored interaction patterns. Any future data exchange must use a versioned, documented schema and require an explicit user action. Do not send personal or field data by default.

## Acceptance checks

1. Static export and GitHub Pages base path continue to work.
2. Offline heuristic learning still works without an API key or network.
3. Bangla-first UI and existing PWA install/update behavior remain intact.
4. Training outcomes are labelled as educational, not verified diagnoses or spray instructions.
