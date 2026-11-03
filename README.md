# IDP System — full-stack integration handoff

This release starts from the supplied React/Vite frontend ZIP and the supplied model notebook/output ZIP. It adds a Flask API, MongoDB persistence, Redis/Celery jobs, document extraction/OCR, live classification paths, subscription quotas, Razorpay hosted checkout, and UI integration while retaining the supplied page layouts and responsive breakpoints.

**This is an integration release, not a claim of live production certification.** No Google, Brevo, MongoDB, Redis, or Razorpay credentials were supplied. Backend compilation and contract tests pass; the Vite production build could not run here because the uploaded frontend archive contains no usable Vite installation and package installation timed out. Follow the setup and staging-validation steps below before deploying.

## Project structure

```text
IDP System_IDP_FullStack_Release/
├── README.md
├── AUDIT_FIXES.md
├── backend/
│   ├── .env.example
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── requirements.txt
│   ├── config.py
│   ├── run.py
│   ├── app/
│   │   ├── __init__.py                 # Flask factory, CORS, sessions, indexes, errors
│   │   ├── security.py                 # session auth and safe user serialization
│   │   ├── blueprints/
│   │   │   ├── auth.py                 # login/register/Google/OTP/reset/verification
│   │   │   ├── documents.py            # upload/list/preview/download/update/delete
│   │   │   ├── dashboard.py            # dashboard stats and model metrics payload
│   │   │   ├── history.py              # per-user activity history
│   │   │   ├── classification.py       # document classes and saved evaluation metrics
│   │   │   ├── settings.py              # persisted per-user settings/folders/tags
│   │   │   ├── subscriptions.py         # plan catalog/current plan/quota
│   │   │   └── payments.py              # Razorpay order/verify/webhook
│   │   ├── services/
│   │   │   ├── brevo.py                 # Brevo transactional email/SMS
│   │   │   ├── document_pipeline.py     # PyMuPDF, PaddleOCR, office/text extraction
│   │   │   ├── classifier.py             # Linear SVM/TF-IDF and ResNet18 inference
│   │   │   └── quota.py                  # atomic upload limits and cooldowns
│   │   ├── tasks/document_tasks.py      # Celery asynchronous scan/classification
│   │   ├── assets/models/
│   │   │   ├── linear_svm.joblib
│   │   │   ├── tfidf_vectorizer.joblib
│   │   │   ├── class_mapping.json
│   │   │   └── best_document_classifier.pdparams
│   │   ├── data/
│   │   │   ├── model_metrics.json
│   │   │   └── individual model test reports
│   │   └── tests/test_contract.py
│   └── storage/                         # created at runtime; do not commit user files
└── frontend/
    ├── .env.example
    ├── package.json / package-lock.json
    ├── vite.config.js / index.html
    └── src/
        ├── App.jsx
        ├── services/{api.js,authService.js,idpService.js}
        ├── context/{AuthContext.jsx,GlobalSettingsSync.jsx}
        ├── hooks/useDashboardData.js
        ├── components/dashboard/UploadSection.jsx
        ├── components/layout/Topbar.jsx
        ├── pages/                         # supplied pages + result/performance pages
        └── components/                    # existing page components and controls
```

## Page-by-page integration

| Page / area | Integrated behavior |
|---|---|
| Home / scanning upload | Uploads with `FormData`, progress state, animated processing feedback, latest files and server quota; dropzone/input disabled when locked |
| Scanning dashboard | Loads saved dashboard counters, latest completed scan, actual evaluation scores and available confusion matrix |
| Scanning result | Polls server status while queued/processing; displays class, extracted summary, key fields, text and failure state |
| History | Reads paginated per-user activity records from MongoDB; browser displays timestamps in local time |
| Classification | Loads completed documents and actual per-user class counts/results; links to scanning result |
| Track & Manage | Lists and manages server-backed documents; rename (extension preserved), archive/restore, download, delete, tags and folders |
| Subscription / cards | Reads Basic, Intermediate and Unlimited plan catalog and current plan/quota |
| Checkout | Reads selected plan and billing period from the plan catalog |
| Payment | Creates Razorpay order, opens hosted Razorpay checkout, verifies signature, and activates only after server-side verification |
| Settings | Saves configuration and theme to MongoDB; folder/tag manager options persist; light/navy theme is synchronized across authenticated page roots |
| Model performance | Displays the seven supplied ML/DL models, macro scores, per-class metrics, and confusion matrices reconstructed from the supplied held-out test prediction CSVs |
| Login / signup / forgot / reset | Existing page layouts are retained and wired to the backend; password minimum is aligned to 10 characters |

Layout classes, responsive breakpoints, page component structure and existing animations were retained except for added API status states, the requested result/performance routes, and page-root theme color variants. The frontend source contains no `.css` files. Tailwind v4 browser runtime is loaded from the CDN in `frontend/index.html` to honor the no-stylesheet constraint; this is suitable for local preview/staging only and requires network access. A production-optimized Tailwind build normally emits a CSS asset.

## Backend API map

Base path: `/api`.

- `GET /health`
- `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `POST /auth/logout`, `POST /auth/google`
- `POST /auth/password-reset/request-otp`, `/verify-otp`, `/confirm`
- `POST /auth/verification/send`, `/confirm`
- `POST /documents`; `GET /documents`; `GET/PATCH/DELETE /documents/<id>`; `GET /documents/<id>/download`; `GET /documents/<id>/preview`
- `GET /dashboard`, `GET /history`, `GET /classification`, `GET /classification/models`
- `GET/PUT /settings`
- `GET /subscriptions/plans`, `GET /subscriptions/current`
- `POST /payments/order`, `POST /payments/verify`, `POST /payments/webhook`

Collection responses carry pagination metadata; errors are JSON with stable `error` and `message` fields. Credentialed CORS is restricted to exact configured frontend origins. Mutating browser requests from untrusted Origins/Referers are rejected. User records and documents are scoped to the authenticated session user.

## Local setup

### 1. Configure backend environment

```bash
cd backend
cp .env.example .env
```

Set a strong random `SECRET_KEY`; configure the provider values listed below. `MONGODB_URI` and Redis URLs default to local services.

Start MongoDB and Redis with Docker:

```bash
docker compose up -d mongo redis
```

Create a Python 3.11 environment and install backend dependencies:

```bash
python -m venv .venv
# Windows PowerShell: .venv\\Scripts\\Activate.ps1
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
```

Run the API and Celery worker in separate terminals (both from `backend/`):

```bash
python run.py
celery -A run.celery_app worker --loglevel=INFO
```

Health check: `http://localhost:5000/api/health`.

### 2. Configure frontend environment

```bash
cd frontend
cp .env.example .env.local
npm ci
npm run dev
```

Set:

```dotenv
VITE_API_BASE_URL=http://localhost:5000/api
VITE_DEMO_MODE=false
VITE_GOOGLE_CLIENT_ID=your-google-web-client-id.apps.googleusercontent.com
```

Demo mode must remain `false` for backend-backed auth/data. Do not put Google client secrets, Brevo keys, database credentials, Redis credentials or Razorpay secrets in any `VITE_*` variable.

### 3. Docker deployment baseline

After filling in `backend/.env`, run from `backend/`:

```bash
docker compose up --build -d
```

The Compose file starts MongoDB, Redis, Flask/Gunicorn and a Celery worker. This is a local/staging baseline, not a substitute for production infrastructure, monitoring or security review. Configure HTTPS, `COOKIE_SECURE=true`, fixed CORS origins, managed persistent storage, backups, retention policy, reverse-proxy timeouts and operational monitoring before deployment.

## Environment variables

| Variable | Where | Purpose |
|---|---|---|
| `SECRET_KEY` | backend | Flask session signer and OTP hash pepper; use a high-entropy secret |
| `FRONTEND_ORIGINS` | backend | Comma-separated exact origins, e.g. `http://localhost:5173`; no wildcard with credentials |
| `COOKIE_SECURE`, `COOKIE_SAMESITE` | backend | Session-cookie policy; production HTTPS should use `true` and suitable SameSite policy |
| `MONGODB_URI`, `MONGODB_DB` | backend | MongoDB connection and database |
| `REDIS_URL` | backend | Redis for rate limits/health |
| `CELERY_BROKER_URL`, `CELERY_RESULT_BACKEND` | backend | Redis-backed Celery queue/results |
| `FILE_STORAGE_PATH` | backend | Private original document storage location |
| `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` | backend | Google OAuth authorization-code exchange; secret stays server-side |
| `VITE_GOOGLE_CLIENT_ID` | frontend | Public Google Web Client ID only |
| `BREVO_API_KEY` | backend | Brevo transactional API key |
| `BREVO_SMS_SENDER` | backend | Verified Brevo SMS sender name |
| `BREVO_EMAIL_SENDER`, `BREVO_EMAIL_SENDER_NAME` | backend | Verified transactional email sender |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` | backend | Razorpay order creation, checkout signature and webhook verification |
| `MODEL_ASSETS_PATH`, `PADDLEOCR_LANG`, `ENABLE_IMAGE_CLASSIFIER` | backend | Model asset path, OCR language and image inference toggle |
| `PADDLE_PDX_MODEL_SOURCE` | backend API + worker | PaddleOCR model download host; defaults to `bos` (Baidu Object Storage) instead of Hugging Face |
| `PADDLE_PDX_CACHE_HOME` | backend API + worker | Persistent PaddleX model cache at `/app/model_cache`, bind-mounted to `backend/model_cache` on the host |
| `MAX_UPLOAD_MB` | backend | Request/document upload cap; default 10 MB |

## Upload quota rules

- Basic plan: 5 accepted uploads; the fifth upload starts a 24-hour server-enforced cooldown.
- Intermediate: 20 uploads per rolling 30-day period.
- Unlimited: no upload count limit.
- MongoDB conditional atomic increments enforce Basic and Intermediate counters under concurrent requests. The browser state is only a presentation of the server's `quota` response.
- If the queue cannot accept a newly uploaded file, the upload record/file is rolled back and its reserved quota slot is released.

The locked upload prompt reads: **“Get subscription for more uploads or wait 24 hours to upload again.”** The topbar CTA links to subscriptions.

## PaddleOCR model downloads and network behavior

The API and Celery worker both set `PADDLE_PDX_MODEL_SOURCE=bos` and `PADDLE_PDX_CACHE_HOME=/app/model_cache`. BOS is used as the model-download source instead of PaddleOCR's default Hugging Face source. The cache is bind-mounted to `backend/model_cache`, so downloaded models survive container recreation and image rebuilds. The first OCR operation still needs working internet access to reach BOS and download model files; later OCR operations normally reuse the cached files. If the cache is deleted or incomplete, PaddleOCR may need to download models again. This configuration changes the model host and persistence behavior; it does not guarantee access through a restrictive firewall, proxy, DNS failure or unstable connection.

The `backend/model_cache` folder is excluded from the Docker build context so an existing cache is not copied into every new backend image. Do not delete this folder when cleaning the project if you want to retain downloaded OCR models.

## Supported document formats

PDF, PNG, JPG/JPEG, TIF/TIFF, BMP, WEBP, DOCX, XLSX/XLSM, PPTX, TXT, MD, RTF, CSV, JSON, BSON and XML. PDF text is extracted with PyMuPDF; pages with insufficient embedded text and scanned raster pages are passed through PaddleOCR. Raster images use PaddleOCR. Legacy `.doc`, `.xls`, `.ppt`, `.odt`, `.ods`, ZIP and RAR archives are not supported in this build.

## Model metrics and inference scope

The notebook/output archive reports 1,349 held-out test samples across `form`, `invoice`, `resume`. The metrics page uses saved results for Logistic Regression, Linear SVM, KNN Cosine, Multinomial Naive Bayes, ResNet18, EfficientNet-B0 and MobileNetV2. Confusion matrices are recalculated from the provided per-document test prediction CSVs; they are not synthetically generated.

The supplied notebook selected Linear SVM based on validation macro-F1; it remains the live text classifier. Logistic Regression's held-out test accuracy is slightly higher, but selecting it using test results would leak test-set information. Live raster-image fallback uses the included ResNet18 Paddle checkpoint. EfficientNet-B0 and MobileNetV2 are represented in the offline evaluation dashboard only; their distinct training framework/checkpoint paths are not integrated for live inference in this worker. SVM normalized decision margins are relative scores, not calibrated probabilities. No inference-latency measurements were present in the supplied artifacts, so none are displayed or invented.

## Known boundaries / assumptions

1. The supplied cards imply Basic = 5 uploads, Intermediate = 20+ uploads and Unlimited = unlimited. This implementation concretizes Intermediate as 20 uploads per 30-day billing period. Prices are assumed as Basic ₹0, Intermediate ₹199/month, Unlimited ₹399/month, with 20% annual discount (₹1,910 and ₹3,830); confirm commercial terms before charging real users.
2. Upload limit defaults to 10 MB. Change `MAX_UPLOAD_MB` only after checking memory limits and reverse-proxy configuration.
3. Google, Brevo, MongoDB, Redis and Razorpay credentials were not included; these live integrations cannot be validated until configured.
4. The separate dashboard Account/Profile overlay still contains original prototype-only controls for profile-photo persistence, recovery-contact management, authenticator/2FA, backup codes, notification delivery and multi-device sessions. These must not be represented as secure account controls until corresponding server-side endpoints and verification are added. The Settings page named in the requested page list is server-persisted.
5. Email/phone verification endpoints are implemented; the current signup form creates an account and directs the user to sign in but does not force verification before login. Wire a verification screen/policy before enforcing verified-contact requirements.
6. Payment uses Razorpay hosted checkout. The app never collects or stores card number, expiry, CVV or UPI credentials. Test credentials are required to validate the external checkout.
7. Production deployment still needs antivirus/content inspection, storage encryption/retention, rate-limit tuning, indexes/backup restore drills, CSRF/staging review, provider webhook tests, observability, and security review.

## Validation performed in this environment

- `python -m compileall -q app run.py` — passed.
- `pytest -q` — passed (3 tests, including model-report and confusion-matrix reconciliation).
- `npm run build` — **not run successfully**: the provided archive had no usable `vite` executable (`vite: not found`). The archive's `node_modules` was incomplete; offline install lacked cached packages and online install timed out. Run `npm ci`, `npm run build` and `npm run lint` on a machine with registry access.
- Live API integrations and true end-to-end browser tests — not run because the required services/secrets were not supplied.
