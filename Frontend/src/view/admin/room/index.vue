<script>
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
//service
import loginService from "../../../service/login.service";
//asset/js
import {
  getCookieValue,
  checkCookieExistence,
  setCookie,
} from "../../../assets/js/common.login";
export default {
  components: {},
  setup() {
    const router = useRouter();
    const token = ref(getCookieValue("token"));
    const data = reactive({
      items: {
        name: "",
        area: "",
        price: "",
      },
    });

    onMounted(async () => {
      // if (!checkCookieExistence("token")) {
      //   const document = await loginService.accessToken();
      //   setCookie("token", document.token, 1); //1 day
      //   setCookie("position", document.position, 1);
      //   token.value = getCookieValue("token");
      // }
    });
    return { token, data };
  },
};
</script>
<template>
  <div class="body">room</div>
</template>
<style scope></style>
