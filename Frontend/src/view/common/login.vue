<script>
import { reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
//js
import { checkMail, sanitizeInput } from "../../assets/js/checkInput.common";
//alert
import { warning } from "../../assets/js/common.alert";
import { setLocalStrorage } from "../../assets/js/common.login";
//service
import Login from "../../service/login.service";

export default {
  components: {},
  setup() {
    const router = useRouter();
    const data = reactive({
      item: {
        userName: "",
        password: "",
      },
      error: {
        userName: "",
        password: "",
      },
      flag: true,
    });
    const login = async () => {
      try {
        for (const key in data.item) {
          if (data.item[key] == "") {
            data.error[key] = "Chưa nhập thông tin.";
            data.flag = true;
          }
        }
        if (!data.flag) {
          const document = await Login.login(data.item);
          if (document.status == "success") {
            setLocalStrorage(
              document["token"],
              document["position"],
              document["expiresIn"]
            );
            const allowedPositions = ["admin", "super-admin"];
            const routeName = allowedPositions.includes(document["position"])
              ? "dashboard"
              : "user";
            router.push({ name: routeName });
          } else {
            warning("Thất bại", "Kiểm tra tên đăng nhập và mật khẩu");
          }
        }
      } catch (error) {
        console.error("Error in login");
      }
    };
    const forgotPassword = async () => {
      router.push({ name: "forgotPassword" });
    };
    return {
      login,
      data,
      forgotPassword,
      checkMail,
      sanitizeInput,
    };
  },
};
</script>
<template>
  <div class="login container-fluid">
    <div class="row justify-content-around align-items-center vh-100">
      <div class="card shadow col-4">
        <div class="row justify-content-center">
          <!-- <router-link :to="{ name: 'user' }" class="col-3">
            <img
              src="../../assets/image/logo.png"
              style="width: 100%; height: 100%"
            />
          </router-link> -->
          <h4
            class="text-center mt-3 ml-3 col-12"
            style="color: var(--chocolate)"
          >
            Đăng nhập
          </h4>
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
                autocomplete="username"
                @blur="
                  () => {
                    let isCheck = checkMail(data.item.userName);
                    if (isCheck) {
                      data.error.userName = 'Sai định dạng email';
                      data.flag = true;
                    }
                  }
                "
                @input="
                  data.error.userName = '';
                  data.flag = false;
                "
                v-model="data.item.userName"
              />
              <div v-if="data.error.userName" class="invalid-error">
                {{ data.error.userName }}
              </div>
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
                autocomplete="current-password"
                @blur="
                  () => {
                    if (data.item.password != '')
                      data.item.password = sanitizeInput(data.item.password);
                    else {
                      data.error.password = 'Chưa nhập mật khẩu';
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
          <div
            class="form-group row justify-content-around"
            style="margin-top: 26px"
          >
            <button type="submit" class="btn btn-login col-sm-3 mx-2">
              Đăng nhập
            </button>
          </div>
        </form>
        <div class="col-12 text-center forgot title" @click="forgotPassword">
          Quên mật khẩu
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.forgot:hover {
  color: var(--chocolate);
  text-shadow: 0 0 2px rgba(245, 234, 111, 0.8);
}
</style>
