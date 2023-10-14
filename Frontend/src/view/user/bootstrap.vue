<!-- <template>
  <div class="hello"></div>
</template>

<script>
import { onMounted } from "vue";
import axios from "axios";
import cheerio from "cheerio";
export default {
  setup() {
    onMounted(async () => {
      const documents = await axios.get(
        `https://www.anninhthudo.vn/trinh-phuong-an-dieu-chinh-gia-dien-truoc-ngay-25-10-post554485.antd`
      );
      const data = documents.data;
      const $ = cheerio.load(data);
      const title = $("h1").text(); // Điều này phải được điều chỉnh để phù hợp với cấu trúc HTML của trang web nguồn.
      const content = $("p").text(); // Điều này cũng phải điều chỉnh.
      // const documents = "";
      console.log("a", title, content);
    });
    return {};
  },
};
</script> -->
<template>
  <div>
    <!-- <qrcode-vue :value="data.qrCodeUrl"></qrcode-vue> -->
    <img :src="data.qrCodeUrl" alt="QR Code" />
  </div>
</template>

<script>
import VueQrcode from "vue-qrcode";
import axios from "axios";
import { onMounted, reactive } from "vue";
export default {
  components: {
    VueQrcode,
  },
  setup() {
    const data = reactive({ qrCodeUrl: "" });
    onMounted(async () => {
      const url = await axios.get(`http://localhost:3000/api/test`);
      // Lấy URL của mã QR từ phía backend (thông qua API hoặc cách khác)
      // Gán giá trị qrCodeURL từ dữ liệu được lấy từ phía server
      console.log(url);
      data.qrCodeUrl = url.data.qrCodeUrl;
    });
    return { data };
  },
};
</script>
