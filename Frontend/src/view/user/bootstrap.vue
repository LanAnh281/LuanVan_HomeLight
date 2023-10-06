<!-- <template>
  <div>
    <div v-for="notification in visibleNotifications" :key="notification.id">
      {{ notification.message }}
    </div>
    <div ref="scrollTarget" style="height: 1px"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      notifications: [], // Danh sách thông báo đã tải
      visibleNotifications: [], // Danh sách thông báo hiển thị
      pageSize: 2, // Số lượng thông báo mỗi lần tải
      currentPage: 1, // Trang hiện tại
      loading: false, // Biến để kiểm tra xem đang tải hay không
    };
  },
  methods: {
    loadMore() {
      if (this.loading) return; // Tránh tải khi đang tải
      this.loading = true;

      // Tải thêm thông báo sau một khoảng thời gian
      setTimeout(() => {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.visibleNotifications = [
          ...this.visibleNotifications,
          ...this.notifications.slice(startIndex, endIndex),
        ];
        this.currentPage++;
        this.loading = false; // Kết thúc tải
      }, 1000); // Đợi 1 giây trước khi tải thêm
    },
    handleScroll() {
      const scrollTarget = this.$refs.scrollTarget;
      const scrollPosition = window.scrollY + window.innerHeight;

      // Kiểm tra nếu người dùng đã kéo xuống cuối trang
      if (scrollPosition >= scrollTarget.offsetTop) {
        this.loadMore();
      }
    },
  },
  mounted() {
    // Simulate loading notifications from an API
    // Replace this with actual API calls
    setTimeout(() => {
      this.notifications = [
        { id: 1, message: "Thông báo 1" },
        { id: 2, message: "Thông báo 2" },
        { id: 1, message: "Thông báo 1" },
        { id: 2, message: "Thông báo 2" },
        { id: 1, message: "Thông báo 1" },
        { id: 2, message: "Thông báo 2" },
        { id: 1, message: "Thông báo 1" },
        { id: 2, message: "Thông báo 2" },
        // ...
        { id: 100, message: "Thông báo 100" },
      ];
      this.loadMore(); // Bắt đầu tải thông báo
    }, 1000);

    // Thêm sự kiện lắng nghe cuộn trang
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    // Gỡ bỏ sự kiện lắng nghe cuộn trang khi component bị hủy
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script> -->
<template>
  <div>
    a
    <quill-editor v-model="content" :options="editorOptions"></quill-editor>
  </div>
</template>

<script>
import { ref } from "vue";
import "quill/dist/quill.snow.css"; // Import CSS của Quill
import { quillEditor } from "vue-quill-editor";

export default {
  components: {
    quillEditor,
  },
  setup() {
    const content = ref("");
    const editorOptions = {
      // Các tùy chọn của trình soạn thảo
      modules: {
        toolbar: [
          [{ header: "1" }, { header: "2" }, { font: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          ["bold", "italic", "underline"],
          ["image", "code-block"],
        ],
      },
    };

    return {
      content,
      editorOptions,
    };
  },
};
</script>
