<!-- -Tạo thông báo cho chủ trọ -->
<script>
import { ref, onMounted, reactive, computed } from "vue";

//service
import NotificationService from "../../../service/notification.service";
//component
import Add from "./add.vue";
import Table from "../../../components/table/table.vue";
import View from "./view.vue";
import paginationVue from "../../../components/pagination/pagination.vue";
//js
import { formatDateTime } from "../../../assets/js/format.common";
export default {
  components: { Add, Table, View, paginationVue },
  setup() {
    const data = reactive({
      item: [{ content: "" }],
      setPage: [],
      searchPage: [],
      searchText: "",
      currentPage: 1,
      sizePage: 10,
      length: 0,
      totalPage: 0,
      selectNoti: "",
      selectDate: { month: "", year: "" },
    });
    const isNotification = ref(false);
    const isNotiModal = ref(false);
    data.length = computed(() => (data.item ? data.item.length : 0));
    data.totalPage = computed(() =>
      data.item ? Math.ceil(data.item.length / data.sizePage) : 0
    );
    data.searchPage = computed(
      () => (
        (data.currentPage = 1),
        data.item
          ? data.item.filter((item) =>
              item.content
                .toLowerCase()
                .includes(data.searchText.toLocaleLowerCase())
            )
          : []
      )
    );
    data.setPage = computed(() =>
      data.searchPage
        ? data.searchPage.slice(
            (data.currentPage - 1) * data.sizePage,
            data.currentPage * data.sizePage
          )
        : []
    );
    const handleCreate = async () => {
      try {
        // socket.on("noti", (msg) => console.log(msg));
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
    };
    const handleView = (value) => {
      try {
        data.selectNoti = value;

        isNotiModal.value = !isNotiModal.value;
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
      try {
        const date = new Date(value.target.value);
        data.selectDate = {
          month: date.getMonth() + 1,
          year: date.getFullYear(),
        };
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
    };
    const refresh = async () => {
      try {
        const documentNoti = await NotificationService.getAllUser();
        data.item = documentNoti.message;

        data.item = data.item.filter((item) => {
          const date = new Date(item.createdAt);
          return (
            date.getMonth() + 1 == data.selectDate.month &&
            date.getFullYear() == data.selectDate.year
          );
        });
        data.item = data.item.map((item) => {
          return {
            ...item,
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

    onMounted(async () => {
      const now = new Date();
      data.selectDate = { month: now.getMonth() + 1, year: now.getFullYear() };
      await refresh();
    });
    return {
      data,
      isNotification,
      isNotiModal,
      handleCreate,
      handleView,
      handleDate,
    };
  },
};
</script>
<template>
  <div class="body m-0 px-3">
    <div class="border-radius mb-3 row m-0 justify-content-start">
      <div class="input-group col-2 align-items-center ml-2">
        <input
          type="month"
          @input="handleDate"
          class="select border rounded p-1 w-100"
          style="height: 36px"
        />
      </div>
      <div class="input-group col-3 p-0 align-items-center">
        <input
          type="search"
          v-model="data.searchText"
          placeholder="Tìm kiếm theo nội dung"
          class="select border rounded p-1 w-100"
          style="height: 36px"
        />
      </div>
      <div class="row justify-content-end m-0 p-0 col">
        <button
          class="btn btn-primary p-0 mr-4 col-3"
          style="height: 36px; margin-top: 6px; margin-right: -9%"
        >
          <div
            class="row justify-content-center plus"
            data-toggle="modal"
            data-target="#addNotificationModal"
            @click="isNotification = !isNotification"
          >
            <span class="material-symbols-outlined" style="color: var(--white)">
              add
            </span>
            <span style="color: var(--white); font-size: 16px" class="px-1"
              >Thông báo</span
            >
          </div>
        </button>
      </div>
    </div>
    <h5 class="title text-center my-3">
      Danh sách thông báo tháng {{ data.selectDate.month }}/
      {{ data.selectDate.year }}
    </h5>

    <table class="table">
      <thead class="thead-dark">
        <tr>
          <th>Ngày tạo</th>
          <th class="w-100">Nội dung</th>

          <th scope="col"></th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="(value, index) in data.setPage"
          :key="index"
          class="m-0 p-0"
          style="line-height: 2"
        >
          <td class="m-0 px-1 py-0" style="width: 10%">
            {{ value.createdAt }}
          </td>

          <td
            class="m-0 px-1 py-0 w-100"
            style="
              word-wrap: break-word;
              overflow-wrap: break-word;
              white-space: normal;
            "
          >
            {{ value.content }}
          </td>

          <td class="ml-2 text-center">
            <span
              class="material-symbols-outlined mr-1"
              data-toggle="modal"
              data-target="#visibilityNotiModal"
              @click="handleView(value._id)"
            >
              visibility
            </span>
          </td>
        </tr>
      </tbody>
    </table>

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
    <View
      v-if="isNotiModal"
      :_id="data.selectNoti"
      @closeModal="isNotiModal = !isNotiModal"
    ></View>
    <Add
      v-if="isNotification"
      @closeModal="isNotification = !isNotification"
      @add="handleCreate"
    ></Add>
  </div>
</template>
<style scoped>
.body {
  height: 100vh; /* Đặt chiều cao cho .body theo chiều cao của viewport */
  overflow: auto; /* Cho phép nội dung trượt khi vượt quá chiều cao của .body */
}
.select {
  background-color: var(--background);
}
</style>
