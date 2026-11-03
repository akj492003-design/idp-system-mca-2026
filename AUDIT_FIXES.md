# IDP System — code review and fix register

Line numbers below refer to the delivered source files in this release. The original frontend archive did not contain a Flask backend; backend files listed here are newly added integration code. “Fixed” means implemented and checked statically/unit-wise in this environment; external providers and browser-driven E2E behavior still require staging credentials.

## A. Network, runtime, API and data-integrity fixes

| File / lines | Original defect or risk | Fix and reason |
|---|---|---|
| `backend/app/__init__.py:29-39` | No application-owned MongoDB indexes or persistent backend schema existed in the frontend archive. | Added per-user email/phone/document/activity/OTP/session settings and quota indexes; `subscription_usage.user_id` is unique for atomic Intermediate quota accounting. |
| `backend/app/__init__.py:41-59` | No credentialed CORS or browser-origin write protection. | Added exact-origin CORS with credentials and rejection of untrusted Origin/Referer on mutating browser requests. Razorpay webhooks remain provider-to-server and are signature checked in their own route. |
| `backend/app/__init__.py:61-80` | No Flask application structure/API blueprints or asynchronous task registration. | Added app factory, registered auth/documents/dashboard/history/classification/settings/subscription/payment blueprints, and registered Celery task configuration. |
| `backend/app/security.py:1-34` | No server-side authenticated user guard/data boundary. | Added session-based login guard, MongoDB user lookup, safe user serialization, and per-user context used by routes. |
| `backend/app/blueprints/auth.py:20-75` | No backend account registration, password login, Google OAuth exchange or secure session establishment. | Added Argon2 password hash, duplicate account handling, Google authorization-code exchange/token validation, session rotation and login/logout endpoints. |
| `backend/app/blueprints/auth.py:78-184` | No OTP/reset/verification service; client-only OTP would be unsafe. | Added hashed OTP challenges, attempt limits, expirations, one-time reset tokens and Brevo email/SMS delivery. Missing provider configuration fails closed. |
| `backend/app/blueprints/auth.py:29-43` | Blank optional phone numbers could collide in a MongoDB sparse unique index. | Omitted the `phone` field when the user supplies no phone instead of storing `""`. |
| `backend/app/blueprints/auth.py:105-177` | MongoDB datetimes can be returned without timezone metadata; direct aware/naive comparisons can raise runtime `TypeError`. | Normalized OTP expiry values to UTC before comparisons. |
| `backend/app/services/brevo.py:1-42` | No service-side SMS/email delivery integration. | Added Brevo transactional SMS/email API calls with timeouts and HTTP error propagation. |
| `backend/app/blueprints/documents.py:13-84` | Home upload input had no upload callback; no server upload persistence, status, validation, quota check or Celery enqueue existed. | Added file validation, 10 MB cap, quota reservation, private per-user storage, MongoDB metadata/activity creation, Celery task dispatch and rollback/release when queueing fails. |
| `backend/app/blueprints/documents.py:112-126` | No server-backed preview endpoint for PDF/image files. | Added authenticated inline preview with restrictive response headers. |
| `backend/app/blueprints/documents.py:128-172` | No download/update/archive/tag/folder/delete operations against persistent records. | Added per-user download and metadata CRUD; rename retains the original file extension so filename metadata cannot desynchronize from the stored file/parser. |
| `backend/app/services/document_pipeline.py:11-42` | No OCR or document extraction backend. | Added PaddleOCR image/scanned-page extraction and PyMuPDF text extraction for PDF pages. |
| `backend/app/services/document_pipeline.py:44-106` | No support for supplied document formats; `.bson` must not be decoded as JSON. | Added extraction for PDF, raster images, DOCX, XLSX/XLSM, PPTX, TXT/MD/RTF, CSV, JSON, BSON and XML. BSON uses `bson.BSON.decode`. |
| `backend/app/services/document_pipeline.py:109-149` | Scanning result lacked useful extracted information. | Added deterministic summary, key-field extraction (emails, phones, dates, amounts, invoice identifiers, GSTIN), word/character counts and classification metadata. |
| `backend/app/services/classifier.py:1-75` | No live inference path using supplied trained assets. | Added Linear SVM + TF-IDF text inference and ResNet18 Paddle image fallback. SVM normalized decision margins are labeled as uncalibrated relative scores, not probabilities. |
| `backend/app/tasks/document_tasks.py:16-75` | No asynchronous processing lifecycle or retry behavior. | Added queued/processing/completed/failed transitions, activity events, result persistence and bounded Celery retry. |
| `backend/app/services/quota.py:1-130` | Upload cap could be bypassed by concurrent requests; no 24-hour backend cooldown; UI state could remain locked after expiry; Intermediate 20-count was non-atomic. | Added unique per-user quota counters, conditional atomic increments, server-side cooldown timestamp, automatic expiry/reset and 30-day Intermediate counter. Quota response returns `locked`, `used`, `remaining`, and cooldown metadata. |
| `backend/app/blueprints/documents.py:73-84` | A failed queue submission could consume an upload even though no scan was accepted. | Added cleanup of file/document/activity and quota slot release on queue submission failure for Basic and Intermediate plans. |
| `backend/app/blueprints/history.py` | No persistent user-scoped activity history; timestamps could be rendered as UTC-only or compared inconsistently. | Added paginated MongoDB activity feed and ISO timestamps; frontend formats in the browser’s local timezone. |
| `backend/app/blueprints/dashboard.py:14-109` | Existing dashboard expected latest document and evaluation fields not provided by an API. | Added summary counts, recent uploads, latest completed document, extraction/classification data, true processing durations, current quota and model evaluation payload. |
| `backend/app/blueprints/classification.py:1-34` | Classification page used placeholder/sample category rows. | Added user-scoped classification counts and document results sourced from persisted completed scans. |
| `backend/app/blueprints/settings.py:1-52` | Settings/folder/tag choices were not persisted. | Added MongoDB settings load/save with allowed fields and value validation. |
| `backend/app/blueprints/payments.py:1-110` | Payment screen validated a form but did not create/verify a provider transaction; raw card handling would create PCI risk. | Replaced with Razorpay order creation, hosted checkout contract, HMAC verification and webhook activation. The backend does not receive or persist card number/expiry/CVV. |
| `backend/app/blueprints/payments.py:45-110` | Duplicate verify/webhook requests could race or activate twice; webhook did not reconcile captured amount/currency. | Added atomic state claim/idempotent same-payment handling and checks of captured amount/currency against the stored order before subscription activation. |
| `backend/app/blueprints/subscriptions.py:8-20` | No authoritative plan catalog/current-subscription API. Some sample features implied a priority queue not implemented by this worker. | Added plan catalog/current plan/quota API and removed the unsupported priority-queue feature claim. |
| `backend/tests/test_contract.py:1-43` | No regression checks for evaluation payload integrity. | Added checks for expected model set, 1,349 test samples, classes, artifact files and confusion-matrix totals/diagonal accuracy. |

## B. Frontend fixes and page wiring

| File / lines | Original defect or risk | Fix and reason |
|---|---|---|
| `frontend/src/services/api.js:1-30` | No common credentialed API client/error handling. | Added shared Axios client with API base URL, HttpOnly-cookie credentials, request headers, timeout and consistent API error message extraction. |
| `frontend/src/services/idpService.js:1-94` | Most pages had no server API abstraction. | Added upload/list/get/update/delete/download/dashboard/history/classification/metrics/settings/plans/payment functions. |
| `frontend/src/context/AuthContext.jsx:1-98` | Frontend defaulted to prototype/demo identity. | Demo mode is opt-in only; normal run calls Flask session restoration, login, Google and logout. |
| `frontend/src/components/dashboard/UploadSection.jsx:12-104` | File input/dropzone did not upload files or enforce server quota. | Added API upload/progress/status, refresh, recent items, scanning status, locked-state disabled input and the requested exact Basic-plan message. Intermediate quota now gets a billing-period-specific message. |
| `frontend/src/components/layout/Topbar.jsx` | No subscription CTA tied to current quota. | Added conditional CTA linking to subscription when the server returns `quota.locked`. |
| `frontend/src/pages/ScanningResultPage.jsx:1-80` | No persistent scan-result/polling page. | Added result page with processing polling, loading animation, classification, key fields, summary, extracted text and failure state. |
| `frontend/src/pages/ModelPerformancePage.jsx:1-47` | No trustworthy supplied-model evaluation page. | Added seven model score reports, metric charts, per-class scores and test-prediction-derived confusion matrices; labels explicitly state these are offline held-out test results. |
| `frontend/src/hooks/useDashboardData.js` | Existing scanning dashboard did not resolve the new API’s latest document/result shape or preview URL. | Added cancellation-safe dashboard loading and backend-origin URL resolution. |
| `frontend/src/pages/History.jsx:100-145` | Default history was empty outside demo mode. | Connected page to paginated backend activity feed and local-time display. |
| `frontend/src/pages/TrackManage.jsx:75-120,338` | Track & Manage used local blob/object URLs and in-memory state that disappeared on refresh. | Connected list, upload, rename, metadata, folders, tags, archive/restore, download and deletion to API; root theme variant only changes color, not layout. |
| `frontend/src/pages/ClassificationPage.jsx:1-50` | Classification rows were placeholders and detail action was not an actual result route. | Connected category stats/results and route navigation to `/scanning-result/:documentId`. |
| `frontend/src/pages/Settings.jsx:145-190,349` | Settings were browser-only and theme was not synchronized consistently. | Settings and managed definitions persist through API; root observes global light/navy theme. |
| `frontend/src/context/GlobalSettingsSync.jsx:1-35` | Theme state was not consistently applied on all authenticated routes. | Loads persisted setting, updates document theme class/data attribute and listens for settings change events. Auth routes remain outside settings sync visually. |
| `frontend/src/pages/ScanningPage.jsx` | A legacy global theme effect could override user theme and cause inconsistent backgrounds. | Removed the forced theme/root mutation and reads the globally selected theme variables. |
| `frontend/src/pages/Home.jsx:11`, `frontend/src/pages/TrackManage.jsx:338`, `History.jsx:111`, `ClassificationPage.jsx:22`, `Subscription.jsx:155`, `Checkout.jsx:89`, `Payment.jsx:65`, `ScanningResultPage.jsx:41`, `ModelPerformancePage.jsx:32` | Theme color variants were missing from several page roots. | Added light-theme root color variants without changing grid dimensions, spacing, breakpoints or animation classes. |
| `frontend/src/components/SignupForm.jsx:175-190`, `frontend/src/pages/ResetPassword.jsx:25-75` | Frontend accepted an 8-character password while Flask required 10, causing requests to fail after client-side acceptance. | Aligned client validation and input minimum to the backend’s 10-character policy. |
| `frontend/src/components/account/AccountOverlay.jsx:92` | Password minimum copy/validation was inconsistent. | Aligned minimum length check to 10; see Known Boundaries below for account-overlay server actions that remain prototype-only. |

## C. Measured model-output corrections

The saved evaluation payload is `backend/app/data/model_metrics.json`. It preserves the notebook's validation-selected Linear SVM for live text inference rather than selecting Logistic Regression by comparing held-out test scores. Confusion-matrix cells for all seven models are computed from the corresponding held-out test prediction CSVs included in the provided ZIP. Contract tests verify that each matrix sums to 1,349 and its diagonal ratio matches the saved accuracy to floating-point tolerance.

No inference latency values existed in the supplied artifacts, so inference-time charts are omitted. SVM normalized decision margins are not described as calibrated confidence probabilities. EfficientNet-B0 and MobileNetV2 are shown as evaluation results only; the current live image fallback uses the portable ResNet18 Paddle checkpoint supplied in the archive.

## D. Known uncompleted behavior / staging requirements

These are intentionally disclosed rather than represented as working:

1. The separate Home account/profile overlay retains prototype-only profile-photo persistence, recovery-contact management, 2FA/TOTP, backup-code storage, multi-device session listing, email/push notifications and related local-only controls. These need authenticated server endpoints, secret storage and verification before production use.
2. Email/phone verification endpoints exist, but registration does not force account verification before login.
3. External OAuth, Brevo, MongoDB, Redis/Celery and Razorpay integrations could not be exercised because the user did not provide live credentials/services.
4. Frontend source validation: the system TypeScript parser successfully parsed all 112 JS/JSX files and a relative-import scan found zero unresolved imports. Production compilation could not be verified: `npm run build` fails with `vite: not found` because the uploaded archive contains an incomplete `node_modules`; package installation timed out in this environment. Reinstall with `npm ci` and run build/lint on a machine with npm registry access.

## E. Validation results

- Backend compile: `python -m compileall -q app run.py` — passed.
- Backend tests: `pytest -q` — **3 passed**.
- Model metrics and confusion-matrix integrity: passed in tests.
- Frontend JS/JSX parse: 112 files passed; relative import check: 0 unresolved imports. Vite build/lint: not verified due missing executable/dependency installation failure (not reported as a successful build).
- Live service and full browser end-to-end tests: pending configuration of external services/secrets.


## F. Follow-up corrections from the 2026-11-03 archive review

| File | Issue found | Correction |
|---|---|---|
| `frontend/src/index.css`, `frontend/src/main.jsx`, `frontend/vite.config.js`, `frontend/index.html` | The source still contained/imported `index.css`, contrary to the project's explicit no-CSS-file constraint. | Removed the stylesheet and import, removed the Tailwind Vite plugin, and loaded the Tailwind v4 browser runtime from the CDN in `index.html`. This keeps utility classes with no `.css` file; CDN/network dependency and production-runtime limitation are documented. |
| `frontend/src/context/AuthContext.jsx` | React Strict Mode replays effects in development, causing duplicate initial `GET /api/auth/me` probes. | Added a one-time session-check guard using `useRef`. |
| `frontend/src/components/LoginHero.jsx` | After successful login, the app always navigated to `/home`, discarding the protected destination that caused the login redirect. | Login now returns to the requested same-origin route when present; otherwise it navigates to `/home`. |
| `frontend/README.md`, root `README.md` | Frontend README described an old frontend-only demo and root README claimed `index.css` remained. | Replaced frontend setup instructions with the actual Flask/Compose/session flow and documented the Tailwind CDN trade-off and known integrations requiring credentials. |

### Follow-up verification

- Backend `python -m compileall -q app run.py`: passed.
- Backend `pytest -q`: **3 passed**.
- Frontend TypeScript compiler parser: **112 JS/JSX files parsed, 0 syntax errors**.
- Relative import scan: **0 unresolved imports**.
- Frontend CSS-file scan: **0 `.css` / `.scss` files**.
- Vite production build and ESLint remain unverified because `npm ci` could not complete in the review environment (registry/install timed out and no usable Vite executable was available). Run `npm ci`, `npm run build`, and `npm run lint` on the Windows project machine with npm registry access.
- MongoDB/Redis/Celery worker status, live authentication, OCR with real documents, Brevo, Google OAuth and Razorpay still require runtime/provider tests on the user's machine.


## OCR network/model-cache configuration update

- Configured both API and Celery worker containers to use `PADDLE_PDX_MODEL_SOURCE=bos` by default, with an environment override available through `.env`.
- Configured `PADDLE_PDX_CACHE_HOME=/app/model_cache` and bind-mounted `backend/model_cache` into both containers, so downloaded OCR models persist across container recreation and rebuilds.
- Added `.dockerignore` and `.gitignore` rules so local model cache/runtime data and `.env` secrets are not baked into Docker images or source archives.
- Important: first-time model download still requires internet access to BOS. Runtime OCR with cached models normally does not need repeat downloads. Actual BOS connectivity and OCR extraction still require a live document test on the user's network.
