<script>
import { ref, reactive, onMounted } from "vue";
//service
import userService from "../../service/user.service";
import loginService from "../../service/login.service";
//asset/js
import {
  getCookieValue,
  checkCookieExistence,
  setCookie,
} from "../../assets/js/common.login";
export default {
  components: {},
  setup() {
    const token = ref(getCookieValue("token"));
    const data = reactive({
      items: {
        userName: "",
        identificationCard: "",
        imagePrevious: "",
        imageAfter: "",
        phone: "",
        address: "",
        email: "",
        content: "",
      },
    });

    onMounted(async () => {
      if (!checkCookieExistence("token")) {
        const document = await loginService.accessToken();
        setCookie("token", document.token, 10); //1 ngày
        setCookie("position", document.position, 10);
        token.value = getCookieValue("token");
      }
      const documents = await userService.getAll();
      data.items = documents.message;
    });
    return { token, data };
  },
};
</script>
<template>
  <div v-if="token"></div>
</template>
<style scope></style>
