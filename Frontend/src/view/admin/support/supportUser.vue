<script>
import { reactive, ref, onMounted, onBeforeUnmount, computed } from "vue";
import { matchedRouteKey, useRoute, useRouter } from "vue-router";
//service
import notificationService from "../../../service/notification.service";
import boardinghouseService from "../../../service/boardinghouse.service";
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
      userId: "",
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
        const documentBoarding = await boardinghouseService.getAllUser();
        data.userId = documentBoarding.message[0].userId;

        const document = await notificationService.getAll();
        data.item = document.message.filter((item) => {
          const date = new Date(item.createdAt);
          return (
            item.receiver == data.userId &&
            date.getMonth() + 1 == data.selectDate.getMonth() + 1 &&
            date.getFullYear() == data.selectDate.getFullYear()
          );
        });
        console.log("noti:", data.item);
        data.item = data.item.map((item) => {
          const content = item.content.split(" - ");
          console.log(content);
          return {
            ...item,
            boarding: `${content[0]}-${content[1]}`,
            user: `${content[2].split(":")[1]}- ${content[3].split(":")[1]}`,
            content: content[4].split(":")[1],
            createdAt: formatDateTime(item.createdAt),
          };
        });
        console.log("noti:", data.item);
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
      Phản ánh của khách trọ tháng {{ data.selectDate.getMonth() + 1 }}/{{
        data.selectDate.getFullYear()
      }}
    </h5>
    <Table
      :data="data.setPage"
      :fields="['Nhà trọ', 'Khách trọ', 'Nội dung', 'Thời gian']"
      :titles="['boarding', 'user', 'content', 'createdAt']"
      :name="support"
      :action="true"
      :actionList="['chat']"
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
