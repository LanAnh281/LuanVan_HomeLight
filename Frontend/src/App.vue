<script>
import Footer from "./components/layout/footer.vue";
import NavBar from "./components/layout/navbar.vue";
import SideBar from "./components/layout/sidebar.vue";
import Header from "./components/layout/header.vue";
import { useRouter, useRoute } from "vue-router";
import { ref, watch, onMounted } from "vue";
// import { getCookieValue } from "./assets/js/common.login";
export default {
  components: {
    SideBar,
    Header,
    Footer,
    NavBar,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const position = ref("");
    const isLoginPath = ref(false);
    onMounted(() => {
      position.value = localStorage.getItem("position");
      console.log("pos", position.value);
    });
    watch(
      () => route.fullPath,
      (newPath, oldPath) => {
        if (
          newPath == "/login" ||
          newPath == "/forgotPassword" ||
          newPath == "/resetPassword" ||
          newPath.includes("/resetPassword")
        )
          isLoginPath.value = true;
        else {
          isLoginPath.value = false;
        }
        // Xử lý khi chuyển trang xảy ra
        console.log("Đã chuyển từ:", oldPath);
        console.log("Đã chuyển đến:", newPath);
        position.value = localStorage.getItem("position");
        console.log("pos", position.value);
        // Thực hiện các hành động khác khi chuyển trang xảy ra
      }
    );

    return {
      isLoginPath,
      position,
      route,
    };
  },
};
</script>

<template>
  <div>
    <!-- Login page -->
    <template v-if="isLoginPath">
      <router-view></router-view>
    </template>
    <!-- Else -->
    <div v-if="isLoginPath == false">
      <!-- user -->
      <template v-if="position != 'admin' && position != 'super-admin'">
        <Header></Header>
        <router-view></router-view>
      </template>
      <!-- Super Admin -->
      <template v-else-if="position == 'super-admin'">
        <Header></Header>
        <SideBar class="col-2"></SideBar>
        <router-view class="col-10"></router-view>
      </template>
      <!-- Admin -->
      <template v-else-if="position == 'admin'">
        <Header></Header>
        <SideBar class="col-2"></SideBar>
        <router-view class="col-10"></router-view>
      </template>

      <Footer></Footer>
    </div>
  </div>
</template>
<style scoped>
.none {
  display: none;
}
</style>
