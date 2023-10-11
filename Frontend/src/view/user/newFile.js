import { onMounted } from "vue";

// import cheerio from('cheerio');
export default (await import("vue")).defineComponent({
  setup() {
    onMounted(async () => {
      // const documents = await axios.get(
      //   `https://www.anninhthudo.vn/trinh-phuong-an-dieu-chinh-gia-dien-truoc-ngay-25-10-post554485.antd`
      // );
      const documents = "";
      console.log("a", documents);
    });
    return {};
  },
});
