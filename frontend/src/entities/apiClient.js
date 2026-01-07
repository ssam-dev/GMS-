import { getApiBaseUrl } from "../config/api.js";

const API_BASE = getApiBaseUrl();

export const apiClient = {
  async listMembers() {
    const res = await fetch(`${API_BASE}/members`);
    if (!res.ok) throw new Error("Failed to fetch members");
    return res.json();
  },
  async getMember(id) {
    const res = await fetch(`${API_BASE}/members/${id}`);
    if (!res.ok) throw new Error("Failed to fetch member");
    return res.json();
  },
  async addMember(data) {
    const res = await fetch(`${API_BASE}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: res.statusText }));
      if (res.status === 429) {
        throw new Error("Too many requests. Please wait a moment and try again.");
      }
      throw new Error(errorData.error || errorData.message || `Failed to add member: ${res.status} ${res.statusText}`);
    }
    return res.json();
  },
  async updateMember(id, data) {
    const res = await fetch(`${API_BASE}/members/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: res.statusText }));
      if (res.status === 429) {
        throw new Error("Too many requests. Please wait a moment and try again.");
      }
      throw new Error(errorData.error || errorData.message || `Failed to update member: ${res.status} ${res.statusText}`);
    }
    return res.json();
  },
  async deleteMember(id) {
    const res = await fetch(`${API_BASE}/members/${id}`, {
      method: "DELETE"
    });
    if (!res.ok) throw new Error("Failed to delete member");
    return res.json();
  },
  // Trainer endpoints
  async listTrainers() {
    const res = await fetch(`${API_BASE}/trainers`);
    if (!res.ok) throw new Error("Failed to fetch trainers");
    return res.json();
  },
  async getTrainer(id) {
    const res = await fetch(`${API_BASE}/trainers/${id}`);
    if (!res.ok) throw new Error("Failed to fetch trainer");
    return res.json();
  },
  async addTrainer(data) {
    console.log('API Client - Adding trainer with data:', data);
    console.log('API Client - profile_photo value:', data.profile_photo);
    const res = await fetch(`${API_BASE}/trainers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: res.statusText }));
      console.error('❌ API Client - Create trainer error:', errorData);
      if (res.status === 429) {
        throw new Error("Too many requests. Please wait a moment and try again.");
      }
      // Surface validation errors from backend so the user sees the exact issue
      if (errorData.errors && Array.isArray(errorData.errors)) {
        throw new Error(errorData.errors.join(', '));
      }
      throw new Error(errorData.error || errorData.message || `Failed to add trainer: ${res.status} ${res.statusText}`);
    }
    const result = await res.json();
    console.log('API Client - Server response:', result);
    return result;
  },
  async updateTrainer(id, data) {
    console.log('📤 API Client - Updating trainer:', id, data);
    const res = await fetch(`${API_BASE}/trainers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: res.statusText }));
      console.error('❌ API Client - Update error:', errorData);
      if (res.status === 429) {
        throw new Error("Too many requests. Please wait a moment and try again.");
      }
      // Handle validation errors array
      if (errorData.errors && Array.isArray(errorData.errors)) {
        throw new Error(errorData.errors.join(', '));
      }
      throw new Error(errorData.error || errorData.message || `Failed to update trainer: ${res.status} ${res.statusText}`);
    }
    const result = await res.json();
    console.log('✅ API Client - Update success:', result);
    return result;
  },
  async deleteTrainer(id) {
    const res = await fetch(`${API_BASE}/trainers/${id}`, {
      method: "DELETE"
    });
    if (!res.ok) throw new Error("Failed to delete trainer");
    return res.json();
  },
  // Equipment endpoints
  async listEquipment(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/equipment${query ? `?${query}` : ""}`);
    if (!res.ok) throw new Error("Failed to fetch equipment");
    return res.json();
  },
  async getEquipment(id) {
    const res = await fetch(`${API_BASE}/equipment/${id}`);
    if (!res.ok) throw new Error("Failed to fetch equipment");
    return res.json();
  },
  async addEquipment(data) {
    const res = await fetch(`${API_BASE}/equipment`, {
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data),
      headers: data instanceof FormData ? {} : { "Content-Type": "application/json" }
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: res.statusText }));
      if (res.status === 429) {
        throw new Error("Too many requests. Please wait a moment and try again.");
      }
      throw new Error(errorData.error || errorData.message || `Failed to add equipment: ${res.status} ${res.statusText}`);
    }
    return res.json();
  },
  async updateEquipment(id, data) {
    const res = await fetch(`${API_BASE}/equipment/${id}`, {
      method: "PUT",
      body: data instanceof FormData ? data : JSON.stringify(data),
      headers: data instanceof FormData ? {} : { "Content-Type": "application/json" }
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: res.statusText }));
      if (res.status === 429) {
        throw new Error("Too many requests. Please wait a moment and try again.");
      }
      throw new Error(errorData.error || errorData.message || `Failed to update equipment: ${res.status} ${res.statusText}`);
    }
    return res.json();
  },
  async deleteEquipment(id) {
    const res = await fetch(`${API_BASE}/equipment/${id}`, {
      method: "DELETE"
    });
    if (!res.ok) throw new Error("Failed to delete equipment");
    return res.json();
  }
};
