import createApiClient from "./api.service";

class userService {
  constructor(baseUrl = "/api/users") {
    this.api = createApiClient(baseUrl);
  }

  async getAll() {
    return (await this.api.get("/")).data;
  }
  async create(data) {
    return (
      await this.api.post("/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    ).data;
  }
  async createAndUpdateRoom(id, data) {
    return (
      await this.api.post(`/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    ).data;
  }
  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }
  async update(id, data) {
    return (
      await this.api.put(`/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    ).data;
  }
  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }
}

export default new userService();
