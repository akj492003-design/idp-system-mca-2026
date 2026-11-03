import api from "./api.js";

export async function uploadDocument(file, onUploadProgress) {
  const body = new FormData();
  body.append("file", file);
  const response = await api.post("/documents", body, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 120000,
    onUploadProgress,
  });
  return response.data;
}

export async function listDocuments(params = {}) {
  const response = await api.get("/documents", { params });
  return response.data;
}

export async function getDocument(id) {
  const response = await api.get(`/documents/${encodeURIComponent(id)}`);
  return response.data.document;
}

export async function updateDocument(id, patch) {
  const response = await api.patch(`/documents/${encodeURIComponent(id)}`, patch);
  return response.data.document;
}

export async function deleteDocument(id) {
  const response = await api.delete(`/documents/${encodeURIComponent(id)}`);
  return response.data;
}


export async function getDocumentPreview(id) {
  const response = await api.get(`/documents/${encodeURIComponent(id)}/preview`, { responseType: "blob", timeout: 60000 });
  return URL.createObjectURL(response.data);
}

export async function downloadDocument(id, filename = "document") {
  const response = await api.get(`/documents/${encodeURIComponent(id)}/download`, { responseType: "blob", timeout: 60000 });
  const url = URL.createObjectURL(response.data);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export async function getDashboard(signal) {
  const response = await api.get("/dashboard", { signal });
  return response.data;
}

export async function getHistory(params = {}) {
  const response = await api.get("/history", { params });
  return response.data;
}

export async function getClassification(params = {}) {
  const response = await api.get("/classification", { params });
  return response.data;
}

export async function getModelMetrics() {
  const response = await api.get("/classification/models");
  return response.data;
}

export async function getSettings() {
  const response = await api.get("/settings");
  return response.data.settings;
}

export async function saveSettings(settings) {
  const response = await api.put("/settings", settings);
  return response.data.settings;
}

export async function getPlans() {
  const response = await api.get("/subscriptions/plans");
  return response.data;
}

export async function getCurrentSubscription() {
  const response = await api.get("/subscriptions/current");
  return response.data;
}

export async function createPaymentOrder(planId, cycle) {
  const response = await api.post("/payments/order", { plan_id: planId, cycle });
  return response.data;
}

export async function verifyPayment(payload) {
  const response = await api.post("/payments/verify", payload);
  return response.data;
}
