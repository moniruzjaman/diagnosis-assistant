# OpenStreetMap Field Mapping — Plan for diagnosis-assistant

Status: planning specification only. No runtime code or deployment configuration is changed by this document.

## 1. Correct project and deployment source

Target repository: `moniruzjaman/diagnosis-assistant`.

This is the CABI Plant Diagnosis Assistant built with Next.js 16, TypeScript, Tailwind CSS 4 and React 19. It is not the separate `cabi-diagnosis` repository.

The current intended publishing workflow is GitHub Pages:
- `.github/workflows/deploy.yml` builds `out/` and deploys it to GitHub Pages on pushes to `main`.
- `next.config.ts` uses `output: "export"`, `basePath: "/diagnosis-assistant"` and trailing slashes.
- `staticDatabase.ts` explicitly loads static assets under that base path and falls back offline.
- The README describes static hosting and browser-side BYOK AI, with local heuristic fallback.

The connected Vercel project is named `diagnosis-assistant`, but its latest inspected production deployment was ERROR (commit `68bae4a`). Its Vercel project metadata reports framework `vite`, while the repository is a Next.js app. This is a configuration inconsistency to investigate before relying on Vercel. The deployment error cause has not yet been established. Do not change the primary GitHub Pages workflow merely to make Vercel work.

## 2. Existing product features and integration points

- Main client app: `src/components/PlantApp.tsx`.
- Existing features: Symptom Explorer, AI Plant Doctor, guided diagnosis wizard, Crop Auditor Quiz and local scan history.
- Diagnosis history is held in `localStorage` under `cabi_diagnostic_history`.
- Signed-in history is also synchronized to Firestore through `src/lib/firebase.ts`.
- `HistoryScan` is declared in `src/lib/types.ts`.
- Diagnosis capture is centralised in `appendHistoryScan()` in `PlantApp.tsx`.
- No existing Leaflet/MapLibre map or geofence boundary workflow was found in the inspected source.
- No `respiratory` feature/module was found by repository code search. If “respiratory” refers to a specific item, identify it separately; do not add unrelated medical/respiratory functionality to this crop-diagnosis app.

## 3. Product design: Field Map

Add **Field Map / ক্ষেতের মানচিত্র** as an optional feature attached to each diagnosis scan and accessible from scan history. It should not interrupt the diagnosis wizard or request location on app startup.

### User flow

1. After a diagnosis, user may choose **Add field location**.
2. Explain why location is requested; then request GPS only after the user taps **Use my location**.
3. Display the point on an OpenStreetMap map, with reported accuracy.
4. Offer **Confirm location**, **Adjust pin**, and **Skip**.
5. After confirmation, optionally reverse-geocode a readable place label and let the user edit it.
6. Optionally draw a field boundary polygon; allow save, undo, edit and clear.
7. Show all location-tagged scans on a History Map, filtered by crop, diagnosis category and date.
8. On a later visit, compare the new GPS point with the saved polygon and show Inside / Outside / Uncertain.

No location is required to diagnose or save a scan.

## 4. Map and geospatial stack

- Use Leaflet + `react-leaflet` as a first candidate for the existing Next.js/React app. Verify React 19 and Next.js 16 compatibility and inspect the lockfile before adding dependencies.
- Load the map client-side only (dynamic import with SSR disabled) so server rendering and the static export do not evaluate browser-only map APIs.
- Use OSM raster tiles with visible `© OpenStreetMap contributors` attribution.
- Keep the tile provider configurable. Do not bulk-download or promise offline tiles from the public OSM tile service.
- Use browser `navigator.geolocation` only after explicit user action; handle denied, unavailable, timeout and low-accuracy states.
- Use GeoJSON Polygon geometry for boundaries. GeoJSON coordinate order is [longitude, latitude]; browser geolocation uses latitude/longitude. Add tested conversion helpers.
- Use Turf.js for polygon validity, area and point-in-polygon, or a small reviewed implementation with unit tests.

## 5. Reverse geocoding

- Use a provider adapter so Nominatim can be replaced without rewriting the UI.
- Trigger reverse geocoding only after the user confirms a coordinate. Never geocode every GPS update.
- For public Nominatim: enforce at most one request per second across the app, identify the application, cache results, and avoid autocomplete or bulk lookups. Public Nominatim is not an unlimited production geocoding service.
- Do not use a Vercel API proxy to bypass public Nominatim usage policy.
- Treat returned village/union/upazila/district labels as approximate mapped context, not legal address or proof of field ownership. Allow correction.
- If traffic grows, use a contracted provider or a managed/self-hosted Nominatim service with a documented budget.

## 6. Backward-compatible data model

Extend `HistoryScan` with optional location fields; old records must remain valid.

```ts
interface ScanLocation {
  lat: number;
  lng: number;
  accuracyM: number;
  capturedAt: string;
  source: "gps" | "manual";
  placeLabel?: string;
  administrative?: {
    village?: string;
    union?: string;
    upazila?: string;
    district?: string;
  };
  geocoder?: string;
}

interface FieldBoundary {
  type: "Polygon";
  coordinates: number[][][]; // GeoJSON [longitude, latitude]
  areaSqM?: number;
  capturedAt: string;
  source: "user-drawn";
}

// Add optional fields to HistoryScan:
// location?: ScanLocation;
// fieldBoundary?: FieldBoundary;
```

- Existing history records with no `location` or `fieldBoundary` must render normally.
- Keep exact coordinates out of AI prompts, diagnosis requests, image uploads and analytics.
- Do not add a new Firestore location write in phase 1. Local-only storage first.
- If cross-device sync is later required, add a separate opt-in setting and explicit Firestore security-rule review. Sync coordinates only when the user explicitly agrees.

## 7. Geofence rules

- Phase 1 geofence check is an explicit foreground action when a user records a follow-up scan/visit.
- Results: **Inside**, **Outside**, or **Uncertain**.
- If GPS accuracy is poor or the uncertainty radius overlaps the boundary, return **Uncertain** rather than confidently marking the point inside/outside.
- Do not enable background geofencing, continuous tracking, or automatic location history in this release.
- A user-drawn polygon is a field working boundary, not an official cadastral/land ownership boundary.

## 8. GitHub Pages and Vercel deployment strategy

### GitHub Pages — primary

Preserve the existing Actions workflow and static export configuration. All map functionality must run in the browser; do not depend on Next.js API routes, server actions, runtime server environment variables or server-only geocoding endpoints on the Pages deployment. Use static-safe relative URLs and test under `/diagnosis-assistant/`, not only at localhost root.

### Vercel — secondary until repaired

The current Vercel project is connected but the latest inspected production deployment is ERROR and metadata says Vite although the source is Next.js. Before using Vercel as the primary live site:
1. inspect the failing deployment build logs;
2. set the correct Next.js framework/preset and root directory;
3. confirm install command and Bun/npm lockfile consistency;
4. confirm `output: "export"` and `basePath` behaviour for the chosen custom domain (the GitHub Pages basePath may not be appropriate on a Vercel root domain);
5. ensure API routes are not relied upon by a static export;
6. deploy a preview and run smoke tests before changing production aliases.

Do not change DNS, custom domains, GitHub Pages settings, or production aliases as part of this feature PR.

## 9. Phased delivery

### Phase 0 — deployment and baseline audit
- Confirm GitHub Pages current published URL and successful Actions run.
- Inspect Vercel build logs and reconcile framework mismatch.
- Record baseline build, lint and static export results.
- Add tests for old history records.

### Phase 1 — GPS tagging
- Add optional Add field location action to completed diagnosis/history.
- Implement explicit GPS capture, accuracy display, pin confirmation and manual fallback.
- Save location locally with the scan.
- Verify old history migration/reading remains safe.

### Phase 2 — OSM History Map
- Add lazy-loaded Leaflet map and OSM tiles with attribution.
- Plot only user-approved, saved scan locations.
- Filter pins by crop, diagnosis category and date.
- Provide list fallback if map tiles fail or network is unavailable.

### Phase 3 — reverse geocoding
- Add user-triggered reverse geocoder adapter and cache.
- Store approximate editable administrative labels separately from raw coordinates.
- Handle rate limit, timeout, no network and provider failure.

### Phase 4 — field boundary and geofence
- Draw/edit/clear a GeoJSON polygon.
- Validate polygon and calculate area.
- Add accuracy-aware Inside / Outside / Uncertain check on explicit follow-up visits.

### Phase 5 — optional cloud sync
- Only after explicit user approval and Firestore rules review.
- Do not transmit exact coordinates by default.
- No background tracking.

## 10. Acceptance criteria

- App remains buildable as a static export and works under `/diagnosis-assistant/`.
- GitHub Pages workflow continues to deploy successfully.
- Vercel preview works only after the framework/build mismatch is corrected; no production switch without smoke tests.
- No location permission prompt on initial load.
- User can skip location and complete diagnosis normally.
- Low-accuracy fixes are clearly reported; no false precision.
- OSM attribution is visible on mobile and desktop.
- Reverse geocoding is user-triggered, cached, rate-limited and editable.
- Old `HistoryScan` records without location load unchanged.
- Field polygons are validated and stored in GeoJSON coordinate order.
- Geofence uncertainty is handled honestly.
- Exact location is not sent to AI or analytics.
- No background tracking and no new serverless API dependency.
- Run `bun install --frozen-lockfile`, `bun run lint`, `bun run build`, and browser smoke tests against the static export. Fix the existing `typescript.ignoreBuildErrors` setting separately; it currently masks type errors and must not be treated as successful type validation.

## 11. External policies

- OSM tile usage policy: https://operations.osmfoundation.org/policies/tiles/
- Nominatim usage policy: https://operations.osmfoundation.org/policies/nominatim/
- Nominatim reverse API: https://nominatim.org/release-docs/latest/api/Reverse/
- OSM copyright and attribution: https://www.openstreetmap.org/copyright
