<script>
import { reactive, ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
//service
import notificationService from "../../../service/notification.service";
//component
import Table from "../../../components/table/table.vue";
import paginationVue from "../../../components/pagination/pagination.vue";
import Select from "../../../components/select/select.vue";
// js
import { checkAccessToken } from "../../../assets/js/common.login";
import {
  formatDateTime,
  formatCurrency,
} from "../../../assets/js/format.common";
export default {
  components: { Select, Table, paginationVue },
  setup() {
    let intervalId = null;
    const router = useRouter();
    const data = reactive({
      item: [{}],
      setPage: [],
      currentPage: 1,
      sizePage: 10,
      length: 0,
      totalPage: 0,
      selectDate: new Date(),
    });

    const now = new Date();
    data.length = computed(() => (data.item ? data.item.length : 0));
    data.totalPage = computed(() => {
      return data.item ? Math.ceil(data.item.length / data.sizePage) : 0;
    });

    data.setPage = computed(() => {
      return data.item
        ? data.item.slice(
            (data.currentPage - 1) * data.sizePage,
            data.currentPage * data.sizePage
          )
        : [];
    });
    const refresh = async () => {
      try {
        const document = await notificationService.getAll();
        data.item = document.message.filter((item) => {
          const date = new Date(item.createdAt);
          return (
            item.sender == "to super-admin" &&
            date.getMonth() + 1 == data.selectDate.getMonth() + 1 &&
            date.getFullYear() == data.selectDate.getFullYear()
          );
        });
        data.item = data.item.map((item) => {
          const content = item.content.split(" - ");
          return {
            ...item,
            userName: content[0],
            content: content[1],
            createdAt: formatDateTime(item.createdAt),
          };
        });
      } catch (error) {
        if (error.response) {
          console.log("Server-side errors", error.response.data);
        } else if (error.request) {
          console.log("Client-side errors", error.request);
        } else {
          console.log("Errors:", error.message);
        }
      }
    };
    const handleDate = async (value) => {
      data.selectDate = new Date(value.target.value);
      await refresh();
    };
    onMounted(async () => {
      try {
        await checkAccessToken(router); //access token
        intervalId = setInterval(async () => {
          await checkAccessToken(router);
        }, 180 * 60 * 1001); // 60000 milliseconds = 1 minutes
        data.selectDate = new Date();
        await refresh();
      } catch (error) {
        if (error.response) {
          console.log("Server-side errors", error.response.data);
        } else if (error.request) {
          console.log("Client-side errors", error.request);
        } else {
          console.log("Errors:", error.message);
        }
      }
    });
    onBeforeUnmount(() => {
      clearInterval(intervalId); // Xóa khoảng thời gian khi component bị hủy
    });
    return { data, handleDate };
  },
};
</script>
<template>
  <div class="body">
    <div class="border-radius mb-3 row m-0 justify-content-start">
      <input
        type="month"
        class="border rounded py-1 text-center col-2 mt-2 mx-1"
        style="height: 33px; background-color: var(--background)"
        @input="handleDate"
      />
    </div>
    <h5 class="title text-center">
      Phản ánh của chủ trọ tháng {{ data.selectDate.getMonth() + 1 }}/{{
        data.selectDate.getFullYear()
      }}
    </h5>
    <Table
      :data="data.setPage"
      :fields="['Chủ trọ', 'Nội dung', 'Thời gian']"
      :titles="['userName', 'content', 'createdAt']"
      :action="false"
      :actionList="['mail', 'notifications']"
    >
    </Table>
    <paginationVue
      :currentPage="data.currentPage"
      :totalPage="data.totalPage"
      :size="data.sizePage"
      :length="data.length"
      @page="(value) => (data.currentPage = value)"
      @previous="
        () => {
          if (data.currentPage > 1) {
            data.currentPage = data.currentPage - 1;
          }
        }
      "
      @next="
        () => {
          if (data.currentPage < data.totalPage) {
            data.currentPage = data.currentPage + 1;
          }
        }
      "
    ></paginationVue>
  </div>
</template>
<style scoped>
.body {
  height: 100vh; /* Đặt chiều cao cho .body theo chiều cao của viewport */
  overflow: auto; /* Cho phép nội dung trượt khi vượt quá chiều cao của .body */
}
</style>
