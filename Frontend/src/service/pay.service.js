import createApiClient from "./api.service";

class payPalService {
  constructor(baseUrl = "/api/paypal") {
    this.api = createApiClient(baseUrl);
  }

  //   async getAll() {
  //     return (await this.api.get("/")).data;
  //   }
  async create(data) {
    return (await this.api.post("/", data)).data;
  }
  async success(id) {
    return (await this.api.get(`/success`)).data;
  }
  async cancel() {
    return (await this.api.get(`/cancel`)).data;
  }
  //   async update(id, data) {
  //     return (await this.api.put(`/${id}`, data)).data;
  //   }
  //   async delete(id) {
  //     return (await this.api.delete(`/${id}`)).data;
  //   }
}

export default new payPalService();
