import { apiClient } from "./apiClient";

export const Member = {
  async list(orderBy = "-created_date", limit = 100) {
    // Current backend doesn't support parameters, but we keep the signature for compatibility
    return apiClient.listMembers();
  },
  async get(id) {
    return apiClient.getMember(id);
  },
  async create(data) {
    return apiClient.addMember(data);
  },
  async update(id, data) {
    return apiClient.updateMember(id, data);
  },
  async delete(id) {
    return apiClient.deleteMember(id);
  }
};
