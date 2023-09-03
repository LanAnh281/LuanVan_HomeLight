<script>
import { reactive, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
//service
import loginService from "../../service/login.service";
import userService from "../../service/user.service";
export default {
  components: {},
  setup() {
    const router = useRouter();
    const route = useRoute();
    const data = reactive({
      item: [
        { name: "Thống kê", icon: "bar_chart_4_bars", active: "dashboard" },
        { name: "Phòng", icon: "holiday_village", active: "room" },
        { name: "Chỉ số điện", icon: "offline_bolt", active: "electric" },
        { name: "Chỉ số nước", icon: "water_drop", active: "water" },
        {
          name: "Dịch vụ",
          icon: "energy_program_time_used",
          active: "service",
        },
        {
          name: "Báo cáo",
          icon: "text_snippet",
          active: "report",
        },
        {
          name: "Tài khoản",
          icon: "manage_accounts",
          active: "account",
        },
        { name: "Đổi mật khẩu", icon: "key", active: "changePassword" },
        { name: "Đăng xuất", icon: "power_settings_new", active: "logout" },
      ],
      active: "dashboard",
      user: { userName: "" },
    });
    const logout = async () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("expiresIn");
      localStorage.removeItem("position");
      const document = await loginService.clearRefreshToken();
      router.push({ name: "login" });
    };
    watch(
      () => route.fullPath,
      (newPath, oldPath) => {
        data.active = newPath.substring(newPath.lastIndexOf("/") + 1);
        console.log("Path:", data.active);
      }
    );

    onMounted(async () => {
      const document = await userService.get("user");
      data.user = document.message;
    });
    return { data, router, logout };
  },
};
</script>
<template>
  <div class="sidebar px-0">
    <div
      style="width: 100%"
      class="row justify-items-around align-items-center"
    >
      <img
        src="../../assets/image/logo.png"
        style="
          object-fit: contain;
          box-shadow: 0 0 20px 1px rgba(255, 255, 0, 0.3);
        "
        class="col-3 ml-4 mr-0 p-0"
      />
      <div class="col row mt-0">
        <div class="col-12 my-3">
          <span
            style="
              display: block;
              color: var(--beige);
              text-shadow: 0 0 5px #ffff;
              margin-bottom: 12px;
            "
          >
            Xin chào</span
          >
          <span style="color: var(--beige); text-shadow: 0 0 5px #ffff">
            {{ data.user.userName }}
          </span>
        </div>
      </div>
    </div>
    <!-- Sử dụng inline styles để tùy chỉnh dòng gạch ngang -->
    <hr style="border-color: rgb(230, 221, 221)" class="m-0" width="" />
    <div class="list mx-2">
      <ul>
        <li
          v-for="(value, index) in data.item"
          :key="index"
          class="pl-2 my-3"
          :class="data.active == value.active ? 'isActive' : ''"
          @click="
            () => {
              if (value.active === 'logout') {
                logout();
                return;
              }
              data.active = value.active;
              router.push({ name: value.active });
            }
          "
        >
          <div>
            <span class="material-symbols-outlined mr-2">
              {{ value.icon }}
            </span>
            <p class="mb-0">{{ value.name }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped>
ul {
  list-style: none;
}
li {
  display: block;
}
.list li > div {
  display: flex;
  align-items: center; /* Căn chỉnh theo chiều dọc */
}
.material-symbols-outlined {
  font-size: 1.2rem;
}
li div > * {
  color: var(--beige);
  display: inline-block;
}

li:hover > div > * {
  color: var(--yellow-light);
  text-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
}
.isActive {
  color: var(--yellow-light);
  text-shadow: 0 0 8px rgba(255, 255, 255, 1);
}
</style>
