<script>
import { reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
//js
import { success, warning } from "../../assets/js/common.alert";
import { checkMail, sanitizeInput } from "../../assets/js/checkInput.common";

//service
import accountService from "../../service/account.service";
export default {
  components: {},
  setup() {
    const router = useRouter();
    const route = useRoute();
    const data = reactive({
      item: { passwordOld: "", password: "", confirmPassword: "" },
      error: { passwordOld: "", password: "", confirmPassword: "" },
      flag: false,
    });
    const refreshData = () => {
      data.item = { passwordOld: "", password: "", confirmPassword: "" };
    };
    const changePassword = async () => {
      try {
        console.log("Data:", data.item);
        if (!data.flag) {
          const document = await accountService.update(data.item);
          if (document.status === "success") {
            success("Thành công", "Thay đổi mật khẩu thành công");
            refreshData();
          } else {
            warning(
              "Thất bại",
              "Thay đổi mật khẩu thất bại. Bạn hãy kiểm tra lại mật khẩu cũ đã đúng chưa."
            );
          }
        }
      } catch (error) {
        console.error(">>>er:", error);
        warning("Thất bại", "Khôi  phục mật khẩu thất bại");
      }
    };
    onMounted(async () => {});
    return { data, changePassword, sanitizeInput };
  },
};
</script>
<template>
  <div class="body m-0 container-fluid">
    <div
      class="row justify-content-around align-items-center"
      style="height: calc(100vh - var(--footer))"
    >
      <div class="card shadow col-5">
        <div class="row justify-content-center">
          <router-link :to="{ name: 'user' }" class="col-3">
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
                @blur="
                  () => {
                    if (data.item.passwordOld != '')
                      data.item.passwordOld = sanitizeInput(
                        data.item.passwordOld
                      );
                    else {
                      data.error.passwordOld = 'Chưa nhập mật khẩu';
                      data.flag = true;
                    }
                  }
                "
                @input="
                  data.error.passwordOld = '';
                  data.flag = false;
                "
                v-model="data.item.passwordOld"
              />
              <div v-if="data.error.passwordOld" class="invalid-error">
                {{ data.error.passwordOld }}
              </div>
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
                @blur="
                  () => {
                    if (data.item.password != '')
                      data.item.password = sanitizeInput(data.item.password);
                    else {
                      data.error.password = 'Chưa nhập mật khẩu mới';
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
            <div class="col-sm-9">
              <input
                type="password"
                class="form-control"
                id="inputConfirmPassword"
                @blur="
                  () => {
                    data.item.confirmPassword = sanitizeInput(
                      data.item.confirmPassword
                    );
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
  min-height: calc(100vh - var(--footer));
}
</style>
