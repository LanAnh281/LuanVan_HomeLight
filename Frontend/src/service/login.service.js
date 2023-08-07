import createApiClient from "./api.service";

class loginService {
  constructor(baseUrl = "/api/login") {
    this.api = createApiClient(baseUrl);
  }

  async getAll() {
    return (await this.api.get("/")).data;
  }
  async login(data) {
    return (await this.api.post("/", data)).data;
  }
  async accessToken() {
    return (await this.api.post("/accessToken")).data;
  }
  async clearToken() {
    return (await this.api.post("/clearToken")).data;
  }
}

export default new loginService();
