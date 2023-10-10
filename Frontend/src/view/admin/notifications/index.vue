<script>
import { ref, onMounted, reactive, watch, computed } from "vue";
import socket from "../../../socket";

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
      item: [],
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
        console.log(value);
        data.selectDate = {
          month: date.getMonth() + 1,
          year: date.getFullYear(),
        };
        await refresh();
        console.log(data.selectDate);
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
          const date = new Date(item.date);
          return (
            date.getMonth() + 1 == data.selectDate.month &&
            date.getFullYear() == data.selectDate.year
          );
        });
        data.item = data.item.map((item) => {
          return {
            ...item,
            date: formatDateTime(item.date),
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
  <div class="body m-0">
    <div class="border-radius my-3 row m-0 justify-content-start">
      <div class="input-group col-2 align-items-center ml-2">
        <input
          type="date"
          @input="handleDate"
          class="select border rounded p-1"
        />
      </div>
      <div class="input-group col-3 m-0 p-0 align-items-center">
        <input
          type="search"
          v-model="data.searchText"
          placeholder="Tìm kiếm theo nội dung"
          class="select border rounded p-1 w-100"
        />
      </div>
      <div class="row justify-content-end m-0 p-0 col">
        <button
          class="btn btn-primary p-0 mr-4 col-3"
          style="width: 24%; height: 36px; margin-top: 6px; margin-right: -9%"
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
            <span style="color: var(--white); font-size: 16px"
              >Thêm thông báo</span
            >
          </div>
        </button>
      </div>
    </div>
    <Table
      :data="data.setPage"
      :name="'Noti'"
      :fields="['Ngày tạo', 'Nội dung']"
      :titles="['date', 'content']"
      :action="true"
      :actionList="['visibility']"
      :isInputChecked="true"
      :currentPage="data.currentPage"
      :sizePage="data.sizePage"
      @visibility="
        (value) => {
          handleView(value);
        }
      "
    ></Table>
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
  min-height: 100vh;
}
.select {
  background-color: var(--background);
}
</style>
