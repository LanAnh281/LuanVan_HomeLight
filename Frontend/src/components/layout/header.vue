<script>
import { reactive, onMounted, ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
//component
import Select from "../../components/select/selectdependent.vue";
import registration from "../../components/form/registration.form.vue";
//services
import userService from "../../service/user.service";
import loginService from "../../service/login.service";
export default {
  components: { Select, registration },
  setup() {
    const router = useRouter();
    const position = ref("");
    const data = reactive({
      items: {},
      district: { data: { districts: [] } },
      ward: { data: { wards: [] } },
    });
    const logout = async () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("expiresIn");
      localStorage.removeItem("position");
      const document = await loginService.clearRefreshToken();
      router.push({ name: "Login" });
    };
    onMounted(async () => {
      position.value = localStorage.getItem("position");
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
      // console.log(value);
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
    return { data, change, changeDistrict, changeWard, position, logout };
  },
};
</script>
<template>
  <div class="header container-fluid">
    <div
      class="row align-items-center justify-content-between"
      style="height: 100%"
    >
      <div class="col-1 mr-0">
        <img src="../../assets/image/logo.png" style="width: 75%" />
      </div>
      <div class="col">
        <div class="d-flex flex-column">
          <div class="row justify-content-between mb-2">
            <div class="col-8 row menu">
              <div class="col-2">Trang chủ</div>
              <div class="col-2">Bài viết</div>
              <div class="col-2">Liên hệ</div>
            </div>
            <div class="col-4 row justify-content-end menu">
              <div
                class="col-2 m-0 p-0"
                data-toggle="modal"
                data-target="#registrationModal"
              >
                Đăng ký
              </div>

              <div class="col-4" v-if="!position">
                <router-link :to="{ name: 'Login' }">Đăng nhập </router-link>
              </div>
              <div class="col-4" v-if="position" @click="logout">Đăng xuất</div>
            </div>
          </div>
          <div class="row">
            <div class="input-group col-2">
              <Select
                :title="`Chọn thành phố`"
                :data="data.items.data"
                @changeCity="(value) => change(value)"
              ></Select>
            </div>
            <div class="input-group col-2">
              <Select
                :title="`Chọn quận huyện`"
                :data="data.district.data.districts"
                @changeCity="(value) => changeDistrict(value)"
              ></Select>
            </div>

            <div class="input-group col-2">
              <Select
                :title="`Chọn phường xã`"
                :data="data.ward.data.wards"
                @changeCity="(value) => changeWard(value)"
              ></Select>
            </div>
            <div class="input-group col-2">
              <Select
                :title="`Chọn giá thuê`"
                :data="data.ward.data.wards"
                @changeCity="(value) => changeWard(value)"
              ></Select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <registration></registration>
  </div>
</template>
<style scoped>
.menu div {
  top: 3.5px;
  color: var(--black-light);
  transition: color 0.3s ease;
  text-transform: uppercase;
}
.menu div:hover {
  color: var(--chocolate);
  opacity: 0.8;
  cursor: pointer;
  text-decoration: underline;
}
a {
  color: #222000ed;
  font-weight: 400;
}
a:hover {
  color: var(--chocolate);
  opacity: 0.8;
  cursor: pointer;
  text-decoration: underline;
}
</style>
