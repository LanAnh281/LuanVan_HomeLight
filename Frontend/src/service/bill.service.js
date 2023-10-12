import createApiClient from "./api.service";

class billService {
  constructor(baseUrl = "/api/bill") {
    this.api = createApiClient(baseUrl);
  }

  async getAll() {
    return (await this.api.get("/")).data;
  }

  async getAllCustomer() {
    return (await this.api.get("/getAll/Customer")).data;
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
  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }
}

export default new billService();
