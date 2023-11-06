<script>
import { reactive, ref } from "vue";
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
    const togglePassword = ref(false);
    const login = async () => {
      try {
        for (const key in data.item) {
          if (data.item[key] == "") {
            data.error[key] = "Chưa nhập thông tin.";
            data.flag = true;
            console.log(key);
          }
        }
        if (!data.flag) {
          const document = await Login.login(data.item);
          if (document.status == "success") {
            setLocalStrorage(
              document["token"],
              document["position"],
              document["userName"],
              document["expiresIn"]
            );
            const allowedPositions = ["admin", "super-admin"];
            // 2 người dùng
            // const routeName = allowedPositions.includes(document["position"])
            //   ? "dashboard"
            //   : "homepage";
            // router.push({ name: routeName });
            //3 người dùng
            if (document["position"] == "admin") {
              router.push({ name: "dashboard" });
            } else if (document["position"] == "super-admin") {
              router.push({ name: "dashboardSuperAdmin" });
            } else {
              router.push({ name: "homepage" });
            }
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
      togglePassword,
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
              src="../../assets/image/logo.png"
              style="width: 100%; height: 100%"
            />
          </div>
          <h4
            class="text-center mt-0 ml-3 col-12"
            style="color: var(--chocolate); text-transform: uppercase"
          >
            Đăng nhập
          </h4>
        </div>
        <form @submit.prevent="login" class="container mt-1">
          <div class="form-group row">
            <label for="inputUserName" class="col-3 col-form-label p-0 m-0"
              >Email :</label
            >
            <div class="col-9 m-0 p-0">
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
            <label for="inputPassword" class="col-3 col-form-label m-0 p-0"
              >Mật khẩu :</label
            >
            <div class="col-9 row m-0 p-0">
              <input
                :type="togglePassword ? 'text' : 'password'"
                class="form-control col-10"
                style="
                  border-top-right-radius: 0px;
                  border-bottom-right-radius: 0px;
                "
                id="inputPassword"
                autocomplete="current-password"
                @blur="
                  () => {
                    if (data.item.password == '') {
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
              <span
                v-if="togglePassword"
                class="material-symbols-outlined border m-0 p-0 pt-1 px-1 visibility col-2 text-center"
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
                class="material-symbols-outlined border m-0 p-0 pt-1 px-1 visibility col-2 text-center"
                style=""
                @click="
                  () => {
                    togglePassword = !togglePassword;
                  }
                "
              >
                visibility_off
              </span>
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
        <div
          class="col-12 p-0 m-0 text-center forgot title"
          @click="forgotPassword"
        >
          Quên mật khẩu
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.forgot:hover {
  color: var(--chocolate);
  text-shadow: 0 0 10px rgba(245, 234, 111, 0.8);
  scale: calc(1.05);
}
.title {
  text-transform: none;
}
.visibility {
  border-radius: 5px;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  background-color: #fff;
  cursor: pointer;
  height: 100%;
}
</style>
