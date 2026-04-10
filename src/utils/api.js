import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// ─── Request Interceptor ───────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    config.metadata = { startTime: new Date() };
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ──────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => {
    const duration = new Date() - response.config.metadata?.startTime;
    console.log(`[API] ${response.config.method?.toUpperCase()} ${response.config.url} → ${response.status} (${duration}ms)`);
    return response;
  },
  (error) => {
    const { response } = error;
    if (response) {
      console.error(`[API ERROR] ${response.status}:`, response.data?.error);
    } else {
      console.error("[API ERROR] Network error:", error.message);
    }
    return Promise.reject(error);
  }
);

// ─── Commission API calls ──────────────────────────────────────────────────────
export const commissionAPI = {
  search: (commissionId, clientId) =>
    api.post("/commissions/search", {
      commission_id: commissionId,
      client_id: clientId,
    }),

  get: (commissionId, clientId) =>
    api.get(`/commissions/${commissionId}/${clientId}`),

  update: (commissionId, clientId, data) =>
    api.put(`/commissions/${commissionId}/${clientId}`, data),

  getAll: (params = {}) =>
    api.get("/commissions", { params }),

  getSession: () =>
    api.get("/commissions/meta/session"),

  healthCheck: () =>
    api.get("/health"),
};

export default api;
