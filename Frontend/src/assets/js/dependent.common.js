import axios from "axios";
import { reactive } from "vue";
export const city = async (value) => {
  const data = reactive({ city: {}, district: {} });

  try {
    const response = await axios.get(
      `https://provinces.open-api.vn/api/p/${value}?depth=2`,
      {}
    );
    data.district = response;
    await axios
      .get(`https://provinces.open-api.vn/api/?depth=1`, {})
      .then((response) => {
        data.city = response;
      });
    for (let i = 0; i < data.city.data.length; i++) {
      if (data.city.data[i].code == value) {
        return { city: data.city.data[i], district: data.district };
      }
    }
  } catch (error) {
    if (error.response) {
      console.log("Server-side errors", error.response.data);
    } else if (error.request) {
      console.log("Client-side errors", error.request);
    } else {
      console.log("Errors:", error.message);
    }
  }
};
export const district = async (city, value) => {
  const data = reactive({ city: {}, district: {}, ward: {} });

  try {
    const ward = await axios.get(
      `https://provinces.open-api.vn/api/d/${value}?depth=2`,
      {}
    );
    data.ward = ward;
    const district = await axios.get(
      `https://provinces.open-api.vn/api/p/${city}?depth=2`,
      {}
    );
    data.district = district;
    for (let i = 0; i < data.district.data.districts.length; i++) {
      if (data.district.data.districts[i].code == value) {
        return {
          district: data.district.data.districts[i],
          ward: data.ward,
        };
      }
    }
  } catch (error) {
    if (error.response) {
      console.log("Server-side errors", error.response.data);
    } else if (error.request) {
      console.log("Client-side errors", error.request);
    } else {
      console.log("Errors:", error.message);
    }
  }
};
export const ward = async (city, district, value) => {
  const data = reactive({ city: {}, district: {}, ward: {} });

  try {
    const ward = await axios.get(
      `https://provinces.open-api.vn/api/d/${district}?depth=2`,
      {}
    );
    data.ward = ward;
    console.log(">>>ward:", data.ward.data);
    for (let i = 0; i < data.ward.data.wards.length; i++) {
      if (data.ward.data.wards[i].code == value) {
        return {
          ward: data.ward.data.wards[i],
        };
      }
    }
  } catch (error) {
    if (error.response) {
      console.log("Server-side errors", error.response.data);
    } else if (error.request) {
      console.log("Client-side errors", error.request);
    } else {
      console.log("Errors:", error.message);
    }
  }
};
