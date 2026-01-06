// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL || "http://localhost:5000";

export const getApiBaseUrl = () => API_BASE_URL;
export const getApiServerUrl = () => API_SERVER_URL;

// Helper to get full URL for uploaded files
export const getFileUrl = (filePath) => {
  if (!filePath) return null;
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath;
  }
  const baseUrl = API_SERVER_URL;
  const path = filePath.startsWith('/') ? filePath : `/${filePath}`;
  return `${baseUrl}${path}`;
};

export default {
  API_BASE_URL,
  API_SERVER_URL,
  getApiBaseUrl,
  getApiServerUrl,
  getFileUrl
};
