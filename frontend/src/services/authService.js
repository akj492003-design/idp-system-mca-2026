import api from "./api";

// API contract is documented in BACKEND_AUTH_CONTRACT.md.
export async function getCurrentUser() {
  const response = await api.get("/auth/me");
  const payload = response.data;
  if (payload && Object.prototype.hasOwnProperty.call(payload, "user")) return payload.user;
  if (payload?.authenticated === false) return null;
  return payload ?? null;
}

export async function loginWithPassword(credentials) {
  const response = await api.post("/auth/login", credentials);
  return response.data;
}

export async function registerAccount(details) {
  const response = await api.post("/auth/register", details);
  return response.data;
}

export async function loginWithGoogleCode(code) {
  const response = await api.post(
    "/auth/google",
    { code },
    { headers: { "X-Requested-With": "XmlHttpRequest" } },
  );
  return response.data;
}

export async function logoutFromServer() {
  await api.post("/auth/logout");
}

export async function requestPasswordResetLink({ email }) {
  const response = await api.post("/auth/password-reset/request-link", { email });
  return response.data;
}

export async function requestPasswordResetOtp({ channel, destination }) {
  const response = await api.post("/auth/password-reset/request-otp", { channel, destination });
  return response.data;
}

export async function verifyPasswordResetOtp({ challengeId, otp }) {
  const response = await api.post("/auth/password-reset/verify-otp", {
    challenge_id: challengeId,
    otp,
  });
  return response.data;
}

export async function confirmPasswordReset({ resetToken, password }) {
  const response = await api.post("/auth/password-reset/confirm", {
    token: resetToken,
    new_password: password,
  });
  return response.data;
}
