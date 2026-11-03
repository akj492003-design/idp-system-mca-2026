# IDP System — Frontend

React 19 + Vite frontend for the IDP System. The Flask API is in the sibling `backend` directory.

## Requirements

- Node.js 22.12+ (Vite 8 requirement)
- npm 10+
- Backend services started with Docker Compose (MongoDB, Redis, Flask API, Celery worker)

## Start the backend

Open PowerShell in `backend`, create `.env` from `.env.example`, and set a unique `SECRET_KEY`. Leave third-party credentials blank only when you are not testing Google OAuth, Brevo email/SMS, or Razorpay. Then run:

```powershell
docker compose build api
docker compose up -d
docker compose ps
Invoke-RestMethod http://localhost:5000/api/health
```

The API health endpoint must report MongoDB and Redis as `ok`. Check worker startup with:

```powershell
docker compose logs --tail=100 api worker
docker compose exec worker celery -A run.celery_app inspect ping
```

## Start the frontend

From `frontend`:

```powershell
Copy-Item .env.example .env -ErrorAction SilentlyContinue
npm ci
npm run dev
```

The default API URL is `http://localhost:5000/api`. Change `VITE_API_BASE_URL` in `frontend/.env` only when the Flask API is hosted elsewhere.

## Authentication and protected pages

`/login`, `/signup`, and password-reset routes are public. Home, Scanning, History, Classification, Track & Manage, Settings, Subscription, Checkout, Payment, Scanning Result, and Model Performance require a valid Flask session. A user must register first, then sign in. A `401` from `GET /api/auth/me` before login is expected and must not be treated as a page-render error. A `401` from `POST /api/auth/login` means the submitted credentials were not accepted.

When a user opens a protected URL before signing in, the app sends the user to Login and returns to the requested page after successful authentication.

## Tailwind CSS v4 constraint

This project intentionally contains **no `.css` files**. It loads the Tailwind CSS v4 browser runtime from the official CDN in `index.html` so the existing Tailwind utility classes work without `index.css`, custom CSS, or `<style>` tags. This satisfies the source constraint but is not the recommended production deployment approach: the browser runtime requires network access and is not intended as a production CSS build pipeline. A production-optimized Tailwind deployment normally needs a generated CSS asset.

## Optional integrations

- Google OAuth requires the Google web client ID in `frontend/.env` and client ID/secret plus redirect URI in `backend/.env`.
- Email/SMS OTP requires a valid Brevo API key and verified sender configuration.
- Razorpay checkout requires API key ID/secret and a configured webhook secret.

Without these provider credentials, those provider-dependent actions return a configuration or delivery error; they are not simulated as successful.

## Checks

```powershell
npm run build
npm run lint
```

Backend checks from `backend`:

```powershell
python -m compileall -q app run.py
pytest -q
```

## Known boundaries

The account/profile overlay still contains prototype-only controls for profile-photo persistence, recovery contacts, TOTP/2FA, backup-code storage, multi-device sessions, and notifications. Contact verification endpoints exist but registration does not require verification before login. EfficientNet-B0 and MobileNetV2 are offline evaluation reports; live text inference uses the supplied Linear SVM, and live image fallback uses ResNet18.
