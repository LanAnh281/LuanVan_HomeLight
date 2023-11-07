<script>
import { reactive, onMounted, computed } from "vue";
import moment from "moment";
//service
import userRoomService from "../../../../service/user_room.service";
import userService from "../../../../service/user.service";

// js
import { formatDateTime } from "../../../../assets/js/format.common";
//component
import paginationVue from "../../../../components/pagination/pagination.vue";
import Table from "../../../../components/table/tableChecked.table.vue";
import roomService from "../../../../service/room.service";
export default {
  components: { paginationVue, Table },
  props: { _id: { type: String, default: "" } },
  setup(props, { emit }) {
    const data = reactive({
      item: [],
      userRoom: [{ Users: [] }],
      setPage: [],
      searchText: "",
      searchPage: [],
      checkedList: [],
      checkedNewList: [],
      removeList: [],
      currentPage: 1,
      sizePage: 5,
      totalPage: 0,
      length: 0,
    });
    data.totalPage = computed(() =>
      data.searchPage ? Math.ceil(data.searchPage.length / data.sizePage) : 0
    );
    data.searchPage = computed(
      () => (
        (data.currentPage = 1),
        data.item
          ? data.item.filter((item) =>
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

    const save = async () => {
      data.item.forEach((value) => {
        if (value.checked) data.checkedNewList.push(value);
      });

      data.removeList = data.checkedList.filter(
        (item) => !data.checkedNewList.includes(item)
      );
      try {
        data.removeList.forEach(async (value) => {
          const documentRemove = await userRoomService.delete(props._id, {
            UserId: value._id,
            RoomId: props._id,
          });
        });
        const start = new moment();
        data.checkedNewList.forEach(async (value) => {
          const documentAdd = await userRoomService.create({
            UserId: value._id,
            RoomId: props._id,
            start: start,
          });
          await refresh();
        });
        const documentUserRoom = await userRoomService.get(props._id);
        if (documentUserRoom.message.Users.length == 0) {
          const documentRoom = await roomService.update(props._id, {
            name: documentUserRoom.message.name,
            price: documentUserRoom.message.price,
            area: documentUserRoom.message.area,
            status: false,
            boardingId: documentUserRoom.message.boardingId,
          });
        } else {
          const documentRoom = await roomService.update(props._id, {
            name: documentUserRoom.message.name,
            price: documentUserRoom.message.price,
            wide: documentUserRoom.message.wide,
            status: true,
            boardingId: documentUserRoom.message.boardingId,
          });
        }
        emit("changeStatus");
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
      const document = await userService.getAll();
      data.item = document.message;
      //Lấy danh sách khách trọ của tất cả các phòng
      let getAll = await userRoomService.getAll();
      getAll = getAll.message;
      //lọc ds khách trọ của các phòng khác
      getAll = getAll.filter((item) => item.RoomId != props._id);
      // danh sách khách trọ chưa thuê và đang thuê phòng đang chọn
      data.item = data.item.filter(
        (item) => !getAll.some((obj) => obj.UserId === item._id)
      );
      // lấy danh sách khách trọ của 1 phòng
      data.userRoom = await userRoomService.getAllRoom(props._id);
      data.userRoom = data.userRoom.message;
      //Thay đổi 1 số thuộc tính của khách trọ và xác định khách trọ nào đang thuê phòng trọ hiện tại bằng checked
      data.item = data.item.map((item) => {
        return {
          ...item,
          birthday: formatDateTime(item.birthday),
          sex: item.sex ? "Nữ" : "Nam",
          checked: data.userRoom.some((obj) => obj.UserId === item._id),
        };
      });

      data.checkedList = []; // khởi tạo ds các khách đang thuê phòng hiện tại
      data.checkedNewList = []; // khởi tạo ds khách trọ mới
      data.removeList = []; // khởi tạo ds khách trọ rời khỏi phòng trọ
      data.item.forEach((value) => {
        if (value.checked) {
          data.checkedList.push(value);
        }
      });
      data.length = data.item.length; // dùng để hiển thị số bản ghi ở dưới phân trang
    };
    onMounted(async () => {
      await refresh();
    });
    return { data, save };
  },
};
</script>
<template>
  <div>
    <input
      type="search"
      placeholder="tìm kiếm theo tên"
      class="p-1 border rounded mb-2 w-100"
      style="background-color: var(--background); width: 30%"
      v-model="data.searchText"
    />

    <Table
      :data="data.setPage"
      :fields="['Họ tên', 'GT', 'Địa chỉ', 'SĐT']"
      :titles="['userName', 'sex', 'address', 'phone']"
      :currentPage="data.currentPage"
      :sizePage="data.sizePage"
      :isInputChecked="true"
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
    <div class="centered-button">
      <button class="btn btn-login" @click="save">Lưu</button>
    </div>
  </div>
</template>
<style scope>
.centered-button {
  display: flex;
  justify-content: center; /* Căn giữa theo chiều ngang */
  align-items: center; /* Căn giữa theo chiều dọc */
}
.btn-login:hover {
  text-shadow: 0 2px 20px #fff;
  color: #fff;
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
<!-- 
  td:nth-child(1) {
  width: 2%;
}
td:nth-child(2) {
  max-width: 20%;
}
td:nth-child(3) {
  max-width: 6%; /* Đặt chiều rộng cố định cho cột "Địa chỉ" */
}
td:nth-child(4) {
  width: 40%; /* Đặt chiều rộng cố định cho cột "Địa chỉ" */
  white-space: normal;
  text-overflow: ellipsis;
}
td:nth-child(5) {
  max-width: 10%; /* Đặt chiều rộng cố định cho cột "Địa chỉ" */
}
table {
  width: 100%;
}

th,
td {
  border: 1px solid #ccc;
  word-wrap: break-word;
}
 -->
