<template>
  <div class="navbar">
    <p>Navbar</p>
    <button class="btn btn-primary float-right my-1" @click="signOut">
      Đăng xuất
    </button>
  </div>
</template>

<script>
import { useRoute, useRouter } from "vue-router";
import { clearCookieValue } from "../../assets/js/common.login";
import loginService from "../../service/login.service";
export default {
  components: {},
  setup() {
    const router = useRouter();
    const signOut = async () => {
      console.log("sign out");
      clearCookieValue();
      //clear refresh token saved in backend
      const document = await loginService.clearToken();
      router.push({ name: "Login" });
    };
    return {
      signOut,
    };
  },
};
</script>
