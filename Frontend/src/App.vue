<template>
  <div>
    <div v-if="isLoginPath == false">
      <Header></Header>
      <NavBar></NavBar>
      <div class="fluid-container">
        <div class="row m-0 p-0">
          <SideBar class="col-2"></SideBar>
          <span class="mr-2"></span>
          <router-view class="col"></router-view>
        </div>
        <Footer></Footer>
      </div>
    </div>
    <div v-if="isLoginPath">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import Footer from "./components/layout/footer.vue";
import NavBar from "./components/layout/navbar.vue";
import SideBar from "./components/layout/sidebar.vue";
import Header from "./components/layout/header.vue";
import { useRouter, useRoute } from "vue-router";
import { ref, watch, onMounted } from "vue";
export default {
  components: {
    SideBar,
    Header,
    Footer,
    NavBar,
  },
  setup() {
    const route = useRoute();
    const isLoginPath = ref(false);
    onMounted(() => {});
    watch(
      () => route.fullPath,
      (newPath, oldPath) => {
        if (newPath == "/login") isLoginPath.value = true;
        else {
          isLoginPath.value = false;
        }
        // Xử lý khi chuyển trang xảy ra
        console.log("Đã chuyển từ:", oldPath);
        console.log("Đã chuyển đến:", newPath);
        // Thực hiện các hành động khác khi chuyển trang xảy ra
      }
    );

    return {
      isLoginPath,
    };
  },
};
</script>
<style scoped></style>
