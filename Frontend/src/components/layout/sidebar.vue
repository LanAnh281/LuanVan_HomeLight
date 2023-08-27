<script>
import { reactive, onMounted, watch } from "vue";
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
        { name: "Chỉ số nước", icon: "water_drop", active: "Water" },

        { name: "Đổi mật khẩu", icon: "key", active: "Password" },
        { name: "Đăng xuất", icon: "power_settings_new", active: "Logout" },
      ],
      active: "",
    });
    const logout = async () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("expiresIn");
      localStorage.removeItem("position");
      const document = await loginService.clearRefreshToken();
      router.push({ name: "Login" });
    };

    onMounted(() => {
      data.active = "Dashboard";
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
        style="object-fit: contain"
        class="col-4 mx-3"
      />
      <div class="col row mt-3">
        <p class="col-12" style="color: var(--beige)">Xin chào</p>
        <p class="col-12">Home light</p>
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
              if (value.active === 'Logout') {
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
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
}
.isActive {
  color: var(--yellow-light);
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
}
</style>
