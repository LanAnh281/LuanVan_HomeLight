import createApiClient from "./api.service";

class mediaService {
  constructor(baseUrl = "/api/media") {
    this.api = createApiClient(baseUrl);
  }
  async get(id) {
    return (await this.api.get(`${id}`)).data;
  }
}
export default new mediaService();
