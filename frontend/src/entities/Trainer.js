import { apiClient } from "./apiClient";

export const Trainer = {
  async list(orderBy = "-created_date", limit = 100) {
    return apiClient.listTrainers();
  },
  async get(id) {
    return apiClient.getTrainer(id);
  },
  async create(data) {
    return apiClient.addTrainer(data);
  },
  async update(id, data) {
    return apiClient.updateTrainer(id, data);
  },
  async delete(id) {
    return apiClient.deleteTrainer(id);
  }
};
