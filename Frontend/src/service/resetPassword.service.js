import createApiClient from "./api.service";

class resetPasswordService {
  constructor(baseUrl = "/api/resetPassword") {
    this.api = createApiClient(baseUrl);
  }
  async create(data) {
    return (await this.api.post("/", data)).data;
  }
  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }
}

export default new resetPasswordService();
