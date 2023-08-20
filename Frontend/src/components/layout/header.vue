<script>
import { reactive, onMounted, ref } from "vue";
import axios from "axios";
//component
import Select from "../../components/select/selectdependent.vue";
export default {
  components: { Select },
  setup() {
    const data = reactive({
      items: {},
      district: { data: { districts: [] } },
      ward: { data: { wards: [] } },
    });
    onMounted(async () => {
      try {
        await axios
          .get(`https://provinces.open-api.vn/api/?depth=1`, {})
          .then((response) => {
            data.items = response;
          });
      } catch (error) {
        console.log(error);
      }
    });
    const change = async (value) => {
      const code = value;
      try {
        const response = await axios.get(
          `https://provinces.open-api.vn/api/p/${code}?depth=2`,
          {}
        );
        data.district = response;
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
    const changeDistrict = async (value) => {
      const code = value;
      try {
        const response = await axios.get(
          `https://provinces.open-api.vn/api/d/${code}?depth=2`,
          {}
        );
        data.ward = response;
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
    const changeWard = async (value) => {
      console.log(value);
      try {
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
    return { data, change, changeDistrict, changeWard };
  },
};
</script>
<template>
  <div class="header container-fluid">
    <div class="row align-items-center" style="height: 100%">
      <div class="col-1 mb-2 mt-1">
        <img src="../../assets/image/logo.PNG" style="width: 75%" />
      </div>
      <div class="col">
        <div class="d-flex flex-column">
          <div class="row mb-2">
            <div style="top: 3.5px" class="col-1">Trang chủ</div>
            <div style="top: 3.5px" class="col-1">Đăng ký</div>

            <div style="top: 3.5px" class="col-1">Thông báo</div>
            <div style="top: 3.5px" class="col-1">Đăng ký</div>
          </div>
          <div class="row input-group">
            <div class="input-group col-3">
              <Select
                :title="`Chọn thành phố`"
                :data="data.items.data"
                @changeCity="(value) => change(value)"
              ></Select>
            </div>
            <div class="input-group mb-3 col-3">
              <Select
                :title="`Chọn quận huyện`"
                :data="data.district.data.districts"
                @changeCity="(value) => changeDistrict(value)"
              ></Select>
            </div>

            <div class="input-group mb-3 col-3">
              <Select
                :title="`Chọn phường xã`"
                :data="data.ward.data.wards"
                @changeCity="(value) => changeWard(value)"
              ></Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style></style>
