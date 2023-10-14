<template>
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
</script>
