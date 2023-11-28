<script>
import { reactive, onMounted, watch, computed } from "vue";
import Swal from "sweetalert2";

//service
import roomService from "../../../service/room.service";
import service_roomService from "../../../service/service_room.service";

import userRoomService from "../../../service/user_room.service";
import UtilityReadingsService from "../../../service/UtilityReadings.service";
import billService from "../../../service/bill.service";
//asset  js
import { success, deleted, warning } from "../../../assets/js/common.alert";
//component
import Edit from "./edit.vue";
import userService from "../../../service/user.service";

export default {
  comments: { Edit },
  props: {
    data: { type: Array, default: [] },
    _idBoarding: { type: String, default: "" },
    currentPage: { type: Number, default: 1 },
    status: { type: Object, default: { _id: "" } },
    searchText: {},
  },
  setup(props, { emit }) {
    const data = reactive({
      item: [{ name: "" }],
      uti: {
        previousElectric: "",
        currentElectric: "",
        previousWater: "",
        currentWater: "",
        date: new Date(),
        roomId: "",
      },
      bill: { end: "", roomId: "" },
      totalPage: 0,
      length: 0,
      sizePage: 20,
      setPage: [],
      searchPage: [],
    });

    data.totalPage = computed(() =>
      data.searchPage ? Math.ceil(data.searchPage.length / data.sizePage) : 0
    );
    data.length = computed(() => data.searchPage.length);
    data.searchPage = computed(
      () => (
        (data.currentPage = 1),
        data.item
          ? data.item.filter((item) =>
              item.name
                .toLowerCase()
                .includes(props.searchText.toLocaleLowerCase())
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

    const handleEdit = async (value) => {
      try {
        const showSweetAlert = async () => {
          const { value: formValues } = await Swal.fire({
            title: "Điện nước tiêu thụ",
            html: `
              <div  class='row  form-group ml-2 '>
                <label class='col-3'>Điện mới:</label>
                <input type='number' id="electric" class='col-9 form-control'></input>
              </div>
              <div class='row form-group   ml-2'>
                <label class='col-3'>Nước mới:</label>
                <input type='number' id="water" class='col-9 form-control'></input>
              </div>
            `,

            focusConfirm: false,
            preConfirm: () => {
              const currentElectric = document.getElementById("electric").value;
              const currentWater = document.getElementById("water").value;
              if (!currentElectric || !currentWater) {
                Swal.showValidationMessage("Vui lòng điền đầy đủ thông tin");
              }
              return {
                currentElectric,
                currentWater,
              };
            },
          });
          return formValues;
        };

        // Gọi hàm showSweetAlert khi bạn muốn hiển thị SweetAlert
        const formValues = await showSweetAlert();
        // trả phòng
        if (formValues) {
          // create chỉ số điện nước
          const documentUti = await UtilityReadingsService.get(value);
          data.uti = {
            previousElectric: 0,
            currentElectric: formValues.currentElectric,
            previousWater: 0,
            currentWater: formValues.currentWater,
            date: new Date(),
            roomId: value,
          };
          if (documentUti.message != undefined) {
            data.uti = {
              previousElectric: documentUti.message.currentElectric
                ? documentUti.message.currentElectric
                : 0,
              currentElectric: formValues.currentElectric,
              previousWater: documentUti.message.currentWater
                ? documentUti.message.currentWater
                : 0,
              currentWater: formValues.currentWater,
              date: new Date(),
              roomId: value,
            };
          }

          const creatUti = await UtilityReadingsService.create(data.uti);
          // api  tính tiền
          const end = new Date();
          data.bill = {
            end: new Date(),
            roomId: value,
          };
          const documentBill = await billService.create(data.bill);
          // lấy thông tin phòng và thông tin khách qua api
          const documentUserRoom = await userRoomService.get(value);
          //cập nhật trạng thái phòng
          const documentRoom = await roomService.update(value, {
            name: documentUserRoom.message.name,
            price: documentUserRoom.message.price,
            wide: documentUserRoom.message.wide,
            long: documentUserRoom.message.long,
            status: false,
            boardingId: documentUserRoom.message.boardingId,
          });
          // xóa các dịch vụ của phòng
          const documentService = await service_roomService.deleteAll(value);

          //xóa tất cả tài khoản và user khách trọ
          for (let value of documentUserRoom.message.Users) {
            const deleteUser = await userService.delete(value._id);
          }
          // xóa tất cả khách trọ ra khỏi phòng
          const document = await userRoomService.deleteAll(value);
          // await refresh();

          emit("out");
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
    const handleDelete = async (value) => {
      try {
        const users = await userRoomService.getAllRoom(value);
        if (users.message.length == 0) {
          const isDeleted = await deleted(
            "Xóa",
            "Bạn có chắc chắc xóa phòng trọ."
          );
          if (isDeleted) {
            const document = await roomService.delete(value);
            document["status"] == "success"
              ? success("Thành công")
              : warning("Thất bại", "");
            emit("handleDelete");
          }
        } else {
          warning(
            "Cảnh báo",
            "Phòng trọ hiện đang có khách thuê. Bạn cần trả phòng trọ."
          );
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
    watch(
      () => props._idBoarding,
      async (newValue, oldValue) => {
        await refresh();
      }
    );
    watch(
      () => props.searchText,
      async (newValue, oldValue) => {
        await refresh();
      }
    );
    watch(
      () => props.currentPage,
      (newValue, oldValue) => {
        data.currentPage = props.currentPage;
      }
    );
    const refresh = async () => {
      data.item = await roomService.getAll();
      data.item = data.item.message;

      data.item = data.item.filter(
        (item) =>
          item.boardingId == props._idBoarding &&
          item.status == !props.status["_id"]
      );

      data.item = data.item.map((item) => {
        return {
          ...item,
          price: Number(item.price).toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          }),
        };
      });
      // data.length = data.item.length;
      emit("totalPage", { totalPage: data.totalPage, length: data.length });
    };
    watch(
      () => props.status,
      async (newValue, oldValue) => {
        await refresh();
      }
    );

    onMounted(async () => {
      await refresh();
    });
    return { data, handleDelete, handleEdit };
  },
};
</script>
<template>
  <!-- display: grid; grid-template-columns: repeat(6, 1fr) -->
  <div>
    <div class="row justify-content-start mr-1">
      <div
        class="card p-2 mb-2 col-md-2 col-6"
        v-for="(value, index) in data.setPage"
        style="border-radius: 5px"
        :key="index"
      >
        <div class="card-item p-0">
          <!-- image -->
          <!-- <img
            class="card-img-top"
            src="../../../assets/image/lightHouse.png"
            style="object-fit: contain; height: 30%; width: 100%"
          />
          <hr style="display: block" /> -->
          <!--  -->
          <div class="mb-1 mx-1 mt-2">
            <p class="card-title text-center">
              <strong>Phòng : {{ value.name }} </strong>
            </p>
            <p class="card-text">
              <b>Giá phòng:</b>
              {{ value.price }}
            </p>
            <p class="card-text">
              <b>Diện tích:</b> {{ value.long }} x {{ value.wide }} m²
            </p>
          </div>

          <!-- icon -->
          <div class="text-center">
            <span
              class="material-symbols-outlined m-2 view border rounded p-1"
              style="font-size: 1.4rem"
              title="chi tiết"
              data-toggle="modal"
              :data-target="
                status['_id'] ? '#viewRoomStatusModal' : '#viewRoomModal'
              "
              @click="$emit('view', value._id)"
            >
              visibility
            </span>
            <!-- Edit -->
            <span
              class="material-symbols-outlined mr-1 edit border rounded p-1"
              style="font-size: 1.4rem"
              title="chỉnh sửa"
              data-toggle="modal"
              data-target="#roomUpdateModal"
              @click="$emit('edit', value._id)"
            >
              edit
            </span>
            <!-- delete room -->
            <span
              v-if="status['_id']"
              class="material-symbols-outlined mr-1 delete border rounded p-1"
              style="font-size: 1.4rem"
              title="xóa phòng"
              @click="handleDelete(value._id)"
            >
              close
            </span>
            <!-- trả phòng -->
            <span
              v-if="!status['_id']"
              class="material-symbols-outlined out border rounded p-1"
              style="font-size: 1.4rem"
              title="trả phòng"
              @click="handleEdit(value._id)"
            >
              logout
            </span>
          </div>
          <!-- Add customer -->
          <div class="px-2 mt-1 my-1 mb-2 text-center">
            <button
              class="btn btn-primary btn-menu p-1"
              data-toggle="modal"
              data-target="#addCustomerModal"
              @click="$emit('addCutomer', value._id)"
              style="font-size: 0.8rem; width: 100%"
            >
              Thêm khách
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.card-item {
  position: relative;
  cursor: pointer;
}

.delete-icon,
.edit-icon {
  position: absolute;
  cursor: pointer;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  text-align: center;
  line-height: 1;
  font-size: 1.2rem;
  background-color: #fbf9f9;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
}
.delete-icon {
  top: -10px;
  right: -4px;
  color: var(--red);
  font-weight: 600;
}
.delete-icon:hover {
  color: red;
  font-size: 1.3rem;
}
.edit-icon {
  top: 16px;
  right: -4px;
  color: var(--yellow);
}
.edit-icon:hover {
  color: rgb(247, 203, 6);
  font-size: 1.3rem;
}

.view:hover {
  color: #00f0ff;
  text-shadow: 0 0 2px #00f0ff;
  box-shadow: 0 0 4px #00f0ff;
  transition: 0.5s;
}
.out:hover {
  color: #03f803;
  text-shadow: 0 0 2px #00ff00;
  box-shadow: 0 0 4px #00ff00;
  transition: 0.5s;
}
.delete:hover {
  color: #f80303;
  text-shadow: 0 0 2px #ff6200;
  box-shadow: 0 0 4px #ff0000;
  transition: 0.5s;
}
.edit:hover {
  color: #f8cb03;
  text-shadow: 0 0 2px #ffbb00;
  box-shadow: 0 0 4px #ffae00;
  transition: 0.5s;
}
button:hover {
  text-shadow: 0 0 5px #fff;
}
.edit-icon:hover {
  text-shadow: 0 0 5px #f8d435;
}
.delete-icon:hover {
  text-shadow: 0 0 5px #e6d4cd;
}
.btn-menu {
  width: 114px;
}
</style>
