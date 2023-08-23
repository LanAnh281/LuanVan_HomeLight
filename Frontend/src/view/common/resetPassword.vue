<script>
import { reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
//service

export default {
  components: {},
  setup() {
    const router = useRouter();
    const route = useRoute();
    const data = reactive({
      item: { email: "", password: "", confirmPassword: "" },
    });
    const resetPassword = () => {
      console.log("resetPassword");
      console.log(route.query.reset);
    };
    onMounted(async () => {});
    return { data, resetPassword };
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
        <form @submit.prevent="resetPassword" class="container mt-3">
          <div class="form-group row">
            <label for="inputUserName" class="col-sm-3 col-form-label p-0"
              >Mã tài khoản :</label
            >
            <div class="col-sm-9">
              <input
                type="text"
                class="form-control"
                id="inputUserName"
                v-model="data.item.email"
              />
            </div>
          </div>
          <div class="form-group row">
            <label for="inputPassword" class="col-sm-3 col-form-label p-0"
              >Mật khẩu mới :</label
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
          <div class="form-group row">
            <label
              for="inputConfirmPassword"
              class="col-sm-3 col-form-label p-0"
              >Nhập lại mật khẩu:</label
            >
            <div class="col-sm-9">
              <input
                type="password"
                class="form-control"
                id="inputConfirmPassword"
                v-model="data.item.confirmPassword"
              />
            </div>
          </div>
          <div
            class="form-group row justify-content-around"
            style="margin-top: 26px"
          >
            <button type="submit" class="btn btn-login col-sm-3 mx-2">
              Xác nhận
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
