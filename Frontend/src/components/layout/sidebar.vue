<script>
import { reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
//service
import loginService from "../../service/login.service";
export default {
  components: {},
  setup() {
    const router = useRouter();
    const route = useRoute();
    const data = reactive({
      item: [
        { name: "Thống kê", icon: "bar_chart_4_bars", active: "Dashboard" },
        { name: "Phòng", icon: "holiday_village", active: "Room" },
        {
          name: "Dịch vụ",
          icon: "energy_program_time_used",
          active: "service",
        },
        { name: "Chỉ số điện", icon: "offline_bolt", active: "Electric" },
        { name: "Đổi mật khẩu", icon: "key", active: "Password" },
        { name: "Đăng xuất", icon: "power_settings_new", active: "Logout" },
      ],
    });
    const logout = async () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("expiresIn");
      localStorage.removeItem("position");
      const document = await loginService.clearRefreshToken();
      router.push({ name: "Login" });
    };
    return { data, router, logout };
  },
};
</script>
<template>
  <div class="sidebar">
    <div></div>
    <div class="list">
      <ul>
        <li
          v-for="(value, index) in data.item"
          :key="index"
          class="pl-2 my-3"
          @click="
            () => {
              if (value.active === 'Logout') {
                logout();
                return;
              }
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
li div > * {
  color: var(--beige);
  display: inline-block;
}

li:hover > div > * {
  color: var(--yellow-light);
}
</style>
