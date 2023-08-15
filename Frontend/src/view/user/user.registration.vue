<script>
import { ref, reactive, onMounted, onUnmounted } from "vue";
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
      isImage: false,
    });
    const checkImage = (file) => {
      if (file != null || file != undefined) {
        data.isImage =
          file.endsWith(".png") || file.endsWith(".PNG") ? true : false;
        return data.isImage;
      }
    };
    onMounted(async () => {
      if (!checkCookieExistence("token")) {
        const document = await loginService.accessToken();
        setCookie("token", document.token, 1); //1 day
        setCookie("position", document.position, 1);
        token.value = getCookieValue("token");
      }
      const documents = await userService.getAll();
      data.items = documents.message;
      console.log("onMo");
      document.addEventListener("keydown", handleKeyDown);
    });
    onUnmounted(() => {
      console.log("onUn");
      document.removeEventListener("keydown", handleKeyDown);
    });

    return { token, data, checkImage };
  },
};
</script>
<template>
  <div v-if="token">
    <router-link :to="{ name: 'Account' }">Account</router-link>
    <div v-if="data.items">
      <div v-for="(item, index) in data.items" :key="index">
        <div
          class="image-container"
          v-if="
            checkImage(item.imagePrevious) &&
            (item.imagePrevious != null || item.imagePrevious != undefined)
          "
        >
          <img
            :src="`http://localhost:3000/api/users/getImg/${item.imagePrevious}`"
          />
        </div>
        <div
          v-if="
            !checkImage(item.imagePrevious) &&
            (item.imagePrevious != null || item.imagePrevious != undefined)
          "
        >
          <video controls width="400">
            <source
              :src="`http://localhost:3000/api/users/getImg/${item.imagePrevious}`"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
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
