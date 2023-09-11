<script>
import { reactive, ref, onMounted, onBeforeMount, computed } from "vue";
//service
import userRoomService from "../../../../service/user_room.service";
// js
import { formatDateTime } from "../../../../assets/js/format.common";
//component
import paginationVue from "../../../../components/pagination/pagination.vue";
import Table from "../../../../components/table/table.vue";
export default {
  components: { paginationVue, Table },
  props: { _id: { type: String, default: "" } },
  setup(props, { emit }) {
    const data = reactive({
      item: [{ Users: [] }],
      setPage: [],
      currentPage: 1,
      sizePage: 2,
      totalPage: 0,
    });
    data.totalPage = computed(() =>
      data.item.Users
        ? Math.round(Math.ceil(data.item.Users.length) / data.sizePage)
        : 0
    );
    data.setPage = computed(() =>
      data.item.Users
        ? data.item.Users.slice(
            (data.currentPage - 1) * data.sizePage,
            data.currentPage * data.sizePage
          )
        : []
    );
    onMounted(async () => {
      const document = await userRoomService.get(props._id);
      data.item = document.message;

      data.item.Users = data.item.Users.map((item) => {
        return {
          ...item,
          userRoomStart: formatDateTime(item.User_Room.start),
          userRoomEnd: formatDateTime(item.User_Room.end),
        };
      });
    });
    return { data, formatDateTime };
  },
};
</script>
<template>
  <div>
    <Table
      :data="data.setPage"
      :fields="['Họ tên', 'Địa chỉ', 'SĐT', 'Bắt đầu']"
      :titles="['userName', 'address', 'phone', 'userRoomStart']"
      :action="true"
      :actionList="['close']"
      :currentPage="data.currentPage"
      :sizePage="data.sizePage"
      @close="
        (value) => {
          console.log(`${value}`); // trả phòng
        }
      "
    ></Table>
    <paginationVue
      :currentPage="data.currentPage"
      :totalPage="data.totalPage"
      :size="data.sizePage"
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
<style scope>
table {
  width: 100%;
}

th,
td {
  padding: 10px;
  border: 1px solid #ccc;
  word-wrap: break-word;
}

td:nth-child(2) {
  width: 25%;
}
td:nth-child(3) {
  width: 30%; /* Đặt chiều rộng cố định cho cột "Địa chỉ" */
  white-space: normal;
  text-overflow: ellipsis;
}
td:nth-child(4) {
  width: 22%;
}
td:nth-child(5) {
  width: 22%;
}
.close-icon {
  background-color: red;
  color: rgb(242, 244, 245);
  font-size: 1.6rem !important;
  margin-right: 3px;
}
.close-icon:hover {
  color: white;
  background-color: red;
  box-shadow: 0 0 10px #e1ff00;
}
</style>
