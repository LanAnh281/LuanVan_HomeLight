<script>
import { reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
//service
import Login from "../../service/login.service";
import { checkCookieExistence } from "../../assets/js/common.login";
export default {
  components: {},
  setup() {
    const data = reactive({
      item: {
        userName: "",
        password: "",
      },
    });
    const router = useRouter();

    const setCookie = (cname, cvalue, exdays) => {
      const d = new Date();
      d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
      let expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    };

    const login = async () => {
      const document = await Login.login(data.item);
      console.log(`document:`, document._id);
      setCookie("token", document.token, 10); //1 ngày
      setCookie("role", document.role, 10);
      if (document.role == "admin") {
        router.push({ name: "Account" });
      } else router.push({ name: "User" });
    };
    return {
      login,
      data,
    };
  },
};
</script>
<template>
  <div class="login container-fluid">
    <div class="row justify-content-around align-items-center vh-100">
      <div class="card shadow col-4">
        <div class="row justify-content-center">
          <router-link :to="{ name: 'User' }" class="col-3">
            <img
              src="../../assets/image/logo.PNG"
              style="width: 100%; height: 100%"
            />
          </router-link>
          <h4 class="text-center mt-3 ml-3 col-12">Đăng nhập</h4>
        </div>
        <form @submit.prevent="login" class="container mt-3">
          <div class="form-group row">
            <label for="inputUserName" class="col-sm-3 col-form-label p-0"
              >Mã tài khoản :</label
            >
            <div class="col-sm-9">
              <input
                type="text"
                class="form-control"
                id="inputUserName"
                v-model="data.item.userName"
              />
            </div>
          </div>
          <div class="form-group row">
            <label for="inputPassword" class="col-sm-3 col-form-label p-0"
              >Mật khẩu :</label
            >
            <div class="col-sm-9">
              <input
                type="password"
                class="form-control"
                id="inputPassword"
                v-model="data.item.password"
              />
            </div>
          </div>
          <div class="form-group row justify-content-around mb-0">
            <button type="submit" class="btn btn-login col-sm-3">
              Đăng nhập
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<style></style>
