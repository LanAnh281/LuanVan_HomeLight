import createApiClient from "./api.service";

class amenitieService {
  constructor(baseUrl = "/api/amenitie") {
    this.api = createApiClient(baseUrl);
  }

  async getAll() {
    return (await this.api.get("/")).data;
  }
  async create(data) {
    return (await this.api.post("/", data)).data;
  }
  async createAmenitiesRoom(id, data) {
    return (await this.api.post(`/${id}`, data)).data;
  }
  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }
  async getAllUser() {
    return (await this.api.get(`/getAll/user`)).data;
  }
  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }
  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }
}

export default new amenitieService();
