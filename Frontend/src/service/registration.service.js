import createApiClient from "./api.service";

class registrationService {
  constructor(baseUrl = "/api/registration") {
    this.api = createApiClient(baseUrl);
  }

  async getAll() {
    return (await this.api.get("/")).data;
  }
  async upload(data) {
    return (await this.api.post("/multiple", data)).data;
  }
}

export default new registrationService();
