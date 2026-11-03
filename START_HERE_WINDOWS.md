# IDP System — Windows Setup

This is the complete project source (frontend, backend, model assets, and evaluation artifacts). It is not a changed-files patch.

## Safe update on an existing installation

1. Stop the Vite terminal with `Ctrl+C`. Do not run `docker compose down -v`.
2. Extract this ZIP directly into `D:\fullstack\IDP_FullStack_OCR_Network_Fixed`.
3. When Windows asks, choose **Replace the files in the destination** for matching project files.
4. Keep your existing `backend\.env`, `backend\model_cache`, `backend\storage`, and Docker volumes. They are runtime data/configuration and are intentionally not bundled.
5. If `frontend\.env.local` does not exist, create it from `frontend\.env.example`. If `backend\.env` does not exist, create it from `backend\.env.example` and fill in the real values. Never copy secrets into `VITE_*` variables.

## Start backend

Open PowerShell:

```powershell
cd "D:\fullstack\IDP_FullStack_OCR_Network_Fixed\backend"
docker compose up -d --build api worker
docker compose ps
```

The Compose stack uses the existing MongoDB and Redis named volumes. Do not add `-v` and do not delete `backend\model_cache`.

Backend health check:

```powershell
Invoke-RestMethod http://localhost:5000/api/health
```

## Start frontend

Open a separate PowerShell window:

```powershell
cd "D:\fullstack\IDP_FullStack_OCR_Network_Fixed\frontend"
npm ci
npm run build
npm run lint
npm run dev -- --host 0.0.0.0 --port 5173 --strictPort
```

Open **http://localhost:5173**. Port 5173 is included in the backend CORS allowlist by default. If you intentionally use port 5174, add `http://localhost:5174` to `FRONTEND_ORIGINS` in `backend\.env`, then recreate only the API and worker containers.

## Important environment values

At minimum, configure these in `backend\.env`:

- `SECRET_KEY` — use a random secret, never commit it.
- `FRONTEND_ORIGINS=http://localhost:5173`
- `FRONTEND_URL=http://localhost:5173`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI=postmessage`
- `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_EMAIL_SENDER_NAME`
- `RESET_TOKEN_TTL_MINUTES=30`
- MongoDB/Redis values if not using the Compose defaults.

Frontend `.env.local` should include:

```dotenv
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-public-google-web-client-id.apps.googleusercontent.com
VITE_DEMO_MODE=false
VITE_MAX_PDF_SIZE_MB=10
```

The Brevo key shown in the earlier chat should be considered exposed. Revoke/rotate it in Brevo and place the replacement only in `backend\.env`. The archive contains `.env.example` placeholders, not actual credentials.

## Validation status

- Backend Python compilation: passed during packaging.
- Backend tests: 3 passed during packaging.
- A Vite production build and ESLint run must be completed on the Windows machine after `npm ci`; the build could not be verified in the packaging environment because its Vite installation was incomplete and dependency installation timed out.
- Google OAuth and Brevo delivery require valid provider configuration and should be tested with staging accounts.
