import { apiClient } from "./apiClient";

export const Equipment = {
  async list(orderBy = "-createdAt", limit = 100) {
    // orderBy is ignored in simple backend; kept for API parity
    return apiClient.listEquipment({ limit });
  },
  async filter(filters = {}, orderBy = "-createdAt", limit = 100, offset) {
    const params = { ...filters };
    if (limit) params.limit = limit;
    if (offset !== undefined) params.offset = offset;
    if (orderBy) params.orderBy = orderBy;
    return apiClient.listEquipment(params);
  },
  async get(id) {
    return apiClient.getEquipment(id);
  },
  async create(data) {
    return apiClient.addEquipment(data);
  },
  async update(id, data) {
    return apiClient.updateEquipment(id, data);
  },
  async delete(id) {
    return apiClient.deleteEquipment(id);
  },

  // Category options
  categoryOptions: ["cardio", "strength", "free_weights", "functional", "accessories"],

  // Condition options
  conditionOptions: ["new", "good", "needs_repair", "broken"],

  // Status options
  statusOptions: ["operational", "maintenance", "broken", "retired"],

  // Category icons for UI
  categoryIcons: {
    cardio: "🏃",
    strength: "💪",
    free_weights: "🏋️",
    functional: "🤸",
    accessories: "📦"
  }
};
