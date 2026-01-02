const API_BASE = "http://localhost:5000/api";

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
    if (!res.ok) throw new Error("Failed to add member");
    return res.json();
  },
  async updateMember(id, data) {
    const res = await fetch(`${API_BASE}/members/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to update member");
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
    const res = await fetch(`${API_BASE}/trainers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to add trainer");
    return res.json();
  },
  async updateTrainer(id, data) {
    const res = await fetch(`${API_BASE}/trainers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to update trainer");
    return res.json();
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
    if (!res.ok) throw new Error("Failed to add equipment");
    return res.json();
  },
  async updateEquipment(id, data) {
    const res = await fetch(`${API_BASE}/equipment/${id}`, {
      method: "PUT",
      body: data instanceof FormData ? data : JSON.stringify(data),
      headers: data instanceof FormData ? {} : { "Content-Type": "application/json" }
    });
    if (!res.ok) throw new Error("Failed to update equipment");
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
