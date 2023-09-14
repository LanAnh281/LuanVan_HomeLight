import createApiClient from "./api.service";

class userRoomService {
  constructor(baseUrl = "/api/userroom") {
    this.api = createApiClient(baseUrl);
  }

  async getAll() {
    return (await this.api.get(`/`)).data;
  }
  async getAllRoom(id) {
    return (await this.api.get(`/room/${id}`)).data;
  }
  async create(data) {
    return (await this.api.post("/", data)).data;
  }
  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }
  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }
  async delete(id, data) {
    return (await this.api.post(`/delete/${id}`, data)).data;
  }
  async deleteAll(id) {
    return (await this.api.delete(`/${id}`)).data;
  }
}

export default new userRoomService();
