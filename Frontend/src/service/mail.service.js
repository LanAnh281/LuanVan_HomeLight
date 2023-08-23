import createApiClient from "./api.service";

class mailService {
  constructor(baseUrl = "/api/mail") {
    this.api = createApiClient(baseUrl);
  }
  async sendMail(data) {
    return (await this.api.post("/", data)).data;
  }
}

export default new mailService();
