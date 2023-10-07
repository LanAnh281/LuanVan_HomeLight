<script>
import { ref, onMounted, reactive, watch, computed } from "vue";
import socket from "../../../socket";

//service
import NotificationService from "../../../service/notification.service";
//component
import Add from "./add.vue";
import Table from "../../../components/table/table.vue";
import View from "./view.vue";
//js
import { formatDateTime } from "../../../assets/js/format.common";
export default {
  components: { Add, Table, View },
  setup() {
    const data = reactive({
      item: [],
      setPage: [],
      searchPage: [],
      searchText: "",
      currentPage: 0,
      sizePage: 6,
      length: 0,
      totalPage: 0,
      selectNoti: "",
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
    const handleCreate = () => {
      socket.on("noti", (msg) => console.log(msg));
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

    const refresh = async () => {
      try {
        const documentNoti = await NotificationService.getAll();
        data.item = documentNoti.message;
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
      await refresh();
    });
    return { data, isNotification, isNotiModal, handleCreate, handleView };
  },
};
</script>
<template>
  <div class="body m-0">
    <div class="border-radius my-3 row m-0 justify-content-start">
      <div class="col-6"></div>
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
          console.log(value);
          handleView(value);
        }
      "
    ></Table>

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
</style>
