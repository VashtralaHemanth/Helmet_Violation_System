import axios from 'axios';

/* 🔥 FIX 1: use 127.0.0.1 instead of localhost */
const BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

/* ─── Request interceptor ───────────────── */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('vio_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

/* ─── Response interceptor ───────────────── */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("🔥 API ERROR:", error);

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Network Error';

    return Promise.reject(new Error(message));
  }
);

/* ─── Detect API ───────────────── */
export const detectViolation = async (imageFile) => {
  try {
    const formData = new FormData();

    /* 🔥 FIX 2: correct key name */
    formData.append('file', imageFile);

    const response = await apiClient.post('/detect', formData);

    return response.data;

  } catch (err) {
    console.error("❌ Detect API failed:", err);
    throw err;
  }
};

/* ─── Get DB history ───────────────── */
export const getViolations = async () => {
  try {
    const response = await apiClient.get('/violations');
    return response.data;
  } catch (err) {
    console.error("❌ History API failed:", err);
    return [];
  }
};

export default apiClient;