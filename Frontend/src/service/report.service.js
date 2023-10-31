import createApiClient from "./api.service";

class reportService {
  constructor(baseUrl = "/api/report") {
    this.api = createApiClient(baseUrl);
  }

  async getAll() {
    return (await this.api.get("/")).data;
  }
}

export default new reportService();
