<script>
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
//service
import loginService from "../../../service/login.service";
//asset/js

//components
import select from "../../../components/select/selectdependent.vue";
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

    onMounted(async () => {});
    return { token, data };
  },
};
</script>
<template>
  <div class="body m-0">
    <div class="border-radius my-3">Room</div>
    <div class="border-radius my-3"></div>
  </div>
</template>
<style scope>
.body {
  height: calc(100vh - var(--footer));
}
.border-radius {
  border: 1px solid #eae6e6;
  border-radius: 5px;
}
</style>
