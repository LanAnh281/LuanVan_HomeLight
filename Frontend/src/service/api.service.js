// import axios from "axios";
// const commonConfig = {
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// };

// export default (baseURL) => {
//   return axios.create({
//     baseURL,
//     ...commonConfig,
//   });
// };
import axios from "axios";

const commonConfig = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

const createApiInstance = (baseURL) => {
  const apiInstance = axios.create({
    baseURL,
    ...commonConfig,
  });

  // Thêm interceptor cho request
  apiInstance.interceptors.request.use(
    (config) => {
      // Thêm header Authorization vào mỗi request
      console.log("in");
      config.headers.Authorization =
        // "Bearer " + localStorage.getItem("accessToken");
        config.headers.Authorization = localStorage.getItem("accessToken");

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Thêm interceptor cho response
  apiInstance.interceptors.response.use(
    (response) => {
      // Kiểm tra và xử lý response tại đây
      console.log("res", response);
      return response;
    },
    (error) => {
      // Xử lý lỗi response tại đây
      return Promise.reject(error);
    }
  );

  return apiInstance;
};

export default createApiInstance;
