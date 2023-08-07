<template>
  <div class="body">
    <p>Account</p>
    <router-link :to="{ name: 'Login' }">Login </router-link>
    <router-link :to="{ name: 'User' }">User </router-link>
  </div>
</template>
<script>
import { onMounted } from "vue";
import {
  checkCookieExistence,
  getCookieValue,
} from "../../../assets/js/common.login";
import loginService from "../../../service/login.service";
export default {
  components: {},
  setup() {
    onMounted(async () => {
      console.log(checkCookieExistence("token"));
      if (!checkCookieExistence("token")) {
        console.log("đang đăng nhập lại");
        const document = await loginService.accessToken();
        console.log(document);
      }
    });
  },
};
</script>
