# IDP System — implemented Flask authentication API contract

The React frontend now calls the Flask API for password login, account registration, Google OAuth, and password recovery. The browser no longer creates or displays OTP values. These are the endpoint contracts implemented in the included Flask backend; complete end-to-end operation still requires the environment and provider configuration below.

Base URL: `VITE_API_BASE_URL` (default `http://localhost:5000/api`). All responses should be JSON. Error responses should preferably use `{ "message": "Human-readable message" }`.

## Session and security requirements

- Use a server-managed session or short-lived access session in a `Secure`, `HttpOnly` cookie. The frontend sends credentials with API requests. Do not return a long-lived JWT for storage in `localStorage`.
- Implement `GET /auth/me` and `POST /auth/logout`.
- Configure Flask-CORS for the exact frontend origins, `supports_credentials=True`, and allow `Content-Type` and `X-Requested-With` headers. Do not use wildcard origins with credentialed cookies.
- Validate the exact `Origin` (and, where appropriate, `Referer`) on every state-changing request. Require the `X-Requested-With: XmlHttpRequest` header and keep credentialed CORS restricted to the exact frontend origin; never combine credentialed requests with wildcard origins. Use an appropriate `SameSite` cookie policy. If your Flask CSRF library requires a token, add a token endpoint and send its token in a dedicated request header as part of the integration.
- Use HTTPS outside local development. For cross-site production deployments, configure cookies with `SameSite=None; Secure`; for same-site deployments, prefer `SameSite=Lax`.
- Hash passwords with a modern password hashing function such as Argon2id or bcrypt. Never log passwords, OTP values, Google authorization codes, or reset tokens.
- Rate-limit login, OTP-send, OTP-verify, registration, and password-reset endpoints. Store OTP hashes server-side, set short expirations, enforce attempt limits, and invalidate a challenge after successful verification or password reset.
- Keep OTP delivery credentials, Google client secret, database credentials, and signing keys in the Flask server's environment only. Never put them in `VITE_*` variables.

## Endpoints

### `POST /auth/register`

Request:

```json
{
  "full_name": "Example User",
  "email": "user@example.com",
  "phone": "+919876543210",
  "password": "a-long-user-password"
}
```

Success: `201` and `{ "message": "Account created" }`. Reject duplicate email/phone and invalid data with appropriate `4xx` JSON errors.

### `POST /auth/login`

Request: `{ "email": "user@example.com", "password": "..." }`

Success: set the authenticated HttpOnly cookie and return `{ "user": { "id": "...", "full_name": "...", "email": "..." } }`.

### `GET /auth/me`

Success when authenticated: `{ "user": { "id": "...", "full_name": "...", "email": "..." } }`. Return `401` when no valid session exists.

### `POST /auth/logout`

Invalidate the server session and clear the cookie. Return `{ "message": "Signed out" }`.

### `POST /auth/google`

The browser uses Google's Identity Services **authorization-code popup flow** and posts `{ "code": "..." }` with `X-Requested-With: XmlHttpRequest`. The popup flow's redirect URI is the frontend origin. Flask must verify the request origin and the custom header, exchange the one-time code with Google using the server-only OAuth client secret, validate the returned ID token (issuer, audience/client ID, expiry and verified email), then create/find the local user and set the same authenticated HttpOnly cookie used by password login. Return `{ "user": { "id": "...", "full_name": "...", "email": "..." } }`.

Configure an OAuth 2.0 **Web application** client in Google Cloud Console. Add the frontend origin (for local development, typically `http://localhost:5173`) to Authorized JavaScript origins. Set the same client ID in `VITE_GOOGLE_CLIENT_ID`. Keep the client secret on Flask only. The backend code exchange must use the same redirect URI/origin that the popup flow used.

### `POST /auth/password-reset/request-otp`

Email request:

```json
{ "channel": "email", "destination": "user@example.com" }
```

SMS request:

```json
{ "channel": "sms", "destination": "+919876543210" }
```

Success: `{ "challenge_id": "opaque-random-id", "expires_in": 300, "message": "If an account matches, a code has been sent" }`. Use the same outward response for known and unknown accounts to reduce account enumeration. Deliver the OTP from the server using your SMTP/email provider or SMS provider. Never return the OTP in the API response.

### `POST /auth/password-reset/verify-otp`

Request: `{ "challenge_id": "opaque-random-id", "otp": "123456" }`

Success: `{ "reset_token": "short-lived-one-time-token" }`. Reject invalid, expired, already-used, or over-attempted challenges. The reset token must be bound to the account and expire quickly.

### `POST /auth/password-reset/confirm`

Request: `{ "reset_token": "short-lived-one-time-token", "new_password": "a-new-long-password" }`

Success: `{ "message": "Password updated" }`. Consume the token, update the password hash, revoke existing sessions as appropriate, and invalidate all outstanding reset challenges.

## OTP delivery choices

The frontend is provider-agnostic. Flask must connect to a real email delivery service (SMTP or an email API) and a real SMS provider (for example an India-supported SMS gateway). A demo OTP displayed in the browser is not secure and does not prove delivery; this frontend has removed that prototype behavior.
