# IDP System — frontend/backend integration audit

## Implemented application flows

- Session authentication and account registration are backed by Flask; Google OAuth uses a server-side authorization-code exchange.
- Email/SMS password-reset OTP and contact-verification endpoints use Brevo. Reset pages never display or accept a server-generated OTP as a client-side mock.
- Home upload, dashboard, scanning result polling, history, classification, Track & Manage, settings, subscription selection and Razorpay hosted checkout use the Flask API.
- Basic/Intermediate quota enforcement is performed in MongoDB, including conditional atomic increments and a server-side 24-hour Basic cooldown.
- Scanning jobs are submitted to Celery and store extraction/classification results and activity history in MongoDB.
- Model performance uses the supplied saved test reports. Confusion matrices are reconstructed from the supplied held-out test prediction CSVs.

## Intentionally retained boundaries

- The separate dashboard Account/Profile overlay still has page-local prototype controls for profile photo persistence, recovery contacts, TOTP/2FA, backup-code storage, notification delivery and other device sessions. These controls are not secure account features until dedicated backend endpoints and verification are implemented.
- Contact verification endpoints are available, but registration does not currently force a verified email/phone before login.
- EfficientNet-B0 and MobileNetV2 are shown in offline evaluation reports; only Linear SVM text inference and ResNet18 image fallback are wired into the scan worker.

## Verification

- Backend: `python -m compileall -q app run.py` passed; `pytest -q` passed (3 tests).
- Frontend: system TypeScript parser accepted all 112 JS/JSX files and relative-import scan found 0 unresolved imports. `npm run build` could not run because the supplied archive's `node_modules` has no Vite executable. The package installation attempt timed out; run `npm ci`, `npm run build`, and `npm run lint` on a machine with npm registry access.
- Google OAuth, Brevo delivery, MongoDB, Redis/Celery processing, Razorpay checkout and webhook have not been tested against live configured services because credentials/services were not supplied.
