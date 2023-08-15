<script>
import { ref, onMounted } from "vue";
import {
  checkCookieExistence,
  getCookieValue,
  setCookie,
} from "../../../assets/js/common.login";
import loginService from "../../../service/login.service";
export default {
  components: {},
  setup() {
    const token = ref(getCookieValue("token"));

    onMounted(async () => {
      if (!checkCookieExistence("token")) {
        const document = await loginService.accessToken();
        setCookie("token", document.token, 10); //1 ngày
        setCookie("position", document.position, 10);
        token.value = getCookieValue("token");
      }
    });
    return { token };
  },
};
</script>
<template>
  <div class="body" v-if="token">
    <p>Account</p>
    <router-link :to="{ name: 'Login' }">Login </router-link>
    <router-link :to="{ name: 'User' }">User </router-link>
    <router-link :to="{ name: 'User.registration' }"
      >User.registration
    </router-link>
  </div>
</template>
<style></style>
