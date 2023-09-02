import createApiClient from "./api.service";

class rolePositionService {
  constructor(baseUrl = "/api/roleposition") {
    this.api = createApiClient(baseUrl);
  }

  async getAll() {
    return (await this.api.get("/")).data;
  }
  async create(data) {
    return (await this.api.post("/", data)).data;
  }
  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }
  async delete(id, data) {
    return (await this.api.post(`/${id}`, data)).data;
  }
}

export default new rolePositionService();
