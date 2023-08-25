<script>
import { reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

//alert
import { warning } from "../../assets/js/common.alert";
import { setLocalStrorage } from "../../assets/js/common.login";
//service
import Login from "../../service/login.service";

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

    const login = async () => {
      const document = await Login.login(data.item);
      // const expiresIn = moment();
      console.log(`document:`, document);
      if (document.status == "success") {
        setLocalStrorage(
          document["token"],
          document["position"],
          document["expiresIn"]
        );
        if (document.position == "admin") {
          router.push({ name: "Account" });
        } else router.push({ name: "User" });
      } else {
        warning("Thất bại", "Kiểm tra tên đăng nhập và mật khẩu");
      }
    };
    const forgotPassword = async () => {
      console.log("Quên mật khẩu");
      router.push({ name: "ForgotPassword" });
    };
    return {
      login,
      data,
      forgotPassword,
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
              src="../../assets/image/logo.png"
              style="width: 100%; height: 100%"
            />
          </router-link>
          <h4 class="text-center mt-3 ml-3 col-12">Đăng nhập</h4>
        </div>
        <form @submit.prevent="login" class="container mt-3">
          <div class="form-group row">
            <label for="inputUserName" class="col-sm-3 col-form-label p-0"
              >Email :</label
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
          <div
            class="form-group row justify-content-around"
            style="margin-top: 26px"
          >
            <button type="submit" class="btn btn-login col-sm-3 mx-2">
              Đăng nhập
            </button>
          </div>
        </form>
        <div class="col-12 text-center mt-1" @click="forgotPassword">
          Quên mật khẩu
        </div>
      </div>
    </div>
  </div>
</template>
<style></style>
