import createApiClient from "./api.service";

class userService {
  constructor(baseUrl = "/api/users") {
    this.api = createApiClient(baseUrl);
  }

  async getAll() {
    return (await this.api.get("/")).data;
  }
  // async upload(data) {
  //   return (await this.api.post("/multiple", data)).data;
  // }
}

export default new userService();
