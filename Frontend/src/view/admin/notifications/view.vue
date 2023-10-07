<script>
import { reactive, onMounted, ref, onBeforeMount, computed } from "vue";
import _ from "lodash";

//service
import notificationService from "../../../service/notification.service";
import user_notificationService from "../../../service/user_notification.service";
//component
import Table from "../../../components/table/table.vue";
import paginationVue from "../../../components/pagination/pagination.vue";

//js
import { formatDateTime } from "../../../assets/js/format.common";

export default {
  components: { Table, paginationVue },
  props: { _id: { type: String, default: "" } },
  setup(props, { emit }) {
    const data = reactive({
      item: [{ userName: "" }],
      setPage: [],
      searchPage: [],
      searchText: "",
      currentPage: 0,
      sizePage: 2,
      length: 0,
      totalPage: 0,
    });
    const isModalOpen = ref(false);
    data.length = computed(() =>
      data.item.Users ? data.item.Users.length : 0
    );
    data.totalPage = computed(() =>
      data.item.Users ? Math.ceil(data.item.Users.length / data.sizePage) : 0
    );
    data.searchPage = computed(
      () => (
        (data.currentPage = 1),
        data.item.Users
          ? data.item.Users.filter((item) =>
              item.userName
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
    const openModal = () => {
      isModalOpen.value = true;
      console.log("open modal visibility noti");
    };
    const closeModal = () => {
      console.log("close modal visibility noti");
      emit("closeModal");
    };
    const refresh = async () => {
      try {
        const documentNoti = await user_notificationService.get(props._id);
        data.item = documentNoti.message;
        console.log(data.item);
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
      console.log("PropsId:", props._id);
      await refresh();
      $("#visibilityNotiModal").on("show.bs.modal", openModal); //lắng nghe mở modal
      $("#visibilityNotiModal").on("hidden.bs.modal", closeModal); //lắng nghe đóng modal
    });
    return { data, formatDateTime };
  },
};
</script>
<template>
  <div
    class="modal fade"
    id="visibilityNotiModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title title" id="exampleModalLabel">
            Thông tin thông báo
          </h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="row justify-content-start p-0 m-0">
            <label class="col-2">Ngày tạo : </label>
            <label class="col-10"> {{ formatDateTime(data.item.date) }}</label>
          </div>
          <div class="row justify-content-start p-0 m-0">
            <label class="col-2">Nội dung : </label>
            <label class="col-10"> {{ data.item.content }}</label>
          </div>
          <Table
            :data="data.setPage"
            :name="'Noti'"
            :fields="['Họ tên', 'GT', 'SĐT', 'Email', 'Địa chỉ']"
            :titles="['userName', 'sex', 'phone', 'email', 'address']"
            :action="false"
          ></Table>
        </div>
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
    </div>
  </div>
</template>
<style scoped>
.modal-content {
  width: 160%;
  margin-left: -16%;
}
img {
  width: 200px;
  height: 200px;
  object-fit: contain;
}
</style>
