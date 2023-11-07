<script>
import { reactive, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
//js
import { success, warning } from "../../assets/js/common.alert";
import { sanitizeInput } from "../../assets/js/checkInput.common";

//service
import resetPasswordService from "../../service/resetPassword.service";
export default {
  components: {},
  setup() {
    const router = useRouter();
    const route = useRoute();
    const data = reactive({
      item: { password: "", confirmPassword: "" },
      error: { password: "", confirmPassword: "" },
      flag: true,
    });
    const togglePassword = ref(false);
    const toggleComfirmPassword = ref(false);

    const resetPassword = async () => {
      try {
        for (const key in data.item) {
          if (data.item[key] == "") {
            data.error[key] = "Chưa nhập thông tin.";
            data.flag = true;
          }
        }

        if (!data.flag) {
          const document = await resetPasswordService.update(
            route.query.reset,
            data.item
          );
          if (document.status === "success") {
            success("Thành công", "Khôi phục mật khẩu thành công");
            router.push({ name: "login" });
          } else {
            warning("Thất bại", "Khôi  phục mật khẩu thất bại");
          }
        }
      } catch (error) {
        warning("Thất bại", "Khôi  phục mật khẩu thất bại");
      }
    };
    onMounted(async () => {});
    return {
      data,
      resetPassword,
      sanitizeInput,
      togglePassword,
      toggleComfirmPassword,
    };
  },
};
</script>
<template>
  <div class="login container-fluid">
    <div class="row justify-content-around align-items-center vh-100">
      <div class="card shadow col-4">
        <div class="row justify-content-center">
          <div class="col-3">
            <img
              src="../../assets/image/logo.PNG"
              style="width: 100%; height: 100%"
            />
          </div>
          <h5 class="text-center mt-3 ml-3 col-12 title">Khôi phục mật khẩu</h5>
        </div>
        <form @submit.prevent="resetPassword" class="container mt-3">
          <div class="form-group row">
            <label for="inputPassword" class="col-sm-3 col-form-label p-0"
              >Mật khẩu mới :</label
            >
            <div class="col-sm-9 row p-0 m-0">
              <input
                :type="togglePassword ? 'text' : 'password'"
                class="form-control col-10"
                style="
                  border-top-right-radius: 0px;
                  border-bottom-right-radius: 0px;
                "
                id="inputPassword"
                @blur="
                  () => {
                    if (data.item.password == '') {
                      data.error.password = 'Chưa nhập mật khẩu mới.';
                      data.flag = true;
                    }
                  }
                "
                @input="
                  data.error.password = '';
                  data.flag = false;
                "
                v-model="data.item.password"
              />
              <div class="col-2 m-0 p-0 w-100">
                <span
                  v-if="togglePassword"
                  class="material-symbols-outlined m-0 p-0 border pt-1 px-2"
                  style="
                    border-radius: 5px;
                    border-top-left-radius: 0px;
                    border-bottom-left-radius: 0px;
                    background-color: #fff;
                    cursor: pointer;
                    height: 34px;
                  "
                  @click="
                    () => {
                      togglePassword = !togglePassword;
                    }
                  "
                >
                  visibility
                </span>
                <span
                  v-if="!togglePassword"
                  class="material-symbols-outlined m-0 p-0 border pt-1 px-2"
                  style="
                    border-radius: 5px;
                    border-top-left-radius: 0px;
                    border-bottom-left-radius: 0px;
                    background-color: #fff;
                    cursor: pointer;
                    height: 34px;
                  "
                  @click="
                    () => {
                      togglePassword = !togglePassword;
                    }
                  "
                >
                  visibility_off
                </span>
              </div>
              <div v-if="data.error.password" class="invalid-error">
                {{ data.error.password }}
              </div>
            </div>
          </div>
          <div class="form-group row">
            <label
              for="inputConfirmPassword"
              class="col-sm-3 col-form-label p-0"
              >Nhập lại mật khẩu:</label
            >
            <div class="col-sm-9 row m-0 p-0">
              <input
                :type="toggleComfirmPassword ? 'text' : 'password'"
                class="form-control col-10"
                style="
                  border-top-right-radius: 0px;
                  border-bottom-right-radius: 0px;
                "
                id="inputConfirmPassword"
                @blur="
                  () => {
                    if (data.item.password !== data.item.confirmPassword) {
                      data.flag = true;
                      data.error.confirmPassword =
                        'Mật khẩu nhắc lại chưa đúng';
                    }
                  }
                "
                @input="
                  data.flag = false;
                  data.error.confirmPassword = '';
                "
                v-model="data.item.confirmPassword"
              />
              <div class="col-2 m-0 p-0 w-100">
                <span
                  v-if="toggleComfirmPassword"
                  class="material-symbols-outlined m-0 p-0 border pt-1 px-2"
                  style="
                    border-radius: 5px;
                    border-top-left-radius: 0px;
                    border-bottom-left-radius: 0px;
                    background-color: #fff;
                    cursor: pointer;
                    height: 34px;
                  "
                  @click="
                    () => {
                      toggleComfirmPassword = !toggleComfirmPassword;
                    }
                  "
                >
                  visibility
                </span>
                <span
                  v-if="!toggleComfirmPassword"
                  class="material-symbols-outlined m-0 p-0 border pt-1 px-2"
                  style="
                    border-radius: 5px;
                    border-top-left-radius: 0px;
                    border-bottom-left-radius: 0px;
                    background-color: #fff;
                    cursor: pointer;
                    height: 34px;
                  "
                  @click="
                    () => {
                      toggleComfirmPassword = !toggleComfirmPassword;
                    }
                  "
                >
                  visibility_off
                </span>
              </div>
              <div v-if="data.error.confirmPassword" class="invalid-error">
                {{ data.error.confirmPassword }}
              </div>
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
  height: 100vh; /* Đặt chiều cao cho .body theo chiều cao của viewport */
  overflow: auto; /* Cho phép nội dung trượt khi vượt quá chiều cao của .body */
}
</style>
