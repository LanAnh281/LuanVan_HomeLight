import createApiClient from "./api.service";

class resetPasswordService {
  constructor(baseUrl = "/api/resetPassword") {
    this.api = createApiClient(baseUrl);
  }
  async create(data) {
    return (await this.api.post("/", data)).data;
  }
}

export default new resetPasswordService();
