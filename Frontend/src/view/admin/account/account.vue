<script>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
//service

//asset/js
import { checkAccessToken } from "../../../assets/js/common.login";
export default {
  components: {},
  setup() {
    const router = useRouter();
    const data = reactive({
      items: {},
    });
    let intervalId = null;
    onMounted(async () => {
      await checkAccessToken(router);
      intervalId = setInterval(async () => {
        await checkAccessToken(router);
      }, 180 * 60 * 1001); // 60000 milliseconds = 1 minutes
    });
    onBeforeUnmount(() => {
      clearInterval(intervalId); // Xóa khoảng thời gian khi component bị hủy
    });

    return { data };
  },
};
</script>
<template>
  <div class="body">
    <p>Account</p>
  </div>
</template>
<style scoped>
.body {
  height: calc(100vh - var(--footer));
}
</style>
