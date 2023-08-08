<script>
import { reactive, onBeforeMount } from "vue";
import registrationService from "../../service/registration.service";
export default {
  components: {},
  setup() {
    const data = reactive({
      //   items: [],
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
    onBeforeMount(async () => {
      const documents = await registrationService.getAll();
      data.items = documents.message;
    });
    return { data };
  },
};
</script>
<template>
  <div v-if="data.items">
    <div v-for="(item, index) in data.items" :key="index">
      <div class="image-container">
        <img
          :src="`http://localhost:3000/api/registration/getImg/${item.imagePrevious}`"
        />
      </div>
    </div>
  </div>
</template>
<style scoped>
.image-container {
  width: 300px; /* Đặt kích thước của khu vực chứa hình ảnh */
  height: 200px;
  overflow: hidden; /* Ẩn phần bị tràn ra ngoài khu vực */
}

.image-container img {
  width: 100%; /* Đảm bảo hình ảnh chiếm toàn bộ kích thước của khu vực chứa */
  height: 100%; /* Đảm bảo hình ảnh chiếm toàn bộ kích thước của khu vực chứa */
  object-fit: contain; /* Hiển thị hình ảnh mà không bị biến dạng */
}
</style>
