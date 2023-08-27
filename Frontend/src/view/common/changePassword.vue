<script>
import { reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
//js
import { success, warning } from "../../assets/js/common.alert";
//service
export default {
  components: {},
  setup() {
    const router = useRouter();
    const route = useRoute();
    const data = reactive({
      item: { passwordOld: "", password: "", confirmPassword: "" },
    });
    const changePassword = async () => {
      try {
        const document = await abc;

        if (document.status === "success") {
          success("Thành công", "Khôi phục mật khẩu thành công");
          router.push({ name: "Login" });
        } else {
          warning("Thất bại", "Khôi  phục mật khẩu thất bại");
        }
      } catch (error) {
        console.error(">>>er:", error);
        warning("Thất bại", "Khôi  phục mật khẩu thất bại");
      }
    };
    onMounted(async () => {});
    return { data, changePassword };
  },
};
</script>
<template>
  <div class="body container-fluid">
    <div
      class="row justify-content-around align-items-center"
      style="height: calc(100vh - var(--footer))"
    >
      <div class="card shadow col-5">
        <div class="row justify-content-center">
          <router-link :to="{ name: 'User' }" class="col-3">
            <img
              src="../../assets/image/logo.PNG"
              style="width: 100%; height: 100%"
            />
          </router-link>
          <h4 class="text-center mt-3 ml-3 col-12">Đổi mật khẩu</h4>
        </div>
        <form @submit.prevent="changePassword" class="container mt-3">
          <div class="form-group row">
            <label for="inputPasswordOld" class="col-sm-3 col-form-label p-0"
              >Mật khẩu cũ :</label
            >
            <div class="col-sm-9">
              <input
                type="password"
                class="form-control"
                id="inputPasswordOld"
                v-model="data.item.passwordOld"
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
<style scoped>
.body {
  height: calc(100vh - var(--footer));
}
</style>
