<script>
import { reactive, onMounted, onBeforeUnmount, ref, watch } from "vue";
import { useRouter } from "vue-router";
import io from "socket.io-client";
import socket from "../../socket";
//component
import Select from "../../components/select/selectdependent.vue";
import registration from "../../components/form/registration.form.vue";
//services
import loginService from "../../service/login.service";
//js

export default {
  components: { Select, registration },
  setup() {
    const router = useRouter();
    const position = ref("");
    const data = reactive({
      list: [
        {
          name: "Trang chủ",
          active: "homepage",
        },
        {
          name: "Bài viết",
          active: "post",
        },
        {
          name: "Liên hệ",
          active: "contact",
        },
      ],
      items: {},

      address: "",
      userName: "",
      active: "",
      noti: 0,
      sizeNoti: 1,
    });
    let intervalId = null;
    const logout = async () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("expiresIn");
      localStorage.removeItem("position");
      const document = await loginService.clearRefreshToken();
      router.push({ name: "login" });
    };

    watch(
      () => data.active,
      (newValue, oldValue) => {
        console.log(newValue, oldValue);
        socket.emit("message", "abc");
      }
    );
    socket.on("message", async (msg) => {
      console.log(msg);
      data.noti++;
    });
    const handleDelete = (value) => {
      try {
        console.log("xóa thông báo", value);
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
    onMounted(async () => {
      try {
        data.userName = localStorage.getItem("userName");
        position.value = localStorage.getItem("position");
        data.active = "homepage";
      } catch (error) {
        if (error.response) {
          console.log("Server-side errors", error.response.data);
        } else if (error.request) {
          console.log("Client-side errors", error.request);
        } else {
          console.log("Errors:", error.message);
        }
      }
    });

    onBeforeUnmount(() => {
      clearInterval(intervalId); // Xóa khoảng thời gian khi component bị hủy
    });
    return { data, position, logout, handleDelete };
  },
};
</script>
<template>
  <div class="header container-fluid m-0">
    <div
      class="row align-items-center justify-content-between"
      style="height: 100%"
    >
      <div class="ml-5">
        <img src="../../assets/image/logo.png" style="width: 50px" />
      </div>
      <div class="col m-0">
        <div class="d-flex flex-column m-0">
          <div class="row justify-content-between mb-2 m-0 p-0">
            <div class="col-8 row menu m-0 p-0">
              <router-link
                class="col-2"
                :class="value.active == data.active ? 'isActive' : ''"
                @click="data.active = value.active"
                v-for="(value, index) in data.list"
                :key="index"
                :to="{ name: value.active }"
                style="font-size: 16px; text-transform: uppercase"
              >
                {{ value.name }}
              </router-link>
            </div>
            <div class="col-4 row justify-content-end menu m-0 p-0">
              <div
                v-if="!position"
                class="col-3 m-0 p-0 mt-2"
                data-toggle="modal"
                data-target="#registrationModal"
                style="font-size: 16px"
              >
                Đăng ký
              </div>
              <div
                v-if="!position"
                style="border-right: 1px solid #ccc; height: 24px"
                class="mt-2"
              ></div>
              <div class="col-4" v-if="!position">
                <router-link :to="{ name: 'login' }" style="font-size: 16px"
                  >Đăng nhập
                </router-link>
              </div>

              <!-- Noti -->
              <div class="header__noti col-1 m-0 p-0 mr-2">
                <div class="header__noti-wrap">
                  <span
                    class="material-symbols-outlined text-warning btn header__noti-icon"
                    role="button"
                  >
                    notifications
                  </span>
                  <div
                    v-if="data.sizeNoti == 0"
                    class="header__noti-list header__noti-list-no-noti mt-5 text-center"
                  >
                    <img
                      src="../../assets/image/background.jpg"
                      class="header__noti-no-noti-img"
                    />
                    <p
                      class="header__noti-list-no-noti-msg p-0 m-0 mt-3 text-center"
                      @click="data.sizeNoti = data.sizeNoti + 2"
                    >
                      chưa có thông báo {{ data.sizeNoti }}
                    </p>
                  </div>

                  <!--  have noti -->
                  <div
                    v-else
                    class="header__noti-list header__noti-list-noti mt-5"
                  >
                    <p
                      class="p-1 p-0 my-2 title"
                      style="font-weight: 500; font-size: 16px"
                    >
                      Thông báo
                    </p>
                    <hr class="p-0 m-0" />
                    <div
                      class="row m-0 p-0 dropdown-item"
                      v-for="(value, index) in data.list"
                      :key="index"
                      v-show="index + 1 <= data.sizeNoti"
                    >
                      <a class="px-1 col-11">{{ value }}</a>
                      <span
                        class="material-symbols-outlined text-danger mr-2 close-icon"
                        style="
                          font-size: 1.2rem;
                          line-height: 2;
                          align-item: center;
                        "
                        @click.stop="handleDelete(value._id)"
                        >close</span
                      >
                      <hr class="col-12 m-0 p-0" />
                    </div>
                    <button
                      class="header__noti-list-noti-msg my-3 btn w-100 btn-login"
                      @click="data.sizeNoti = data.sizeNoti + 2"
                    >
                      xem thêm
                    </button>
                  </div>

                  <span class="notification-badge">{{ data.noti }}</span>
                </div>
              </div>
              <!-- Info -->
              <div
                class="dropdown col-4 m-0 p-0"
                v-if="position"
                style="position: relative; z-index: 1"
              >
                <a
                  class="btn dropdown-toggle"
                  style="border: none; font-size: 16px"
                  role="button"
                  data-toggle="dropdown"
                  aria-expanded="false"
                >
                  {{ data.userName }}
                </a>

                <div class="dropdown-menu p-0">
                  <router-link
                    :to="{ name: 'userInfo' }"
                    class="dropdown-item px-1"
                    >Thông tin cá nhân</router-link
                  >
                  <router-link
                    :to="{ name: 'changePassword' }"
                    class="dropdown-item px-1"
                    >Đổi mật khẩu</router-link
                  >
                  <a class="dropdown-item text-danger px-1" @click="logout"
                    >Đăng xuất</a
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <registration></registration>
  </div>
</template>
<style scoped>
.header__noti {
  align-items: center;
  width: 150px;
}
.header__noti-wrap {
  position: relative;
}
.header__noti-list::after {
  content: "";
  position: absolute;
  right: 0px;
  top: -18px;
  border-width: 10px;
  border-style: solid;
  border-color: transparent transparent rgb(241, 243, 241) transparent;
  cursor: default;
}
.header__noti-icon {
  font-size: 1.6rem;
  color: red;
  margin-top: -2px;
}
.header__noti-list {
  position: absolute;
  top: 100%;
  right: 0px;
  background-color: rgb(241, 243, 241);
  width: 400px;
  border: solid 1px #fff;
  border-radius: 2px;
  box-shadow: 0 2px 10px 2px #ccc;
  z-index: 1;
  display: none;
  animation: fadeInd ease-in 0.5s;
}

.header__noti-list-no-noti {
  padding: 20px 0;
}

.header__noti-no-noti-img {
  width: 50%;
}

.header__noti-wrap:hover .header__noti-list {
  display: block;
  cursor: default;
}
.header__noti-list-noti-msg {
  text-transform: uppercase;
}
.header__noti-list-noti-msg:hover {
  color: white;
  font-weight: 600;
  text-decoration: underline;
  text-transform: uppercase;
}
.close-icon:hover {
  font-weight: 800;
  scale: 1.2;
}

.header {
  height: 10vh;
}
.menu div {
  top: 3.5px;
  color: var(--black-light);
  transition: color 0.3s ease;
  text-transform: uppercase;
}

a {
  color: #222000ed;
  font-weight: 400;
}
a:hover {
  color: var(--chocolate);
  opacity: 1;
  cursor: pointer;
}
.isActive {
  color: var(--chocolate);
  font-weight: 600;
}
.dropdown-menu > * {
  z-index: 1000 !important;
}
.menu div:hover {
  color: var(--chocolate);
  opacity: 1;
  cursor: pointer;
}
.dropdown-toggle:active {
  border: none !important;
}

.dropdown-item:hover {
  text-decoration: none !important;
}
.dropdown-item:hover > * {
  text-decoration: none;
}
.notification-badge {
  position: absolute;
  top: -2px;
  right: -4px;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 0px 6px;
  font-size: 12px;
}
</style>
