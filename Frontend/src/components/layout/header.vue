<script>
import { reactive, onMounted, onBeforeUnmount, ref, watch } from "vue";
import { useRouter } from "vue-router";
import socket from "../../socket";
//component
import Select from "../../components/select/selectdependent.vue";
import registration from "../../components/form/registration.form.vue";
//services
import loginService from "../../service/login.service";
import user_notificationService from "../../service/user_notification.service";
//js
import { checkAccessToken } from "../../assets/js/common.login";
import internal from "stream";

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
        {
          name: "Hóa đơn",
          active: "billCustomer",
        },
      ],
      items: [],

      address: "",
      userName: "",
      active: "",
      noti: 0,
      sizeNoti: 2,
    });
    let intervalId = null;
    const isRegistration = ref(false);
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
        // socket.emit("message", "abc");
      }
    );

    const handleUpdate = async (value) => {
      try {
        console.log("update");
        // update user_not
        const documentUserNoti = await user_notificationService.update(value, {
          isRead: true,
          isDelete: false,
        });
        console.log(documentUserNoti);
        await refresh();
        //value là của notiId
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
    const handleDelete = async (value) => {
      try {
        console.log("xóa thông báo", value);
        const documentUserNoti = await user_notificationService.update(value, {
          isRead: true,
          isDelete: true,
        });
        console.log(documentUserNoti);
        await refresh();
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
    socket.on("noti", async (msg) => {
      await refresh();
    });
    const formatItem = (item) => {
      return item.replace(/ - /g, "<br>");
    };
    const refresh = async () => {
      try {
        if (position.value != null) {
          await checkAccessToken(router); //access token
          intervalId = setInterval(async () => {
            await checkAccessToken(router);
          }, 180 * 60 * 1001); // 60000 milliseconds = 1 minutes
          data.noti = 0;
          const documentUserNoti = await user_notificationService.getAllUser();
          data.items = documentUserNoti.message;
          const now = new Date();
          data.items = data.items.Notifications.map((item) => {
            const time =
              now.getTime() -
              new Date(item.User_Notification.createdAt).getTime();
            let previousTime = "";
            const minutes = Math.ceil(time / (60 * 1000));
            const hours = Math.ceil(time / (60 * 60 * 1000));
            const days = Math.ceil(time / (24 * 60 * 60 * 1000));
            if (minutes < 60) {
              previousTime = `${minutes} phút trước`;
            } else if (hours < 24) {
              previousTime = `${hours} giờ trước`;
            } else {
              previousTime = ` ${days}) ngày trước`;
            }
            if (item.User_Notification.isRead == false) {
              data.noti++;
            }
            return {
              ...item,
              time: previousTime,
            };
          });
        }
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
        let name = localStorage.getItem("userName");
        name = name.split(" ");
        if (name.length >= 2) {
          data.userName = `${name[name.length - 2]} ${name[name.length - 1]}`;
        } else data.userName = name[0];
        position.value = localStorage.getItem("position");
        data.active = "homepage";

        await refresh();
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
    return {
      data,
      position,
      logout,
      handleDelete,
      handleUpdate,
      isRegistration,
      formatItem,
    };
  },
};
</script>
<template>
  <div
    class="header container-fluid m-0"
    :style="{
      background:
        position != 'admin' && position != 'super-admin'
          ? 'white'
          : ' var(--light)',
    }"
  >
    <div
      class="row align-items-center justify-content-between"
      style="height: 100%"
    >
      <div class="ml-4 m-0 p-0">
        <img
          src="../../assets/image/logo.png"
          style="width: 50px; height: 50px"
        />
      </div>
      <div class="col m-0">
        <div class="d-flex flex-column m-0">
          <div class="row justify-content-between mb-2 m-0 p-0">
            <div class="col-8 row menu m-0 p-0">
              <router-link
                class="mr-3 ml-2"
                :class="value.active == data.active ? 'isActive' : ''"
                @click="data.active = value.active"
                v-for="(value, index) in data.list"
                :key="index"
                :to="{ name: value.active }"
                style="
                  font-size: 16px;
                  text-transform: uppercase;
                  line-height: 2;
                "
                v-show="position != 'admin' && position != 'super-admin'"
              >
                {{ value.name }}
              </router-link>
            </div>
            <div class="col-3 row justify-content-end menu p-0 m-0 float-right">
              <div
                v-if="!position"
                class="col-3 m-0 p-0 mt-1"
                data-toggle="modal"
                data-target="#registrationModal"
                style="font-size: 16px"
                @click="isRegistration = !isRegistration"
              >
                Đăng ký
              </div>
              <div
                v-if="!position"
                style="border-right: 1px solid #ccc; height: 24px"
                class="mt-2"
              ></div>
              <div class="col-4 m-0 p-0 px-2 mt-1" v-if="!position">
                <router-link :to="{ name: 'login' }" style="font-size: 16px"
                  >Đăng nhập
                </router-link>
              </div>

              <!-- Noti -->
              <div v-if="position" class="header__noti col-1 m-0 p-0 mr-2">
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
                      Chưa có thông báo {{ data.sizeNoti }}
                    </p>
                  </div>

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
                      class="row m-0 p-1 dropdown-item justify-content-around align-item-center"
                      v-for="(value, index) in data.items"
                      :key="index"
                      v-show="index + 1 <= data.sizeNoti"
                      @click="handleUpdate(value._id)"
                    >
                      <a
                        class="px-1 col-11"
                        style="text-transform: none"
                        v-html="formatItem(value.content)"
                      ></a>

                      <span
                        class="material-symbols-outlined text-danger cancle-icon col-1 px-1 float-right"
                        @click.stop="handleDelete(value._id)"
                        >close</span
                      >

                      <a
                        class="px-1"
                        style="display: block"
                        :style="{
                          color: !value.User_Notification.isRead ? 'blue' : '',
                        }"
                      >
                        {{ value.time }}</a
                      >
                      <hr class="col-12 m-0 p-0" />
                    </div>
                    <button
                      v-if="data.sizeNoti < data.items.length"
                      class="header__noti-list-noti-msg my-3 btn w-100 btn-login"
                      @click="data.sizeNoti = data.sizeNoti + 2"
                    >
                      xem thêm
                    </button>
                  </div>

                  <span class="notification-badge" v-if="data.noti > 0">{{
                    data.noti
                  }}</span>
                </div>
              </div>
              <!-- Info -->
              <div
                v-if="position"
                class="dropdown col-6 m-0 p-0"
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
                  <!-- <router-link
                    :to="{ name: 'userInfo' }"
                    class="dropdown-item px-1"
                    >Thông tin cá nhân</router-link
                  > -->
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
    <registration v-if="isRegistration"></registration>
    <hr style="border-color: rgb(230, 221, 221)" class="m-0" width="" />
  </div>
</template>
<style scoped>
.header__noti {
  align-items: center;
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
  width: 50px;
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
  text-transform: lowercase;
}
.header__noti-list-noti-msg:hover {
  color: white;
  font-weight: 600;
  text-decoration: underline;
  text-transform: lowercase;
}
.cancle-icon:hover {
  font-weight: 800;
  scale: 1.2;
}

.header {
  height: 8vh;
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
  text-decoration: none;
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
  right: -14px;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 0px 4px;
  font-size: 12px;
}
</style>
