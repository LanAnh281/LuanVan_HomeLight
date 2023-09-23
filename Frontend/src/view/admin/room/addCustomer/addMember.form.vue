<script>
import { reactive, ref, onMounted, onBeforeMount, computed } from "vue";
import Swal from "sweetalert2";

//service
import userRoomService from "../../../../service/user_room.service";
import roomService from "../../../../service/room.service";
// js
import { formatDateTime } from "../../../../assets/js/format.common";
//component
import paginationVue from "../../../../components/pagination/pagination.vue";
import Table from "../../../../components/table/table.vue";
import {
  successAd,
  deleted,
  warning,
} from "../../../../assets/js/common.alert";
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

    const handleDelete = async (value) => {
      try {
        const isDeleted = await deleted(
          "Xóa khách trọ",
          "Bạn có chắc chắn xóa khách trọ này không?"
        );
        if (isDeleted == true) {
          // xóa khách trọ khỏi user_room
          const documentDelete = await userRoomService.delete(props._id, {
            UserId: value,
            RoomId: props._id,
          });
          if (documentDelete["status"] == "success") {
            successAd("Thành công ");
            await refresh();
            if (data.item.Users.length == 0) {
              const documentUserRoom = await userRoomService.get(props._id);
              const documentRoom = await roomService.update(props._id, {
                name: documentUserRoom.message.name,
                price: documentUserRoom.message.price,
                wide: documentUserRoom.message.wide,
                long: documentUserRoom.message.long,

                status: false,
                boardingId: documentUserRoom.message.boardingId,
              });
            }
            emit("changeStatus");
          }
        }
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
    return { data, handleDelete };
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
      :actionList="['cancel']"
      :currentPage="data.currentPage"
      :sizePage="data.sizePage"
      @cancel="handleDelete"
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
</style>
<!-- td:nth-child(2) {
  width: 25%;
}
td:nth-child(3) {
  width: 28%; /* Đặt chiều rộng cố định cho cột "Địa chỉ" */
  white-space: normal;
  text-overflow: ellipsis;
}
td:nth-child(4) {
  width: 24%;
  padding: auto 0;
}
td:nth-child(5) {
  width: 22%;
  padding: auto 0;
}
td:nth-child(6) {
  width: 5%;
}
 -->
