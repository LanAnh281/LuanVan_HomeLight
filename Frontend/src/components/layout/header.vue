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
      sizeNoti: 2,
    });
    let intervalId = null;
    const isDropdownOpen = ref(false);
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
    const toggleDropdown = () => {
      try {
        isDropdownOpen.value = !isDropdownOpen.value;
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
        document.body.addEventListener("click", toggleDropdown);
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
    return { data, position, logout, toggleDropdown, isDropdownOpen };
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

              <div
                class="col-1 m-0 p-0 mr-2"
                v-if="position"
                style="position: relative; z-index: 1"
              >
                <span
                  class="material-symbols-outlined text-warning btn noti"
                  style="border: none; font-size: 24px"
                  role="button"
                  @click="toggleDropdown"
                >
                  notifications
                </span>
                <span class="notification-badge">{{ data.noti }}</span>
                <div
                  class="dropdown-menu p-0"
                  style="opacity: 1; background-color: white; top: 0px"
                  :class="{ show: isDropdownOpen }"
                >
                  <p class="p-1 p-0 m-0" style="font-weight: 500">Thông báo</p>
                  <hr class="p-0 m-0" />
                  <div
                    class="row m-0 p-0"
                    v-for="(value, index) in data.list"
                    :key="index"
                    v-show="index + 1 <= data.sizeNoti"
                  >
                    <a class="dropdown-item px-1 col-10">{{ value }}</a>
                    <span
                      class="material-symbols-outlined text-danger text-center col-1 mr-2"
                      style="font-size: 1.2rem"
                      >close</span
                    >
                    <hr class="col-12 m-0 p-0" />
                  </div>
                  <div @click="data.sizeNoti = data.sizeNoti + 2">xem thêm</div>
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
.header {
  height: 10vh;
}
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
}
a {
  color: #222000ed;
  font-weight: 400;
}
a:hover {
  color: var(--chocolate);
  opacity: 0.8;
  cursor: pointer;
}
.isActive {
  color: var(--chocolate);
  font-weight: 600;
}
.dropdown-menu > * {
  z-index: 1000 !important;
}

.dropdown-toggle:active {
  border: none !important;
}
.dropdown-item:hover {
  text-decoration: none !important;
}
.notification-badge {
  position: absolute;

  top: 0px;
  right: -3px;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 0px 6px;
  font-size: 12px;
}
.notification-dropdown {
  position: absolute;
  top: 68px;
  right: 0;
  width: 400px;
  max-height: calc(85vh - 120px); /* Adjust this value as needed */
  overflow-y: auto;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 10px;
  margin-right: 14px;
  z-index: 99999;
  /* display: grid;
  grid-template-columns: 250px 100px;
  grid-gap: 10px; */
}
.notification-dropdown::before {
  content: "";
  position: absolute;
  top: -10px;
  left: calc(50% - 18px);
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid white;
}
.markAllAsRead {
  border: 1px solid rgb(188, 229, 255);
  border-radius: 8px;
  background-color: rgb(188, 229, 255);
  font-size: 12px;
  padding: 5px;
  color: rgb(69, 69, 246);
  font-weight: bold;
}
.markUnread {
  border: 1px solid rgb(188, 229, 255);
  border-radius: 8px;
  /* background-color:  rgb(188, 229, 255); */
  font-size: 12px;
  padding: 5px;
  color: rgb(69, 69, 246);
  font-weight: bold;
}
.color-dark {
  color: var(--dark);
}
.border-nav {
  border: 1px solid var(--gray);
  border-radius: 5px;
}
.avatar {
  width: 50px;
  height: 50px;
}
.italic-text {
  font-style: italic;
}
.cursor-pointer {
  cursor: pointer;
}
.font-size-13 {
  font-size: 13px;
}
.notification-icon {
  position: relative;
}
.notification-dot {
  position: absolute;
  top: 37%;
  left: 60%;
  transform: translate(-50%, -50%);
  width: 17px;
  height: 17px;
  background-color: var(--red);
  border-radius: 50%;
  display: inline-block;
  color: white;
  font-weight: bold;
  text-align: center;
  line-height: 17px;
  margin-left: 5px;
  cursor: pointer;
}
.clearNotification {
  position: sticky;
  bottom: 10px; /* Adjust this value as needed */
  width: 100%;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
  padding: 10px; /* Add padding for better visibility */
  font-weight: bold;
}
.clearNotification::after {
  content: "";
  position: absolute;
  top: 128%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 20px;
  background-color: rgba(255, 255, 255, 1);
  backdrop-filter: blur(10px);
}
</style>
