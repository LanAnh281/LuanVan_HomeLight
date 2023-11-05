<script>
import { reactive, onMounted, computed } from "vue";
//service
import userRoomService from "../../../../service/user_room.service";
// js
import { formatDateTime } from "../../../../assets/js/format.common";
//component
import paginationVue from "../../../../components/pagination/pagination.vue";
import Table from "../../../../components/table/tableChecked.table.vue";
export default {
  components: { paginationVue, Table },
  props: { _id: { type: String, default: "" } },
  setup(props, { emit }) {
    const data = reactive({
      item: [{ Users: [] }],
      setPage: [],
      currentPage: 1,
      sizePage: 3,
      totalPage: 0,
      length: 0,
    });
    data.totalPage = computed(() =>
      data.item.Users ? Math.ceil(data.item.Users.length / data.sizePage) : 0
    );
    data.setPage = computed(() =>
      data.item.Users
        ? data.item.Users.slice(
            (data.currentPage - 1) * data.sizePage,
            data.currentPage * data.sizePage
          )
        : []
    );

    const refresh = async () => {
      const document = await userRoomService.get(props._id);
      data.item = document.message;

      data.item.Users = data.item.Users.map((item) => {
        return {
          ...item,
          userRoomStart: formatDateTime(item.User_Room.start),
          userRoomEnd: formatDateTime(item.User_Room.end),
        };
      });
      data.length = data.item.Users.length;
    };
    onMounted(async () => {
      await refresh();
    });
    return { data };
  },
};
</script>
<template>
  <div>
    <Table
      class="table"
      :data="data.setPage"
      :fields="['Họ tên', 'Địa chỉ', 'SĐT', 'Bắt đầu']"
      :titles="['userName', 'address', 'phone', 'userRoomStart']"
      :action="false"
      :currentPage="data.currentPage"
      :sizePage="data.sizePage"
      :isInputChecked="false"
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
  </div>
</template>
<style scope>
table {
  width: 100%;
}
th {
  padding: 0px;
  text-align: center;
  line-height: 3;
}
th,
td {
  padding: 10px;
  border: 1px solid #ccc;
  word-wrap: break-word;
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
