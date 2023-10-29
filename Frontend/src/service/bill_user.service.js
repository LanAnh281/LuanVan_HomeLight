import createApiClient from "./api.service";

class billUserService {
  constructor(baseUrl = "/api/billUser") {
    this.api = createApiClient(baseUrl);
  }

  async getAll() {
    return (await this.api.get("/")).data;
  }
  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }
  async getAllUser() {
    return (await this.api.get(`/getAll/user`)).data;
  }
}

export default new billUserService();
