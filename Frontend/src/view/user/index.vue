<script>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
//service

//asset/js
import { checkAccessToken } from "../../assets/js/common.login";
export default {
  components: {},
  setup() {
    const router = useRouter();
    const data = reactive({
      items: [
        { area: "10" },
        { area: "20" },
        { area: "20" },
        // { area: "20" },
        // { area: "10" },
        // { area: "20" },
        // { area: "20" },
        // { area: "20" },
        // { area: "10" },
        // { area: "20" },
        // { area: "20" },
        // { area: "20" },
      ],
    });
    let intervalId = null;
    const position = ref("");
    onMounted(async () => {
      position.value = localStorage.getItem("Position");
      if (position.value != null) {
        checkAccessToken(router);
        intervalId = setInterval(async () => {
          await checkAccessToken(router);
        }, 30 * 60 * 1001); // 60000 milliseconds = 1 minutes
      }
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
    <div class="row">
      <div class="col-12" v-for="(value, index) in data.items" :key="index">
        <img src="" />
        <span>Diện tích: {{ value.area }} m²</span>
        <span>Giá tiền</span>
        <p>Địa chỉ</p>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
